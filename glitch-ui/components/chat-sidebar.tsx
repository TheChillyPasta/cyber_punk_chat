"use client"

import type React from "react"

import { useState, useCallback, useEffect } from "react"
import { Search, MoreVertical, MessageCircle, Phone, Video, Settings, LogOut, ChevronLeft, UserPlus, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useChat } from "@/contexts/chat-context"
import { api } from "@/lib/api"

interface ChatSidebarProps {
  isCollapsed: boolean
  onToggle: () => void
  onChatSelect: (chatId: string) => void
  onLogout: () => void
  onProfileClick?: () => void
}

interface SearchedUser {
  id: string
  name: string
  email: string
  phone_number: string
  date_joined: string
  is_active: boolean
}

export default function ChatSidebar({ isCollapsed, onToggle, onChatSelect, onLogout, onProfileClick }: ChatSidebarProps) {
  const { state, selectChat, updateUserStatus, hasConnection, createChat } = useChat()
  const [searchQuery, setSearchQuery] = useState("")
  const [touchStart, setTouchStart] = useState<number | null>(null)
  const [touchEnd, setTouchEnd] = useState<number | null>(null)
  const [isUserSearchMode, setIsUserSearchMode] = useState(false)
  const [searchedUsers, setSearchedUsers] = useState<SearchedUser[]>([])
  const [isSearching, setIsSearching] = useState(false)

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null)
    setTouchStart(e.targetTouches[0].clientX)
  }

  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX)
  }

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return
    const distance = touchStart - touchEnd
    const isLeftSwipe = distance > 50

    if (isLeftSwipe && !isCollapsed) {
      onToggle()
    }
  }

  const handleChatSelect = async (chatId: string) => {
    await selectChat(chatId)
    onChatSelect(chatId)
  }

  const searchUsers = useCallback(async (phoneNumber: string) => {
    if (!phoneNumber.trim()) {
      setSearchedUsers([])
      return
    }

    setIsSearching(true)
    try {
      const response = await api.filterUser(phoneNumber)
      if (response.ok) {
        const users = await response.json()
        setSearchedUsers(users)
      } else {
        console.error("Failed to search users")
        setSearchedUsers([])
      }
    } catch (error) {
      console.error("Error searching users:", error)
      setSearchedUsers([])
    } finally {
      setIsSearching(false)
    }
  }, [])

  const handleUserSelect = async (user: SearchedUser) => {
    try {
      // Create a chat with the selected user
      const chatName = user.name
      const newChat = await createChat(chatName, [user.id])
      
      if (newChat) {
        // Switch back to chat mode
        setIsUserSearchMode(false)
        setSearchQuery("")
        setSearchedUsers([])
        onChatSelect(newChat.id)
      }
    } catch (error) {
      console.error("Error creating chat with user:", error)
    }
  }

  const toggleSearchMode = () => {
    setIsUserSearchMode(!isUserSearchMode)
    setSearchQuery("")
    setSearchedUsers([])
  }

  // Debounced search effect
  useEffect(() => {
    if (!isUserSearchMode) return

    const timeoutId = setTimeout(() => {
      if (searchQuery.trim()) {
        searchUsers(searchQuery.trim())
      } else {
        setSearchedUsers([])
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [searchQuery, isUserSearchMode, searchUsers])

  const filteredChats = state.chats.filter(
    (chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (chat.last_message?.content.toLowerCase().includes(searchQuery.toLowerCase()) ?? false),
  )

  return (
    <div
      className={`${isCollapsed ? "w-0 md:w-16" : "w-full md:w-80"} bg-neutral-900 border-r border-neutral-700 transition-all duration-300 flex flex-col h-full`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* User Profile Header */}
      <div className="p-4 border-b border-neutral-700">
        <div className="flex items-center justify-between">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <button 
                onClick={onProfileClick}
                className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-neutral-900 rounded-full"
              >
                <Avatar className="w-10 h-10 border-2 border-orange-500 hover:border-orange-400 transition-colors">
                  <AvatarImage src="/placeholder.svg?height=40&width=40" />
                  <AvatarFallback className="bg-orange-500 text-black font-bold">OPS</AvatarFallback>
                </Avatar>
              </button>
              <div>
                <h2 className="text-orange-500 font-bold text-sm tracking-wider">{state.currentUser.name}</h2>
                <p className="text-neutral-400 text-xs">TACTICAL COMMAND</p>
              </div>
            </div>
          )}

          <div className="flex items-center gap-1">
            {!isCollapsed && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-neutral-400 hover:text-orange-500 h-8 w-8 md:h-10 md:w-10"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="bg-neutral-800 border-neutral-700">
                  <DropdownMenuItem
                    className="text-neutral-300 hover:text-orange-500"
                    onClick={() => updateUserStatus("online")}
                  >
                    <div className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                    Online
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-neutral-300 hover:text-orange-500"
                    onClick={() => updateUserStatus("away")}
                  >
                    <div className="w-2 h-2 bg-yellow-500 rounded-full mr-2" />
                    Away
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-neutral-300 hover:text-orange-500"
                    onClick={() => updateUserStatus("offline")}
                  >
                    <div className="w-2 h-2 bg-neutral-600 rounded-full mr-2" />
                    Offline
                  </DropdownMenuItem>
                  <DropdownMenuSeparator className="bg-neutral-700" />
                  <DropdownMenuItem 
                    className="text-neutral-300 hover:text-orange-500"
                    onClick={onProfileClick}
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="text-neutral-300 hover:text-orange-500"
                    onClick={onLogout}
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

            <Button
              variant="ghost"
              size="icon"
              onClick={onToggle}
              className="text-neutral-400 hover:text-orange-500 md:hidden h-8 w-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {!isCollapsed && (
        <>
          {/* Search Bar */}
          <div className="p-4 border-b border-neutral-700">
            <div className="flex items-center gap-2 mb-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleSearchMode}
                className={`text-xs px-2 py-1 h-6 ${
                  isUserSearchMode 
                    ? "bg-orange-500 text-black hover:bg-orange-600" 
                    : "text-neutral-400 hover:text-orange-500"
                }`}
              >
                <UserPlus className="w-3 h-3 mr-1" />
                {isUserSearchMode ? "User Search" : "Find Users"}
              </Button>
              {isUserSearchMode && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={toggleSearchMode}
                  className="text-xs px-2 py-1 h-6 text-neutral-400 hover:text-orange-500"
                >
                  <X className="w-3 h-3" />
                </Button>
              )}
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500 w-4 h-4" />
              <Input
                placeholder={isUserSearchMode ? "Search by phone number..." : "Search conversations..."}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-neutral-800 border-neutral-600 text-neutral-300 placeholder-neutral-500 focus:border-orange-500 h-9 md:h-10 text-sm"
              />
              {isSearching && (
                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                </div>
              )}
            </div>
          </div>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto overscroll-contain">
            {isUserSearchMode ? (
              /* User Search Results */
              <div>
                {searchedUsers.length > 0 ? (
                  searchedUsers.map((user) => (
                    <div
                      key={user.id}
                      onClick={() => handleUserSelect(user)}
                      className="p-4 border-b border-neutral-800 cursor-pointer transition-colors active:bg-neutral-700 hover:bg-neutral-800"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage
                            src={`/ceholder-svg-key-3zbmr-height-48-width-48-text-.jpg?key=3zbmr&height=48&width=48&text=${user.name.charAt(0)}`}
                          />
                          <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-1">
                            <h3 className="text-neutral-200 font-medium text-sm truncate">{user.name}</h3>
                            <div className="flex items-center gap-1">
                              <div className={`w-2 h-2 rounded-full ${user.is_active ? "bg-green-500" : "bg-gray-500"}`} />
                              <span className="text-xs text-neutral-500">
                                {user.is_active ? "Active" : "Inactive"}
                              </span>
                            </div>
                          </div>
                          <div className="flex items-center justify-between">
                            <p className="text-neutral-400 text-xs truncate">{user.email}</p>
                            <p className="text-neutral-500 text-xs">{user.phone_number}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : searchQuery.trim() ? (
                  <div className="p-4 text-center">
                    <p className="text-neutral-400 text-sm">
                      {isSearching ? "Searching..." : "No users found"}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 text-center">
                    <p className="text-neutral-400 text-sm">Enter a phone number to search for users</p>
                  </div>
                )}
              </div>
            ) : (
              /* Chat List */
              filteredChats.map((chat) => (
                <div
                  key={chat.id}
                  onClick={() => handleChatSelect(chat.id)}
                  className={`p-4 border-b border-neutral-800 cursor-pointer transition-colors active:bg-neutral-700 hover:bg-neutral-800 ${
                    state.selectedChatId === chat.id ? "bg-neutral-800 border-l-4 border-l-orange-500" : ""
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar className="w-12 h-12">
                        <AvatarImage
                          src={`/ceholder-svg-key-3zbmr-height-48-width-48-text-.jpg?key=3zbmr&height=48&width=48&text=${chat.name.charAt(0)}`}
                        />
                        <AvatarFallback className="bg-neutral-700 text-neutral-300 text-xs">
                          {chat.name
                            .split(" ")
                            .map((n) => n[0])
                            .join("")
                            .slice(0, 2)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-neutral-900 bg-green-500" />
                      {/* WebSocket Connection Status */}
                      <div className="absolute -top-1 -right-1 w-3 h-3 rounded-full border border-neutral-900">
                        <div
                          className={`w-full h-full rounded-full ${
                            hasConnection(chat.id) ? "bg-green-500" : "bg-gray-500"
                          }`}
                          title={hasConnection(chat.id) ? "Real-time connected" : "Not connected"}
                        />
                      </div>
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h3 className="text-neutral-200 font-medium text-sm truncate">{chat.name}</h3>
                        <span className="text-neutral-500 text-xs">
                          {chat.last_message ? new Date(chat.last_message.sent_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          }) : new Date(chat.updated_at).toLocaleTimeString('en-US', {
                            hour: '2-digit',
                            minute: '2-digit',
                            hour12: false
                          })}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <p className="text-neutral-400 text-xs truncate">
                          {chat.last_message?.content || "No messages yet"}
                        </p>
                        {chat.message_count > 0 && (
                          <span className="bg-orange-500 text-black text-xs font-bold px-2 py-1 rounded-full min-w-[18px] md:min-w-[20px] text-center">
                            {chat.message_count}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Status Bar */}
          <div className="p-4 border-t border-neutral-700">
            <div className="flex items-center gap-2 text-xs text-neutral-500">
              <div
                className={`w-2 h-2 rounded-full animate-pulse ${
                  state.currentUser.status === "online"
                    ? "bg-green-500"
                    : state.currentUser.status === "away"
                      ? "bg-yellow-500"
                      : "bg-neutral-600"
                }`}
              />
              <span>SECURE CONNECTION</span>
              <div className="ml-auto">
                <span>ENCRYPTED</span>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Collapsed State Icons */}
      {isCollapsed && (
        <div className="hidden md:flex flex-col items-center py-4 gap-4">
          <Avatar className="w-8 h-8 border border-orange-500">
            <AvatarImage src="/placeholder.svg?height=32&width=32" />
            <AvatarFallback className="bg-orange-500 text-black text-xs font-bold">OP</AvatarFallback>
          </Avatar>
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
            <MessageCircle className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
            <Phone className="w-5 h-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-neutral-400 hover:text-orange-500">
            <Video className="w-5 h-5" />
          </Button>
        </div>
      )}
    </div>
  )
}
