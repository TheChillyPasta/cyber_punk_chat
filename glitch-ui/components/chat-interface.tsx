"use client"

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { Send, Paperclip, Phone, Video, MoreVertical, Shield, Menu } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useChat } from "@/contexts/chat-context"
import CallScreen from "./call-screen"
import ProfileSettings from "./profile-settings"
import WebSocketStatus from "./websocket-status"
import type { Message } from "@/contexts/chat-context"

interface ChatInterfaceProps {
  onMenuClick: () => void
  showProfile?: boolean
  onProfileClose?: () => void
}

interface MessageItemProps {
  message: Message
  isCurrentUser: boolean
  userDetails: { id: string; name: string; email: string }
}

// Memoized message component to prevent unnecessary re-renders
const MessageItem = React.memo(({ message, isCurrentUser, userDetails }: MessageItemProps) => {
  return (
    <div className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[85%] md:max-w-xs lg:max-w-md px-3 md:px-4 py-2 rounded-lg ${
          isCurrentUser
            ? "bg-orange-500 text-black"
            : "bg-neutral-800 text-neutral-200 border border-neutral-700"
        }`}
      >
        <p className="text-sm leading-relaxed">{message.content}</p>
        <div
          className={`flex items-center justify-end gap-1 mt-1 ${
            isCurrentUser ? "text-black/70" : "text-neutral-500"
          }`}
        >
          <span className="text-xs">
            {new Date(message.sent_at).toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            })}
          </span>
          {isCurrentUser && (
            <div className="flex">
              <div
                className={`w-1 h-1 rounded-full ${
                  message.delivered_at ? "bg-black/70" : "bg-black/50"
                }`}
              />
              <div
                className={`w-1 h-1 rounded-full ml-0.5 ${
                  message.seen_at ? "bg-black/70" : "bg-transparent"
                }`}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
})

export default function ChatInterface({ onMenuClick, showProfile = false, onProfileClose }: ChatInterfaceProps) {
  const { state, sendMessage, markMessagesAsRead, isWsConnected, wsError, wsChatId, connectionQuality, queuedMessages } = useChat()
  
  // Memoized helper function to resolve user details from chats API
  const getUserDetails = useCallback((userId: string, chatId: string) => {
    const chat = state.chats.find(chat => chat.id === chatId)
    const user = chat?.users.find(user => user.id === userId)
    return user || { id: userId, name: 'Unknown User', email: '' }
  }, [state.chats])
  const [message, setMessage] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const [activeCall, setActiveCall] = useState<{
    type: "voice" | "video" | "group-voice" | "group-video"
    contact: { id: string; name: string; status: string }
    participants?: Array<{ id: string; name: string }>
  } | null>(null)
  // Profile state is now managed by parent component

  // Memoized computed values to prevent unnecessary re-renders
  const selectedChat = useMemo(() => 
    state.chats.find((chat) => chat.id === state.selectedChatId), 
    [state.chats, state.selectedChatId]
  )
  
  const selectedChatMessages = useMemo(() => 
    state.selectedChatId ? state.messages[state.selectedChatId] || [] : [], 
    [state.selectedChatId, state.messages]
  )

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  // Removed debug useEffect that was causing unnecessary re-renders

  useEffect(() => {
    scrollToBottom()
  }, [selectedChatMessages])

  useEffect(() => {
    if (state.selectedChatId) {
      markMessagesAsRead(state.selectedChatId)
    }
  }, [state.selectedChatId]) // Removed markMessagesAsRead from deps to prevent re-renders

  useEffect(() => {
    const handleResize = () => {
      if (window.visualViewport) {
        const heightDiff = window.innerHeight - window.visualViewport.height
        setIsKeyboardOpen(heightDiff > 150)
      }
    }

    if (window.visualViewport) {
      window.visualViewport.addEventListener("resize", handleResize)
      return () => window.visualViewport?.removeEventListener("resize", handleResize)
    }
  }, [])

  useEffect(() => {
    if (isKeyboardOpen) {
      setTimeout(() => scrollToBottom(), 100)
    }
  }, [isKeyboardOpen])

  const handleSendMessage = useCallback(() => {
    if (message.trim() && state.selectedChatId) {
      sendMessage(state.selectedChatId, message)
      setMessage("")
      if (inputRef.current && window.innerWidth < 768) {
        setTimeout(() => inputRef.current?.focus(), 100)
      }
    }
  }, [message, state.selectedChatId, sendMessage])

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }, [handleSendMessage])

  const handleVoiceCall = useCallback(() => {
    if (selectedChat) {
      setActiveCall({
        type: "voice", // Default to voice call for now
        contact: { id: selectedChat.id, name: selectedChat.name, status: "online" },
        participants: undefined,
      })
    }
  }, [selectedChat])

  const handleVideoCall = useCallback(() => {
    if (selectedChat) {
      setActiveCall({
        type: "video", // Default to video call for now
        contact: { id: selectedChat.id, name: selectedChat.name, status: "online" },
        participants: undefined,
      })
    }
  }, [selectedChat])

  const handleEndCall = useCallback(() => {
    setActiveCall(null)
  }, [])

  const handleViewProfile = useCallback(() => {
    // Profile is now managed by parent component
    // This function can be removed or used to trigger parent's profile handler
  }, [])

  if (activeCall) {
    return (
      <CallScreen
        callType={activeCall.type}
        contact={activeCall.contact}
        participants={activeCall.participants}
        onEndCall={handleEndCall}
      />
    )
  }

  if (showProfile) {
    return <ProfileSettings onBack={() => onProfileClose?.()} />
  }

  if (!selectedChat) {
    return (
      <div className="flex-1 bg-neutral-950 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="text-orange-500 text-4xl md:text-6xl mb-4">⚡</div>
          <h2 className="text-orange-500 font-bold text-lg md:text-xl tracking-wider mb-2">TACTICAL CHAT</h2>
          <p className="text-neutral-400 text-sm">Select a conversation to start secure communication</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 flex flex-col bg-neutral-950">
      <WebSocketStatus 
        isConnected={isWsConnected} 
        error={wsError} 
        connectionQuality={connectionQuality}
        queuedMessages={queuedMessages}
      />
      {/* Chat Header */}
      <div className="h-14 md:h-16 bg-neutral-900 border-b border-neutral-700 flex items-center justify-between px-3 md:px-4">
        <div className="flex items-center gap-2 md:gap-3 min-w-0 flex-1">
          <Button
            variant="ghost"
            size="icon"
            onClick={onMenuClick}
            className="text-neutral-400 hover:text-orange-500 md:hidden h-8 w-8 flex-shrink-0"
          >
            <Menu className="w-5 h-5" />
          </Button>

          <Avatar className="w-8 h-8 md:w-10 md:h-10 flex-shrink-0">
            <AvatarImage
              src={`/ceholder-svg-key-rlbr0-height-40-width-40-text-.jpg?key=rlbr0&height=40&width=40&text=${selectedChat.name.charAt(0)}`}
            />
            <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
              {selectedChat.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>

          <div className="min-w-0 flex-1">
            <h3 className="text-orange-500 font-bold text-xs md:text-sm tracking-wider truncate">
              {selectedChat.name}
            </h3>
            <div className="flex items-center gap-1 md:gap-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 rounded-full bg-green-500" />
              <p className="text-neutral-400 text-xs truncate">
                ONLINE
              </p>
              <Shield className="w-2.5 h-2.5 md:w-3 md:h-3 text-green-500 ml-1 flex-shrink-0" />
              {/* WebSocket Connection Status */}
              <div className="flex items-center gap-1 ml-2">
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isWsConnected && wsChatId === selectedChat.id 
                      ? (connectionQuality.isStable ? "bg-green-500" : "bg-yellow-500")
                      : "bg-red-500"
                  }`}
                  title={
                    isWsConnected && wsChatId === selectedChat.id 
                      ? `Real-time connected (${connectionQuality.latency}ms latency)` 
                      : "Real-time disconnected"
                  }
                />
                <span className="text-xs text-neutral-500">
                  {isWsConnected && wsChatId === selectedChat.id 
                    ? (connectionQuality.isStable ? "RT" : "UNSTABLE")
                    : "OFF"
                  }
                </span>
                {queuedMessages.length > 0 && (
                  <span className="text-xs text-orange-500 ml-1" title={`${queuedMessages.length} messages queued`}>
                    ({queuedMessages.length})
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1 md:gap-2 flex-shrink-0">
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVoiceCall}
            className="text-neutral-400 hover:text-orange-500 h-8 w-8 md:h-10 md:w-10"
          >
            <Phone className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleVideoCall}
            className="text-neutral-400 hover:text-orange-500 h-8 w-8 md:h-10 md:w-10"
          >
            <Video className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="text-neutral-400 hover:text-orange-500 h-8 w-8 md:h-10 md:w-10"
              >
                <MoreVertical className="w-3.5 h-3.5 md:w-4 md:h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-neutral-800 border-neutral-700">
              <DropdownMenuItem onClick={handleViewProfile} className="text-neutral-300 hover:text-orange-500">
                View Profile
              </DropdownMenuItem>
              <DropdownMenuItem className="text-neutral-300 hover:text-orange-500">Clear History</DropdownMenuItem>
              <DropdownMenuItem className="text-neutral-300 hover:text-orange-500">Block Contact</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Messages Area */}
      <div
        className={`flex-1 overflow-y-auto overscroll-contain p-3 md:p-4 space-y-3 md:space-y-4 ${isKeyboardOpen ? "pb-2" : ""}`}
      >
        {state.isLoadingMessages ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto mb-2"></div>
              <p className="text-neutral-400 text-sm">Loading messages...</p>
            </div>
          </div>
        ) : (
          selectedChatMessages.map((msg) => {
          const isCurrentUser = msg.user_id === state.currentUser.id
          const userDetails = getUserDetails(msg.user_id, state.selectedChatId!)
          
          return (
            <MessageItem 
              key={msg.id} 
              message={msg} 
              isCurrentUser={isCurrentUser} 
              userDetails={userDetails}
            />
          )
        })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <div className={`p-3 md:p-4 border-t border-neutral-700 bg-neutral-900 ${isKeyboardOpen ? "pb-2" : ""}`}>
        <div className="flex items-center gap-2 md:gap-3">
          <Button
            variant="ghost"
            size="icon"
            className="text-neutral-400 hover:text-orange-500 h-8 w-8 md:h-10 md:w-10 flex-shrink-0"
          >
            <Paperclip className="w-4 h-4 md:w-5 md:h-5" />
          </Button>

          <div className="flex-1 relative">
            <Input
              ref={inputRef}
              placeholder="Type a secure message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              className="bg-neutral-800 border-neutral-600 text-neutral-200 placeholder-neutral-500 focus:border-orange-500 pr-12 h-9 md:h-10 text-sm"
            />
          </div>

          <Button
            onClick={handleSendMessage}
            disabled={!message.trim()}
            className="bg-orange-500 hover:bg-orange-600 text-black disabled:bg-neutral-700 disabled:text-neutral-500 h-8 w-8 md:h-10 md:w-10 flex-shrink-0"
          >
            <Send className="w-3.5 h-3.5 md:w-4 md:h-4" />
          </Button>
        </div>

        <div className="flex items-center justify-center mt-2">
          <div className="flex items-center gap-2 text-xs text-neutral-600">
            <Shield className="w-2.5 h-2.5 md:w-3 md:h-3" />
            <span className="text-xs">END-TO-END ENCRYPTED</span>
          </div>
        </div>
      </div>
    </div>
  )
}
