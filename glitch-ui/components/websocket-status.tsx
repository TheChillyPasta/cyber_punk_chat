"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Wifi, WifiOff } from "lucide-react"

interface WebSocketStatusProps {
  isConnected: boolean
  error: string | null
  connectionQuality?: {
    latency: number
    lastPing: number
    isStable: boolean
  }
  queuedMessages?: Array<{ text: string; type: string }>
}

export default function WebSocketStatus({ 
  isConnected, 
  error, 
  connectionQuality,
  queuedMessages = []
}: WebSocketStatusProps) {
  const [showError, setShowError] = useState(false)

  useEffect(() => {
    if (error) {
      setShowError(true)
      const timer = setTimeout(() => setShowError(false), 5000)
      return () => clearTimeout(timer)
    }
  }, [error])

  if (!showError && isConnected && connectionQuality?.isStable) return null

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {error && showError && (
        <Alert className="border-red-500/50 bg-red-500/10 mb-2">
          <AlertCircle className="h-4 w-4 text-red-400" />
          <AlertDescription className="text-red-400 font-mono text-sm">
            Connection Error: {error}
          </AlertDescription>
        </Alert>
      )}
      
      {!isConnected && (
        <Alert className="border-yellow-500/50 bg-yellow-500/10">
          <WifiOff className="h-4 w-4 text-yellow-400" />
          <AlertDescription className="text-yellow-400 font-mono text-sm">
            Real-time connection lost. Messages will be sent via API.
            {queuedMessages.length > 0 && ` (${queuedMessages.length} queued)`}
          </AlertDescription>
        </Alert>
      )}
      
      {isConnected && !connectionQuality?.isStable && (
        <Alert className="border-orange-500/50 bg-orange-500/10">
          <Wifi className="h-4 w-4 text-orange-400" />
          <AlertDescription className="text-orange-400 font-mono text-sm">
            Unstable connection ({connectionQuality?.latency}ms latency)
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}
