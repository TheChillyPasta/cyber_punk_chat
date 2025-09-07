"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Eye, EyeOff, Shield, Zap, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useAuth } from "@/contexts/auth-context"
import { createGlitchAnimation, addGlitchHover } from "@/lib/glitch-effects"

interface LoginFormProps {
  onSwitchToSignup: () => void
}

export default function LoginForm({ onSwitchToSignup }: LoginFormProps) {
  const { state, login, clearError } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [glitchEffect, setGlitchEffect] = useState(false)

  useEffect(() => {
    if (state.error) {
      setGlitchEffect(true)
      const timer = setTimeout(() => setGlitchEffect(false), 1000)
      return () => clearTimeout(timer)
    }
  }, [state.error])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    clearError()
    await login(email, password)
  }

  const triggerGlitch = () => {
    setGlitchEffect(true)
    setTimeout(() => setGlitchEffect(false), 500)
  }

  const handleGlitchClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    const button = e.currentTarget
    createGlitchAnimation(button, 300)
    triggerGlitch()
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/3 rounded-full blur-2xl animate-pulse delay-500" />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(249,115,22,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(249,115,22,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />

      <Card className={`w-full max-w-md bg-neutral-900/80 border-orange-500/30 backdrop-blur-sm relative z-10 ${glitchEffect ? 'animate-pulse' : ''}`}>
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="relative">
              <Shield className="h-12 w-12 text-orange-500" />
              <Zap className="h-6 w-6 text-yellow-400 absolute -top-1 -right-1 animate-pulse" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-white tracking-wider">
            <span className="text-orange-500">GLITCH</span> ACCESS
          </CardTitle>
          <CardDescription className="text-neutral-400 font-mono text-sm">
            OPERATOR AUTHENTICATION REQUIRED
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-6">
          {state.error && (
            <Alert className="border-red-500/50 bg-red-500/10">
              <AlertCircle className="h-4 w-4 text-red-400" />
              <AlertDescription className="text-red-400 font-mono text-sm">
                {state.error}
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-orange-500 font-mono text-sm">
                OPERATOR_ID
              </Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="operator@glitch.com"
                className="bg-neutral-800/50 border-orange-500/30 text-white placeholder:text-neutral-500 focus:border-orange-500 focus:ring-orange-500/20 font-mono"
                required
                onFocus={triggerGlitch}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-orange-500 font-mono text-sm">
                ACCESS_CODE
              </Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="bg-neutral-800/50 border-orange-500/30 text-white placeholder:text-neutral-500 focus:border-orange-500 focus:ring-orange-500/20 font-mono pr-10"
                  required
                  onFocus={triggerGlitch}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4 text-neutral-400" />
                  ) : (
                    <Eye className="h-4 w-4 text-neutral-400" />
                  )}
                </Button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={state.isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-bold py-3 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGlitchClick}
            >
              {state.isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                  <span className="font-mono">AUTHENTICATING...</span>
                </div>
              ) : (
                <span className="font-mono">INITIATE ACCESS</span>
              )}
            </Button>
          </form>

          <div className="text-center">
            <Button
              variant="link"
              onClick={onSwitchToSignup}
              className="text-orange-500 hover:text-orange-400 font-mono text-sm p-0 h-auto"
            >
              CREATE NEW OPERATOR ACCOUNT
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Floating particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-orange-400/30 rounded-full animate-pulse"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${2 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  )
}
