"use client"

import type React from "react"
import { useAuth } from "@/contexts/auth-context"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Mail, Phone, Shield } from "lucide-react"

export default function UserInfo() {
  const { state } = useAuth()

  if (!state.user) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <Card className="bg-neutral-900/80 border-orange-500/30 backdrop-blur-sm">
      <CardHeader className="text-center space-y-4">
        <div className="flex justify-center">
          <Avatar className="w-16 h-16 border-2 border-orange-500">
            <AvatarImage src="/placeholder.svg?height=64&width=64" />
            <AvatarFallback className="bg-orange-500 text-black font-bold text-lg">
              {state.user.name.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
        </div>
        <CardTitle className="text-orange-500 font-mono text-lg">
          {state.user.name.toUpperCase()}
        </CardTitle>
        <Badge 
          variant="outline" 
          className="border-orange-500/50 text-orange-400 bg-orange-500/10"
        >
          <Shield className="w-3 h-3 mr-1" />
          OPERATOR
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="flex items-center space-x-3 text-sm">
          <Mail className="w-4 h-4 text-orange-500" />
          <span className="text-neutral-300 font-mono">{state.user.email}</span>
        </div>
        
        {state.user.phone_number && state.user.phone_number !== "None" && (
          <div className="flex items-center space-x-3 text-sm">
            <Phone className="w-4 h-4 text-orange-500" />
            <span className="text-neutral-300 font-mono">{state.user.phone_number}</span>
          </div>
        )}
        
        <div className="flex items-center space-x-3 text-sm">
          <Calendar className="w-4 h-4 text-orange-500" />
          <span className="text-neutral-300 font-mono">
            Joined {formatDate(state.user.date_joined)}
          </span>
        </div>
        
        <div className="pt-2 border-t border-neutral-700">
          <div className="flex items-center justify-between text-xs">
            <span className="text-neutral-400">Status:</span>
            <Badge 
              variant="outline" 
              className="border-green-500/50 text-green-400 bg-green-500/10"
            >
              {state.user.is_active ? "ACTIVE" : "INACTIVE"}
            </Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
