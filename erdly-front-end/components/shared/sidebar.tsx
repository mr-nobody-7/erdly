"use client"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { LayoutDashboard, Building2, Users, CreditCard, Settings, Plus, ChevronLeft, ChevronRight } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useStore } from "@/lib/store"

const sidebarItems = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Organizations",
    href: "/dashboard/organizations",
    icon: Building2,
  },
  {
    title: "Team",
    href: "/dashboard/team",
    icon: Users,
  },
  {
    title: "Billing",
    href: "/dashboard/billing",
    icon: CreditCard,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const { sidebarOpen, setSidebarOpen } = useStore()

  return (
    <>
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside
        className={cn(
          "fixed left-0 top-16 z-30 h-[calc(100vh-4rem)] border-r bg-background transition-all duration-300 ease-in-out",
          sidebarOpen ? "w-64 translate-x-0" : "w-0 md:w-16 -translate-x-full md:translate-x-0",
        )}
      >
        <div className="flex h-full flex-col">
          <div className="flex items-center justify-between p-4 border-b">
            {sidebarOpen && <h2 className="text-lg font-semibold">Menu</h2>}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setSidebarOpen(!sidebarOpen)}
                    className={cn("h-8 w-8", !sidebarOpen && "mx-auto")}
                  >
                    {sidebarOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <p>{sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>

          {sidebarOpen && (
            <div className="p-4">
              <Button className="w-full" asChild>
                <Link href="/dashboard/organizations">
                  <Plus className="mr-2 h-4 w-4" />
                  New Organization
                </Link>
              </Button>
            </div>
          )}

          <ScrollArea className="flex-1 px-3">
            <div className="space-y-1 py-2">
              {sidebarItems.map((item) => (
                <TooltipProvider key={item.href}>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant={pathname === item.href ? "secondary" : "ghost"}
                        className={cn(
                          "w-full transition-all duration-200",
                          pathname === item.href && "bg-secondary",
                          sidebarOpen ? "justify-start" : "justify-center px-2",
                        )}
                        asChild
                      >
                        <Link href={item.href}>
                          <item.icon className={cn("h-4 w-4", sidebarOpen && "mr-2")} />
                          {sidebarOpen && item.title}
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    {!sidebarOpen && (
                      <TooltipContent side="right">
                        <p>{item.title}</p>
                      </TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
              ))}
            </div>
          </ScrollArea>
        </div>
      </aside>
    </>
  )
}
