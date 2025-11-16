"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/shared/navbar"
import { Sidebar } from "@/components/shared/sidebar"
import { useStore } from "@/lib/store"
import { cn } from "@/lib/utils"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const { sidebarOpen, user } = useStore()

  useEffect(() => {
    if (!user) {
      router.push("/login")
    }
  }, [user, router])

  // Show loading state while checking auth
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="flex">
        <Sidebar />
        <main
          className={cn("flex-1 transition-all duration-300 pt-4", sidebarOpen ? "ml-0 md:ml-64" : "ml-0 md:ml-16")}
        >
          {children}
        </main>
      </div>
    </div>
  )
}
