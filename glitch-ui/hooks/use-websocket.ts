import { useEffect, useRef, useState, useCallback } from 'react'

interface WebSocketMessage {
  text: string
  sender: string
  timestamp: string
  type?: string
  [key: string]: any
}

interface UseWebSocketOptions {
  url: string
  token: string
  onMessage?: (message: WebSocketMessage) => void
  onError?: (error: Event) => void
  onOpen?: () => void
  onClose?: () => void
  reconnectInterval?: number
  maxReconnectAttempts?: number
  heartbeatInterval?: number
  enableHeartbeat?: boolean
}

interface ConnectionQuality {
  latency: number
  lastPing: number
  isStable: boolean
}

export function useWebSocket({
  url,
  token,
  onMessage,
  onError,
  onOpen,
  onClose,
  reconnectInterval = 3000,
  maxReconnectAttempts = 5,
  heartbeatInterval = 30000,
  enableHeartbeat = true,
}: UseWebSocketOptions) {
  const [isConnected, setIsConnected] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [connectionQuality, setConnectionQuality] = useState<ConnectionQuality>({
    latency: 0,
    lastPing: 0,
    isStable: false,
  })
  const [queuedMessages, setQueuedMessages] = useState<Array<{ text: string; type: string }>>([])
  
  const wsRef = useRef<WebSocket | null>(null)
  const reconnectAttemptsRef = useRef(0)
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const heartbeatTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const pingTimeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastPingTimeRef = useRef<number>(0)

  // Heartbeat functionality
  const startHeartbeat = useCallback(() => {
    if (!enableHeartbeat) return
    
    const sendPing = () => {
      if (wsRef.current?.readyState === WebSocket.OPEN) {
        lastPingTimeRef.current = Date.now()
        wsRef.current.send(JSON.stringify({ type: 'ping', timestamp: lastPingTimeRef.current }))
        
        // Set timeout for pong response
        pingTimeoutRef.current = setTimeout(() => {
          console.warn('Ping timeout - connection may be unstable')
          setConnectionQuality(prev => ({ ...prev, isStable: false }))
        }, 5000)
      }
    }

    heartbeatTimeoutRef.current = setTimeout(() => {
      sendPing()
      startHeartbeat() // Schedule next heartbeat
    }, heartbeatInterval)
  }, [enableHeartbeat, heartbeatInterval])

  const stopHeartbeat = useCallback(() => {
    if (heartbeatTimeoutRef.current) {
      clearTimeout(heartbeatTimeoutRef.current)
      heartbeatTimeoutRef.current = null
    }
    if (pingTimeoutRef.current) {
      clearTimeout(pingTimeoutRef.current)
      pingTimeoutRef.current = null
    }
  }, [])

  const connect = useCallback(() => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return
    }

    try {
      const wsUrl = `${url}?token=${token}`
      const ws = new WebSocket(wsUrl)
      
      ws.onopen = () => {
        console.log('WebSocket connected')
        setIsConnected(true)
        setError(null)
        reconnectAttemptsRef.current = 0
        setConnectionQuality(prev => ({ ...prev, isStable: true }))
        
        // Start heartbeat
        startHeartbeat()
        
        // Send any queued messages
        if (queuedMessages.length > 0) {
          queuedMessages.forEach(msg => {
            ws.send(JSON.stringify(msg))
          })
          setQueuedMessages([])
        }
        
        onOpen?.()
      }

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data)
          
          // Handle pong response for heartbeat
          if (data.type === 'pong' && data.timestamp) {
            const latency = Date.now() - data.timestamp
            setConnectionQuality(prev => ({
              ...prev,
              latency,
              lastPing: Date.now(),
              isStable: latency < 1000 // Consider stable if latency < 1s
            }))
            
            // Clear ping timeout
            if (pingTimeoutRef.current) {
              clearTimeout(pingTimeoutRef.current)
              pingTimeoutRef.current = null
            }
            return
          }
          
          if (data.error) {
            setError(data.error)
            console.error('WebSocket error:', data.error)
          } else {
            onMessage?.(data)
          }
        } catch (err) {
          console.error('Failed to parse WebSocket message:', err)
        }
      }

      ws.onerror = (event) => {
        console.error('WebSocket error:', event)
        setError('WebSocket connection error')
        onError?.(event)
      }

      ws.onclose = (event) => {
        console.log('WebSocket disconnected:', event.code, event.reason)
        setIsConnected(false)
        setConnectionQuality(prev => ({ ...prev, isStable: false }))
        stopHeartbeat()
        onClose?.()

        // Attempt to reconnect if not a normal closure
        if (event.code !== 1000 && reconnectAttemptsRef.current < maxReconnectAttempts) {
          reconnectAttemptsRef.current++
          console.log(`Attempting to reconnect... (${reconnectAttemptsRef.current}/${maxReconnectAttempts})`)
          
          // Exponential backoff for reconnection
          const backoffDelay = Math.min(reconnectInterval * Math.pow(2, reconnectAttemptsRef.current - 1), 30000)
          
          reconnectTimeoutRef.current = setTimeout(() => {
            connect()
          }, backoffDelay)
        }
      }

      wsRef.current = ws
    } catch (err) {
      console.error('Failed to create WebSocket connection:', err)
      setError('Failed to create WebSocket connection')
    }
  }, [url, token, onMessage, onError, onOpen, onClose, reconnectInterval, maxReconnectAttempts])

  const disconnect = useCallback(() => {
    stopHeartbeat()
    
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current)
      reconnectTimeoutRef.current = null
    }
    
    if (wsRef.current) {
      wsRef.current.close(1000, 'Manual disconnect')
      wsRef.current = null
    }
    
    setIsConnected(false)
    setConnectionQuality(prev => ({ ...prev, isStable: false }))
  }, [stopHeartbeat])

  const sendMessage = useCallback((message: { text: string; type: string }) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(message))
      return true
    } else {
      console.warn('WebSocket is not connected, queuing message')
      setQueuedMessages(prev => [...prev, message])
      return false
    }
  }, [])

  const clearQueuedMessages = useCallback(() => {
    setQueuedMessages([])
  }, [])

  useEffect(() => {
    if (url && token) {
      connect()
    }

    return () => {
      disconnect()
    }
  }, [url, token, connect, disconnect])

  return {
    isConnected,
    error,
    connectionQuality,
    queuedMessages,
    sendMessage,
    connect,
    disconnect,
    clearQueuedMessages,
  }
}
