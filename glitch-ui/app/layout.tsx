import type React from "react"
import type { Metadata } from "next"
import { JetBrains_Mono as JetBrainsMono } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/contexts/auth-context"

const jetBrainsMono = JetBrainsMono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Glitch Operations Dashboard",
  description: "Tactical command and control system",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={`${jetBrainsMono.className} bg-black text-white antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  )
}
