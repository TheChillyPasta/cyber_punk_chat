"use client"

import type React from "react"
import { useState } from "react"
import LoginForm from "./login-form"
import SignupForm from "./signup-form"

export default function AuthContainer() {
  const [isLogin, setIsLogin] = useState(true)

  return (
    <div className="relative">
      {isLogin ? (
        <LoginForm onSwitchToSignup={() => setIsLogin(false)} />
      ) : (
        <SignupForm onSwitchToLogin={() => setIsLogin(true)} />
      )}
    </div>
  )
}
