"use client"

import { useState } from "react"
import { ArrowLeft, Camera, Edit3, Save, X, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/contexts/auth-context"

interface ProfileSettingsProps {
  onBack: () => void
}

export default function ProfileSettings({ onBack }: ProfileSettingsProps) {
  const { state: authState, logout } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  
  // Use authenticated user data or fallback to default
  const [profile, setProfile] = useState({
    name: authState.user?.name || "Agent Phoenix",
    about: "Tactical operations specialist. Secure communications only.",
    phone: authState.user?.phone_number || "+1 (555) 0123",
    avatar: "/agent-phoenix.jpg",
    email: authState.user?.email || "",
  })

  const [editedProfile, setEditedProfile] = useState(profile)

  const handleSave = () => {
    setProfile(editedProfile)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedProfile(profile)
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
  }

  return (
    <div className="fixed inset-0 bg-neutral-950 z-50 flex flex-col">
      {/* Header */}
      <div className="h-14 md:h-16 bg-neutral-900 border-b border-neutral-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={onBack}
            className="text-neutral-400 hover:text-orange-500 h-8 w-8"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <h1 className="text-orange-500 font-bold text-lg tracking-wider">PROFILE</h1>
        </div>

        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleCancel}
                className="text-neutral-400 hover:text-red-500 h-8 w-8"
              >
                <X className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleSave}
                className="text-neutral-400 hover:text-green-500 h-8 w-8"
              >
                <Save className="w-4 h-4" />
              </Button>
            </>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditing(true)}
              className="text-neutral-400 hover:text-orange-500 h-8 w-8"
            >
              <Edit3 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Profile Content */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6">
        <div className="max-w-md mx-auto space-y-6">
          {/* Profile Picture */}
          <div className="text-center">
            <div className="relative inline-block">
              <Avatar className="w-24 h-24 md:w-32 md:h-32">
                <AvatarImage src={profile.avatar || "/placeholder.svg?height=128&width=128&text=AP"} />
                <AvatarFallback className="bg-neutral-700 text-neutral-300 text-2xl">
                  {profile.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>

              {isEditing && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-orange-500 text-black hover:bg-orange-600"
                >
                  <Camera className="w-4 h-4" />
                </Button>
              )}
            </div>
          </div>

          {/* Profile Fields */}
          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <Label className="text-orange-500 font-bold text-sm tracking-wider">NAME</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.name}
                  onChange={(e) => setEditedProfile({ ...editedProfile, name: e.target.value })}
                  className="bg-neutral-800 border-neutral-600 text-neutral-200 focus:border-orange-500"
                />
              ) : (
                <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-md">
                  <p className="text-neutral-200">{profile.name}</p>
                </div>
              )}
            </div>

            {/* About */}
            <div className="space-y-2">
              <Label className="text-orange-500 font-bold text-sm tracking-wider">ABOUT</Label>
              {isEditing ? (
                <Textarea
                  value={editedProfile.about}
                  onChange={(e) => setEditedProfile({ ...editedProfile, about: e.target.value })}
                  className="bg-neutral-800 border-neutral-600 text-neutral-200 focus:border-orange-500 min-h-[80px]"
                  placeholder="Tell others about yourself..."
                />
              ) : (
                <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-md">
                  <p className="text-neutral-200">{profile.about}</p>
                </div>
              )}
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label className="text-orange-500 font-bold text-sm tracking-wider">EMAIL</Label>
              <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-md">
                <p className="text-neutral-200">{profile.email}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label className="text-orange-500 font-bold text-sm tracking-wider">PHONE</Label>
              {isEditing ? (
                <Input
                  value={editedProfile.phone}
                  onChange={(e) => setEditedProfile({ ...editedProfile, phone: e.target.value })}
                  className="bg-neutral-800 border-neutral-600 text-neutral-200 focus:border-orange-500"
                  type="tel"
                />
              ) : (
                <div className="p-3 bg-neutral-900 border border-neutral-700 rounded-md">
                  <p className="text-neutral-200">{profile.phone}</p>
                </div>
              )}
            </div>
          </div>

          {/* Security Info */}
          <div className="mt-8 p-4 bg-neutral-900 border border-neutral-700 rounded-lg">
            <h3 className="text-orange-500 font-bold text-sm tracking-wider mb-2">SECURITY</h3>
            <div className="space-y-2 text-xs text-neutral-400">
              <p>• End-to-end encryption enabled</p>
              <p>• Two-factor authentication active</p>
              <p>• Last seen: Hidden</p>
              <p>• Profile photo: Contacts only</p>
            </div>
          </div>

          {/* Logout Button */}
          <div className="mt-8">
            <Button
              onClick={handleLogout}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white font-bold py-3 transition-all duration-300 transform hover:scale-105"
            >
              <LogOut className="w-4 h-4 mr-2" />
              <span className="font-mono">TERMINATE SESSION</span>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
