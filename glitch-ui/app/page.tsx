"use client"

import { useState, useEffect } from "react"
import ChatSidebar from "@/components/chat-sidebar"
import ChatInterface from "@/components/chat-interface"
import AuthGuard from "@/components/auth/auth-guard"
import { ChatProvider } from "@/contexts/chat-context"
import { useAuth } from "@/contexts/auth-context"

function TacticalChatApp() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showProfile, setShowProfile] = useState(false)
  const { logout } = useAuth()

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
      if (window.innerWidth >= 768) {
        setSidebarCollapsed(false)
      }
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  const handleChatSelect = (chatId: string) => {
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }

  const handleProfileClick = () => {
    setShowProfile(true)
    if (isMobile) {
      setSidebarCollapsed(true)
    }
  }

  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* Chat Sidebar */}
      <div
        className={`${sidebarCollapsed ? "hidden md:block" : "block"} ${sidebarCollapsed ? "md:w-16" : "w-full md:w-80"} fixed md:relative z-50 md:z-auto h-full transition-all duration-300`}
      >
        <ChatSidebar
          isCollapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
          onChatSelect={handleChatSelect}
          onLogout={logout}
          onProfileClick={handleProfileClick}
        />
      </div>

      {/* Mobile Overlay */}
      {!sidebarCollapsed && isMobile && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300"
          onClick={() => setSidebarCollapsed(true)}
        />
      )}

      {/* Main Chat Interface */}
      <div className={`flex-1 ${!sidebarCollapsed && isMobile ? "hidden" : "flex"} transition-all duration-300`}>
        <ChatInterface 
          onMenuClick={() => setSidebarCollapsed(false)}
          showProfile={showProfile}
          onProfileClose={() => setShowProfile(false)}
        />
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthGuard>
      <ChatProvider>
        <TacticalChatApp />
      </ChatProvider>
    </AuthGuard>
  )
}
