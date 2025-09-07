"use client"

import type React from "react"
import { createContext, useContext, useReducer, useEffect, useState, useMemo, useCallback } from "react"
import { useAuth } from "./auth-context"
import { api } from "@/lib/api"
import { useWebSocketManager } from "@/hooks/use-websocket-manager"
import { getAccessToken, getUserId } from "@/lib/cookies"

export interface Message {
  id: string
  content: string
  sent_at: string
  delivered_at?: string
  seen_at?: string
  type: string
  user_id: string
  chat?: string
  group?: string
}

export interface ChatUser {
  id: string
  name: string
  email: string
  phone_number: string | null
  date_joined: string
  is_active: boolean
}

export interface Chat {
  id: string
  name: string
  created_at: string
  updated_at: string
  users: ChatUser[]
  message_count: number
  last_message: {
    id: string
    content: string
    type: string
    sent_at: string
    sender: string
  } | null
}

export interface User {
  id: string
  name: string
  avatar?: string
  status: "online" | "offline" | "away"
}

interface ChatState {
  chats: Chat[]
  selectedChatId: string | null
  currentUser: User
  isLoading: boolean
  isLoadingMessages: boolean
  messages: { [chatId: string]: Message[] }
}

type ChatAction =
  | { type: "SET_CHATS"; payload: Chat[] }
  | { type: "SELECT_CHAT"; payload: string }
  | { type: "SET_MESSAGES"; payload: { chatId: string; messages: Message[] } }
  | { type: "ADD_MESSAGE"; payload: { chatId: string; message: Message } }
  | { type: "UPDATE_CHAT_STATUS"; payload: { chatId: string; status: "online" | "offline" | "away" } }
  | { type: "MARK_MESSAGES_READ"; payload: string }
  | { type: "UPDATE_USER_STATUS"; payload: User["status"] }
  | { type: "UPDATE_CURRENT_USER"; payload: User }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_LOADING_MESSAGES"; payload: boolean }

const initialState: ChatState = {
  chats: [],
  selectedChatId: null,
  currentUser: {
    id: "user-001",
    name: "OPERATOR-001",
    status: "online",
  },
  isLoading: false,
  isLoadingMessages: false,
  messages: {},
}

function chatReducer(state: ChatState, action: ChatAction): ChatState {
  switch (action.type) {
    case "SET_CHATS":
      return { ...state, chats: action.payload }

    case "SELECT_CHAT":
      return { ...state, selectedChatId: action.payload }

    case "SET_MESSAGES": {
      const { chatId, messages } = action.payload
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: messages,
        },
      }
    }

    case "ADD_MESSAGE": {
      const { chatId, message } = action.payload
      const currentMessages = state.messages[chatId] || []
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: [...currentMessages, message],
        },
      }
    }

    case "UPDATE_CHAT_STATUS": {
      // This would need to be implemented based on user online status
      return state
    }

    case "MARK_MESSAGES_READ": {
      const chatId = action.payload
      const currentMessages = state.messages[chatId] || []
      const updatedMessages = currentMessages.map((msg) => ({
        ...msg,
        seen_at: msg.seen_at || new Date().toISOString(),
      }))
      return {
        ...state,
        messages: {
          ...state.messages,
          [chatId]: updatedMessages,
        },
      }
    }

    case "UPDATE_USER_STATUS":
      return {
        ...state,
        currentUser: { ...state.currentUser, status: action.payload },
      }

    case "UPDATE_CURRENT_USER":
      return {
        ...state,
        currentUser: action.payload,
      }

    case "SET_LOADING":
      return { ...state, isLoading: action.payload }

    case "SET_LOADING_MESSAGES":
      return { ...state, isLoadingMessages: action.payload }

    default:
      return state
  }
}

interface ChatContextType {
  state: ChatState
  selectChat: (chatId: string) => void
  sendMessage: (chatId: string, content: string) => void
  markMessagesAsRead: (chatId: string) => void
  updateChatStatus: (chatId: string, status: "online" | "offline" | "away") => void
  updateUserStatus: (status: User["status"]) => void
  loadChats: () => Promise<void>
  loadChatMessages: (chatId: string) => Promise<void>
  isWsConnected: boolean
  wsError: string | null
  wsChatId: string | null
  connectionQuality: {
    latency: number
    lastPing: number
    isStable: boolean
  }
  queuedMessages: Array<{ text: string; type: string }>
  hasConnection: (chatId: string) => boolean
}

const ChatContext = createContext<ChatContextType | undefined>(undefined)

export function ChatProvider({ children }: { children: React.ReactNode }) {
  const { state: authState } = useAuth()
  
  // Create dynamic initial state based on authenticated user
  const dynamicInitialState = {
    ...initialState,
    currentUser: authState.user ? {
      id: authState.user.id,
      name: authState.user.name,
      status: "online" as const,
    } : initialState.currentUser
  }
  
  const [state, dispatch] = useReducer(chatReducer, dynamicInitialState)

  // Get access token and user ID for WebSocket
  const accessToken = getAccessToken() || ""
  const currentUserId = getUserId() || ""

  // Helper function to map message data to Message interface
  const mapMessageData = useCallback((messageData: any, chatId: string): Message => {
    // Extract user ID from different formats:
    // API: user is a string (user ID)
    // WebSocket: user is an object with id, or sender field
    let userId: string
    
    if (typeof messageData.user === 'string') {
      // API response format - user is just the ID
      userId = messageData.user
    } else if (messageData.user && typeof messageData.user === 'object') {
      // WebSocket response format - user is an object
      userId = messageData.user.id || messageData.sender
    } else {
      // Fallback for sender field
      userId = messageData.sender
    }
    
    return {
      id: messageData.id,
      content: messageData.content || messageData.text,
      sent_at: messageData.sent_at || messageData.timestamp,
      delivered_at: messageData.delivered_at,
      seen_at: messageData.seen_at,
      type: messageData.type || "text",
      user_id: userId,
      chat: chatId,
    }
  }, [])

  // Use the WebSocket manager for connection pooling
  const {
    activeChatId,
    connectToChat,
    disconnectFromChat,
    sendMessage: wsSendMessage,
    hasConnection,
    getConnectionStatus,
    getActiveConnectionStatus,
    getConnectionStats,
  } = useWebSocketManager({
    baseUrl: 'ws://127.0.0.1:8000',
    token: accessToken || '',
    onMessage: (chatId, data) => {
      // Check if message already exists to prevent duplicates
      const existingMessages = state.messages[chatId] || []
      const messageExists = existingMessages.some(msg => msg.id === data.id)
      
      if (messageExists) {
        console.log(`Message ${data.id} already exists, skipping duplicate`)
        return
      }
      
      // Map WebSocket message data using the same helper function
      const newMessage: Message = mapMessageData(data, chatId)
      
      dispatch({ type: "ADD_MESSAGE", payload: { chatId, message: newMessage } })
      
      // Reload chats to update last message
      loadChats()
    },
    onError: (chatId, error) => {
      console.error(`WebSocket error for chat ${chatId}:`, error)
    },
    onOpen: (chatId) => {
      console.log(`WebSocket connected to chat: ${chatId}`)
    },
    onClose: (chatId) => {
      console.log(`WebSocket disconnected from chat: ${chatId}`)
    },
    reconnectInterval: 3000,
    maxReconnectAttempts: 5,
    heartbeatInterval: 30000,
    enableHeartbeat: true,
  })

  // Get current connection status
  const connectionStatus = getActiveConnectionStatus()
  const { isConnected: isWsConnected, error: wsError, connectionQuality, queuedMessages } = connectionStatus
  
  // Also get connection status for the selected chat specifically
  const selectedChatConnectionStatus = state.selectedChatId ? getConnectionStatus(state.selectedChatId) : null


  // Load chats when user is authenticated
  useEffect(() => {
    if (authState.isAuthenticated && authState.user) {
      loadChats()
    }
  }, [authState.isAuthenticated, authState.user])

  // Update current user when auth state changes
  useEffect(() => {
    if (authState.user) {
      dispatch({
        type: "UPDATE_CURRENT_USER",
        payload: {
          id: authState.user.id,
          name: authState.user.name,
          status: "online" as const,
        }
      })
    }
  }, [authState.user])

  const loadChats = async () => {
    try {
      dispatch({ type: "SET_LOADING", payload: true })
      const response = await api.getChats()
      
      if (response.ok) {
        const chats = await response.json()
        dispatch({ type: "SET_CHATS", payload: chats })
        
        // Don't automatically select first chat - let user click to create connection
        // if (chats.length > 0 && !state.selectedChatId) {
        //   selectChat(chats[0].id)
        // }
      } else {
        console.error("Failed to load chats")
      }
    } catch (error) {
      console.error("Error loading chats:", error)
    } finally {
      dispatch({ type: "SET_LOADING", payload: false })
    }
  }

  const loadChatMessages = async (chatId: string) => {
    try {
      dispatch({ type: "SET_LOADING_MESSAGES", payload: true })
      console.log(`Loading messages from API for chat: ${chatId}`)
      const response = await api.getChatMessages(chatId)
      
      if (response.ok) {
        const apiMessages = await response.json()
        console.log(`Loaded ${apiMessages.length} messages from API for chat: ${chatId}`)
        
        // Map API messages to the same format as WebSocket messages
        const mappedMessages: Message[] = apiMessages.map((apiMsg: any) => 
          mapMessageData(apiMsg, chatId)
        )
        
        dispatch({ type: "SET_MESSAGES", payload: { chatId, messages: mappedMessages } })
      } else {
        console.error("Failed to load messages for chat:", chatId)
      }
    } catch (error) {
      console.error("Error loading messages:", error)
    } finally {
      dispatch({ type: "SET_LOADING_MESSAGES", payload: false })
    }
  }

  const selectChat = async (chatId: string) => {
    dispatch({ type: "SELECT_CHAT", payload: chatId })
    
    // First, load messages from API
    await loadChatMessages(chatId)
    
    // Then connect to WebSocket for real-time updates
    console.log(`Connecting to WebSocket for chat: ${chatId}`)
    const connection = connectToChat(chatId)
    
    // Wait a moment for connection to establish
    setTimeout(() => {
      const isConnected = hasConnection(chatId)
      console.log(`WebSocket connection status for chat ${chatId}:`, isConnected)
      
      if (!isConnected) {
        console.warn(`WebSocket connection failed for chat ${chatId}, retrying...`)
        connectToChat(chatId)
      }
    }, 500)
    
    // Debug: Log connection statistics
    const stats = getConnectionStats()
    console.log(`WebSocket Connection Stats:`, stats)
    
    // Auto-mark messages as read when selecting a chat
    markMessagesAsRead(chatId)
  }

  const sendMessage = async (chatId: string, content: string) => {
    if (!authState.user || !currentUserId) {
      console.error("User not authenticated or user ID not found in cookies")
      return
    }

    // Check if we have a connection for this chat (even if not active)
    const hasConnectionForChat = hasConnection(chatId)
    const isActiveChat = activeChatId === chatId
    
    console.log(`Sending message to chat ${chatId}:`, {
      hasConnectionForChat,
      isActiveChat,
      isWsConnected,
      activeChatId
    })

    // Send message via WebSocket if we have a connection for this chat
    if (hasConnectionForChat && wsSendMessage) {
      const success = wsSendMessage(chatId, {
        text: content,
        type: "text",
        user_id: currentUserId // Include user ID in the message
      })
      
      if (success) {
        console.log("Message sent via WebSocket, waiting for broadcast response")
        // Don't add optimistic UI - wait for WebSocket broadcast
      } else {
        console.error("Failed to send message via WebSocket")
      }
    } else {
      console.error(`WebSocket not connected to chat ${chatId}. Has connection: ${hasConnectionForChat}, Active chat: ${activeChatId}`)
      
      // Try to connect to the chat if we don't have a connection
      if (!hasConnectionForChat) {
        console.log(`Attempting to connect to chat ${chatId} before sending message`)
        connectToChat(chatId)
        
        // Wait a bit for connection to establish, then try again
        setTimeout(() => {
          if (hasConnection(chatId)) {
            const success = wsSendMessage(chatId, {
              text: content,
              type: "text",
              user_id: currentUserId
            })
            if (success) {
              console.log("Message sent via WebSocket after reconnection")
            }
          }
        }, 1000)
      }
    }
  }

  const markMessagesAsRead = async (chatId: string) => {
    try {
      // Mark messages as read locally first
      dispatch({ type: "MARK_MESSAGES_READ", payload: chatId })
      
      // Then mark them as read on the server
      const messages = state.messages[chatId] || []
      const unreadMessages = messages.filter(msg => !msg.seen_at && msg.user_id !== authState.user?.id)
      
      for (const message of unreadMessages) {
        await api.markMessageSeen(message.id)
      }
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  const updateChatStatus = (chatId: string, status: "online" | "offline" | "away") => {
    dispatch({ type: "UPDATE_CHAT_STATUS", payload: { chatId, status } })
  }

  const updateUserStatus = (status: User["status"]) => {
    dispatch({ type: "UPDATE_USER_STATUS", payload: status })
  }

  // WebSocket connection management
  useEffect(() => {
    // Clean up WebSocket connections when component unmounts
    return () => {
      // The WebSocket manager will handle cleanup automatically
    }
  }, [])

  return (
    <ChatContext.Provider
      value={{
        state,
        selectChat,
        sendMessage,
        markMessagesAsRead,
        updateChatStatus,
        updateUserStatus,
        loadChats,
        loadChatMessages,
        isWsConnected,
        wsError,
        wsChatId: activeChatId,
        connectionQuality,
        queuedMessages,
        hasConnection,
      }}
    >
      {children}
    </ChatContext.Provider>
  )
}

export function useChat() {
  const context = useContext(ChatContext)
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider")
  }
  return context
}
