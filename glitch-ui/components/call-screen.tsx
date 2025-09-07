"use client"

import { useState, useEffect } from "react"
import { PhoneOff, Mic, MicOff, Video, VideoOff, Users, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface CallScreenProps {
  callType: "voice" | "video" | "group-voice" | "group-video"
  contact: {
    id: string
    name: string
    status: string
  }
  participants?: Array<{ id: string; name: string }>
  onEndCall: () => void
}

export default function CallScreen({ callType, contact, participants = [], onEndCall }: CallScreenProps) {
  const [duration, setDuration] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [isSpeakerOn, setIsSpeakerOn] = useState(false)
  const [callStatus, setCallStatus] = useState<"connecting" | "connected" | "ringing">("connecting")

  useEffect(() => {
    // Simulate call connection
    const connectTimer = setTimeout(() => {
      setCallStatus("connected")
    }, 2000)

    return () => clearTimeout(connectTimer)
  }, [])

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (callStatus === "connected") {
      interval = setInterval(() => {
        setDuration((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [callStatus])

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const isVideo = callType === "video" || callType === "group-video"
  const isGroup = callType === "group-voice" || callType === "group-video"

  return (
    <div className="fixed inset-0 bg-neutral-950 z-50 flex flex-col">
      {/* Call Header */}
      <div className="p-4 md:p-6 text-center">
        <h2 className="text-orange-500 font-bold text-lg md:text-xl tracking-wider mb-2">
          {isGroup ? "GROUP CALL" : "SECURE CALL"}
        </h2>
        <p className="text-neutral-400 text-sm">
          {callStatus === "connecting" && "ESTABLISHING SECURE CONNECTION..."}
          {callStatus === "connected" && `ENCRYPTED • ${formatDuration(duration)}`}
          {callStatus === "ringing" && "RINGING..."}
        </p>
      </div>

      {/* Video/Avatar Area */}
      <div className="flex-1 flex items-center justify-center p-4">
        {isVideo && callStatus === "connected" ? (
          <div className="relative w-full max-w-4xl aspect-video bg-neutral-900 rounded-lg overflow-hidden">
            {/* Main video area */}
            <div className="w-full h-full bg-gradient-to-br from-neutral-800 to-neutral-900 flex items-center justify-center">
              <div className="text-center">
                <Video className="w-16 h-16 text-orange-500 mx-auto mb-4" />
                <p className="text-neutral-400">Video feed would appear here</p>
              </div>
            </div>

            {/* Self video (small overlay) */}
            <div className="absolute top-4 right-4 w-24 h-32 md:w-32 md:h-40 bg-neutral-800 rounded-lg border border-neutral-700 flex items-center justify-center">
              <div className="text-center">
                <div className="w-8 h-8 bg-orange-500 rounded-full mx-auto mb-1" />
                <p className="text-xs text-neutral-400">You</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center">
            {isGroup ? (
              <div className="grid grid-cols-2 gap-4 mb-6">
                {[contact, ...participants.slice(0, 3)].map((participant, index) => (
                  <div key={participant.id} className="text-center">
                    <Avatar className="w-16 h-16 md:w-20 md:h-20 mx-auto mb-2">
                      <AvatarImage
                        src={`/abstract-geometric-shapes.png?height=80&width=80&query=${participant.name.toLowerCase()}`}
                      />
                      <AvatarFallback className="bg-neutral-700 text-neutral-300 text-lg">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .slice(0, 2)}
                      </AvatarFallback>
                    </Avatar>
                    <p className="text-orange-500 font-bold text-sm tracking-wider">{participant.name}</p>
                  </div>
                ))}
              </div>
            ) : (
              <>
                <Avatar className="w-32 h-32 md:w-40 md:h-40 mx-auto mb-6">
                  <AvatarImage
                    src={`/abstract-geometric-shapes.png?height=160&width=160&query=${contact.name.toLowerCase()}`}
                  />
                  <AvatarFallback className="bg-neutral-700 text-neutral-300 text-4xl">
                    {contact.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")
                      .slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <h3 className="text-orange-500 font-bold text-xl md:text-2xl tracking-wider mb-2">{contact.name}</h3>
              </>
            )}

            <div className="flex items-center justify-center gap-2 text-neutral-400">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span className="text-sm">SECURE CONNECTION</span>
            </div>
          </div>
        )}
      </div>

      {/* Call Controls */}
      <div className="p-6 md:p-8">
        <div className="flex items-center justify-center gap-4 md:gap-6">
          {/* Mute */}
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setIsMuted(!isMuted)}
            className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 ${
              isMuted
                ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                : "border-neutral-600 text-neutral-400 hover:text-orange-500 hover:border-orange-500"
            }`}
          >
            {isMuted ? <MicOff className="w-5 h-5 md:w-6 md:h-6" /> : <Mic className="w-5 h-5 md:w-6 md:h-6" />}
          </Button>

          {/* Speaker (voice calls only) */}
          {!isVideo && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSpeakerOn(!isSpeakerOn)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 ${
                isSpeakerOn
                  ? "bg-orange-500 border-orange-500 text-black hover:bg-orange-600"
                  : "border-neutral-600 text-neutral-400 hover:text-orange-500 hover:border-orange-500"
              }`}
            >
              {isSpeakerOn ? (
                <Volume2 className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <VolumeX className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </Button>
          )}

          {/* Video toggle (video calls only) */}
          {isVideo && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsVideoOff(!isVideoOff)}
              className={`w-12 h-12 md:w-14 md:h-14 rounded-full border-2 ${
                isVideoOff
                  ? "bg-red-500 border-red-500 text-white hover:bg-red-600"
                  : "border-neutral-600 text-neutral-400 hover:text-orange-500 hover:border-orange-500"
              }`}
            >
              {isVideoOff ? (
                <VideoOff className="w-5 h-5 md:w-6 md:h-6" />
              ) : (
                <Video className="w-5 h-5 md:w-6 md:h-6" />
              )}
            </Button>
          )}

          {/* End Call */}
          <Button
            variant="ghost"
            size="icon"
            onClick={onEndCall}
            className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-red-500 border-2 border-red-500 text-white hover:bg-red-600"
          >
            <PhoneOff className="w-5 h-5 md:w-6 md:h-6" />
          </Button>

          {/* Group participants indicator */}
          {isGroup && (
            <Button
              variant="ghost"
              size="icon"
              className="w-12 h-12 md:w-14 md:h-14 rounded-full border-2 border-neutral-600 text-neutral-400 hover:text-orange-500 hover:border-orange-500"
            >
              <Users className="w-5 h-5 md:w-6 md:h-6" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
