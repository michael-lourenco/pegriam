"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Icon } from "./icons"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

const menuItems = [
  { icon: "LuHouse", label: "Home", href: "/" },
  { icon: "LuCircleHelp", label: "Pegriam", href: "/about" },
  { icon: "LuBook", label: "Histórias", href: "/story" },
  { icon: "LuUser", label: "Perfil", href: "/profile" },
] as const

export function Footer() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <footer className="sticky bottom-0 w-full bg-footer-background border-dashed border-t ">
        <nav className="max-w-md mx-auto px-0 py-0">
          <div className="flex justify-between items-center">
            {menuItems.map((item) => {
              const isActive = pathname === item.href
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>
                    <Button
                      asChild
                      variant={isActive ? "default" : "ghost"}
                      className="flex-1 flex flex-col items-center justify-center h-16 space-y-1 rounded-none"
                    >
                      <Link href={item.href}>
                        <Icon name={item.icon} className="h-12 w-12" />
                      </Link>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent side="top">
                    <p className="font-lilita">{item.label}</p>
                  </TooltipContent>
                </Tooltip>
              )
            })}
          </div>
        </nav>
      </footer>
    </TooltipProvider>
  )
}
