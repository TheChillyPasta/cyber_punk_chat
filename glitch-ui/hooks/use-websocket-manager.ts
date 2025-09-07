import { useRef, useCallback, useEffect, useState } from 'react'

interface WebSocketMessage {
  id: string
  text: string
  sender: string
  timestamp: string
  type?: string
  user_id?: string
  [key: string]: any
}

interface ConnectionQuality {
  latency: number
  lastPing: number
  isStable: boolean
}

interface WebSocketConnection {
  ws: WebSocket
  chatId: string
  isConnected: boolean
  error: string | null
  connectionQuality: ConnectionQuality
  queuedMessages: Array<{ text: string; type: string }>
  heartbeatTimeout: NodeJS.Timeout | null
  pingTimeout: NodeJS.Timeout | null
  lastPingTime: number
  reconnectAttempts: number
  reconnectTimeout: NodeJS.Timeout | null
}

interface UseWebSocketManagerOptions {
  baseUrl: string
  token: string
  onMessage?: (chatId: string, message: WebSocketMessage) => void
  onError?: (chatId: string, error: Event) => void
  onOpen?: (chatId: string) => void
  onClose?: (chatId: string) => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  enableHeartbeat?: boolean
}

export function useWebSocketManager({
  baseUrl,
  token,
  onMessage,
  onError,
  onOpen,
  onClose,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  heartbeatInterval = 30000,
  enableHeartbeat = true,
}: UseWebSocketManagerOptions) {
  const connectionsRef = useRef<Map<string, WebSocketConnection>>(new Map())
  const [activeChatId, setActiveChatId] = useState<string | null>(null)

  // Heartbeat functionality for a specific connection
  const startHeartbeat = useCallback((chatId: string) => {
    const connection = connectionsRef.current.get(chatId)
    if (!connection || !enableHeartbeat) return

    const sendPing = () => {
      if (connection.ws.readyState === WebSocket.OPEN) {
        connection.lastPingTime = Date.now()
        connection.ws.send(JSON.stringify({ type: 'ping', timestamp: connection.lastPingTime }))
        
        // Set timeout for pong response
        connection.pingTimeout = setTimeout(() => {
          console.warn(`Ping timeout for chat ${chatId} - connection may be unstable`)
          connection.connectionQuality.isStable = false
        }, 5000)
      }
    }

    connection.heartbeatTimeout = setTimeout(() => {
      sendPing()
      startHeartbeat(chatId) // Schedule next heartbeat
    }, heartbeatInterval)
  }, [enableHeartbeat, heartbeatInterval])

  const stopHeartbeat = useCallback((chatId: string) => {
    const connection = connectionsRef.current.get(chatId)
    if (!connection) return

    if (connection.heartbeatTimeout) {
      clearTimeout(connection.heartbeatTimeout)
      connection.heartbeatTimeout = null
    }
    if (connection.pingTimeout) {
      clearTimeout(connection.pingTimeout)
      connection.pingTimeout = null
    }
  }, [])

  // Create or get existing connection for a chat
  const getOrCreateConnection = useCallback((chatId: string): WebSocketConnection | null => {
    console.log(`Creating/Getting WebSocket connection for chat: ${chatId}`)
    
    // Return existing connection if it exists and is open
    const existingConnection = connectionsRef.current.get(chatId)
    if (existingConnection && existingConnection.ws.readyState === WebSocket.OPEN) {
      console.log(`Reusing existing connection for chat: ${chatId}`)
      return existingConnection
    }

    // Clean up existing connection if it exists but is not open
    if (existingConnection) {
      console.log(`Cleaning up stale connection for chat: ${chatId}`)
      stopHeartbeat(chatId)
      if (existingConnection.reconnectTimeout) {
        clearTimeout(existingConnection.reconnectTimeout)
      }
      existingConnection.ws.close()
      connectionsRef.current.delete(chatId)
    }

    try {
      const wsUrl = `${baseUrl}/ws/chat/${chatId}/?token=${token}`
      console.log(`Creating new WebSocket connection for chat: ${chatId} at ${wsUrl}`)
      const ws = new WebSocket(wsUrl)
      
      const connection: WebSocketConnection = {
        ws,
        chatId,
        isConnected: false,
        error: null,
        connectionQuality: {
          latency: 0,
          lastPing: 0,
          isStable: false,
        },
        queuedMessages: [],
        heartbeatTimeout: null,
        pingTimeout: null,
        lastPingTime: 0,
        reconnectAttempts: 0,
        reconnectTimeout: null,
      }

      ws.onopen = () => {
        console.log(`WebSocket connected to chat: ${chatId}`)
        connection.isConnected = true
        connection.error = null
        connection.reconnectAttempts = 0
        connection.connectionQuality.isStable = true
        
        // Start heartbeat
        startHeartbeat(chatId)
        
        // Send any queued messages
        if (connection.queuedMessages.length > 0) {
          connection.queuedMessages.forEach(msg => {
            ws.send(JSON.stringify(msg))
          })
          connection.queuedMessages = []
        }
        
        onOpen?.(chatId)
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Handle pong response for heartbeat
          if (data.type === 'pong' && data.timestamp) {
            const latency = Date.now() - data.timestamp
            connection.connectionQuality = {
              ...connection.connectionQuality,
              latency,
              lastPing: Date.now(),
              isStable: latency < 1000 // Consider stable if latency < 1s
            }
            
            // Clear ping timeout
            if (connection.pingTimeout) {
              clearTimeout(connection.pingTimeout)
              connection.pingTimeout = null
            }
            return
          }
          
          if (data.error) {
            connection.error = data.error
            console.error(`WebSocket error for chat ${chatId}:`, data.error)
            onError?.(chatId, new Event('error'))
          } else {
            onMessage?.(chatId, data)
          }
        } catch (err) {
          console.error(`Failed to parse WebSocket message for chat ${chatId}:`, err)
        }
      }

      ws.onerror = (event) => {
        console.error(`WebSocket error for chat ${chatId}:`, event)
        connection.error = 'WebSocket connection error'
        connection.isConnected = false
        onError?.(chatId, event)
      }

      ws.onclose = (event) => {
        console.log(`WebSocket disconnected from chat ${chatId}:`, event.code, event.reason)
        connection.isConnected = false
        connection.connectionQuality.isStable = false
        stopHeartbeat(chatId)
        onClose?.(chatId)

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && connection.reconnectAttempts < maxReconnectAttempts) {
          connection.reconnectAttempts++
          console.log(`Attempting to reconnect chat ${chatId}... (${connection.reconnectAttempts}/${maxReconnectAttempts})`)
          
          // Exponential backoff for reconnection
          const backoffDelay = Math.min(reconnectInterval * Math.pow(2, connection.reconnectAttempts - 1), 30000)
          
          connection.reconnectTimeout = setTimeout(() => {
            // Remove the old connection and create a new one
            connectionsRef.current.delete(chatId)
            getOrCreateConnection(chatId)
          }, backoffDelay)
        } else if (connection.reconnectAttempts >= maxReconnectAttempts) {
          // Remove connection after max attempts
          connectionsRef.current.delete(chatId)
        }
      }

      connectionsRef.current.set(chatId, connection)
      return connection
    } catch (err) {
      console.error(`Failed to create WebSocket connection for chat ${chatId}:`, err)
      return null
    }
  }, [baseUrl, token, onMessage, onError, onOpen, onClose, reconnectInterval, maxReconnectAttempts, startHeartbeat, stopHeartbeat])

  // Connect to a specific chat
  const connectToChat = useCallback((chatId: string) => {
    // Clean up connections to other chats if we have too many connections
    const maxConnections = 3 // Keep max 3 connections to prevent resource exhaustion
    if (connectionsRef.current.size >= maxConnections) {
      // Find the oldest inactive connection to close
      const connections = Array.from(connectionsRef.current.entries())
      const inactiveConnections = connections.filter(([id, conn]) => id !== chatId && !conn.isConnected)
      
      if (inactiveConnections.length > 0) {
        const [oldestChatId] = inactiveConnections[0]
        console.log(`Cleaning up inactive connection to chat: ${oldestChatId}`)
        // Direct cleanup without calling disconnectFromChat to avoid circular dependency
        const connection = connectionsRef.current.get(oldestChatId)
        if (connection) {
          stopHeartbeat(oldestChatId)
          if (connection.reconnectTimeout) {
            clearTimeout(connection.reconnectTimeout)
          }
          connection.ws.close(1000, 'Cleanup')
          connectionsRef.current.delete(oldestChatId)
        }
      } else {
        // If all connections are active, close the oldest one
        const [oldestChatId] = connections[0]
        console.log(`Cleaning up oldest connection to chat: ${oldestChatId}`)
        // Direct cleanup without calling disconnectFromChat to avoid circular dependency
        const connection = connectionsRef.current.get(oldestChatId)
        if (connection) {
          stopHeartbeat(oldestChatId)
          if (connection.reconnectTimeout) {
            clearTimeout(connection.reconnectTimeout)
          }
          connection.ws.close(1000, 'Cleanup')
          connectionsRef.current.delete(oldestChatId)
        }
      }
    }
    
    setActiveChatId(chatId)
    return getOrCreateConnection(chatId)
  }, [getOrCreateConnection, stopHeartbeat])

  // Disconnect from a specific chat
  const disconnectFromChat = useCallback((chatId: string) => {
    const connection = connectionsRef.current.get(chatId)
    if (connection) {
      stopHeartbeat(chatId)
      
      if (connection.reconnectTimeout) {
        clearTimeout(connection.reconnectTimeout)
      }
      
      connection.ws.close(1000, 'Manual disconnect')
      connectionsRef.current.delete(chatId)
    }
    
    if (activeChatId === chatId) {
      setActiveChatId(null)
    }
  }, [activeChatId, stopHeartbeat])

  // Send message to a specific chat
  const sendMessage = useCallback((chatId: string, message: { text: string; type: string; user_id?: string }) => {
    const connection = connectionsRef.current.get(chatId)
    if (connection && connection.ws.readyState === WebSocket.OPEN) {
      connection.ws.send(JSON.stringify(message))
      return true
    } else {
      console.warn(`WebSocket is not connected for chat ${chatId}, queuing message`)
      if (connection) {
        connection.queuedMessages.push(message)
      }
      return false
    }
  }, [])

  // Check if a connection exists for a chat (without creating one)
  const hasConnection = useCallback((chatId: string): boolean => {
    const connection = connectionsRef.current.get(chatId)
    return !!(connection && connection.ws.readyState === WebSocket.OPEN)
  }, [])

  // Get connection status for a specific chat
  const getConnectionStatus = useCallback((chatId: string) => {
    const connection = connectionsRef.current.get(chatId)
    if (!connection) {
      return {
        isConnected: false,
        error: null,
        connectionQuality: { latency: 0, lastPing: 0, isStable: false },
        queuedMessages: []
      }
    }
    
    return {
      isConnected: connection.isConnected,
      error: connection.error,
      connectionQuality: connection.connectionQuality,
      queuedMessages: connection.queuedMessages
    }
  }, [])

  // Get active chat connection status
  const getActiveConnectionStatus = useCallback(() => {
    if (!activeChatId) {
      return {
        isConnected: false,
        error: null,
        connectionQuality: { latency: 0, lastPing: 0, isStable: false },
        queuedMessages: []
      }
    }
    return getConnectionStatus(activeChatId)
  }, [activeChatId, getConnectionStatus])

  // Get connection statistics for debugging
  const getConnectionStats = useCallback(() => {
    const connections = Array.from(connectionsRef.current.entries())
    return {
      totalConnections: connections.length,
      activeConnections: connections.filter(([_, conn]) => conn.isConnected).length,
      connections: connections.map(([chatId, conn]) => ({
        chatId,
        isConnected: conn.isConnected,
        error: conn.error,
        latency: conn.connectionQuality.latency,
        queuedMessages: conn.queuedMessages.length,
      }))
    }
  }, [])

  // Cleanup all connections
  const disconnectAll = useCallback(() => {
    connectionsRef.current.forEach((connection, chatId) => {
      stopHeartbeat(chatId)
      if (connection.reconnectTimeout) {
        clearTimeout(connection.reconnectTimeout)
      }
      connection.ws.close(1000, 'Cleanup')
    })
    connectionsRef.current.clear()
    setActiveChatId(null)
  }, [stopHeartbeat])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnectAll()
    }
  }, [disconnectAll])

  return {
    activeChatId,
    connectToChat,
    disconnectFromChat,
    sendMessage,
    hasConnection,
    getConnectionStatus,
    getActiveConnectionStatus,
    getConnectionStats,
    disconnectAll,
  }
}
