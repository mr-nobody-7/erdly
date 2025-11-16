"use client"

import { useEffect, useState } from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface PresenceUser {
  id: string
  name: string
  color: string
  initials: string
}

const MOCK_COLORS = [
  "bg-red-500",
  "bg-blue-500",
  "bg-green-500",
  "bg-yellow-500",
  "bg-purple-500",
  "bg-pink-500",
  "bg-indigo-500",
  "bg-orange-500",
]

const MOCK_USERS = [
  { id: "1", name: "Sarah Smith", initials: "SS" },
  { id: "2", name: "Mike Johnson", initials: "MJ" },
  { id: "3", name: "Emily Davis", initials: "ED" },
]

export function PresenceAvatars() {
  const [activeUsers, setActiveUsers] = useState<PresenceUser[]>([])

  useEffect(() => {
    // Simulate users joining/leaving randomly
    const updatePresence = () => {
      const numUsers = Math.floor(Math.random() * 3) + 1 // 1-3 users
      const selectedUsers = MOCK_USERS.slice(0, numUsers).map((user, index) => ({
        ...user,
        color: MOCK_COLORS[index % MOCK_COLORS.length],
      }))
      setActiveUsers(selectedUsers)
    }

    updatePresence()
    const interval = setInterval(updatePresence, 10000) // Update every 10 seconds

    return () => clearInterval(interval)
  }, [])

  if (activeUsers.length === 0) return null

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1">
        {activeUsers.map((user) => (
          <Tooltip key={user.id}>
            <TooltipTrigger asChild>
              <Avatar className="h-8 w-8 border-2 border-background cursor-pointer">
                <AvatarFallback className={`${user.color} text-white text-xs`}>{user.initials}</AvatarFallback>
              </Avatar>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-sm">{user.name}</p>
            </TooltipContent>
          </Tooltip>
        ))}
        <span className="text-xs text-muted-foreground ml-2">{activeUsers.length} viewing</span>
      </div>
    </TooltipProvider>
  )
}
