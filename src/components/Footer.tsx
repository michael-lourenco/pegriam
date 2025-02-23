"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import Image from "next/image"

const menuItems = [
  { image: "/images/buttons/btn_home.png", label: "Home", href: "/" },
  { image: "/images/buttons/btn_bounty.png", label: "Histórias", href: "/story" },
  { image: "/images/buttons/btn_info.png", label: "Sobre", href: "/about" },
] as const

export function Footer() {
  const pathname = usePathname()

  return (
    <TooltipProvider>
      <footer className="sticky bottom-0 w-full bg-footer-background shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.5)]">
        <nav className="max-w-md mx-auto">
          <div className="flex justify-between items-center">
            {menuItems.map((item, index) => {
              const isActive = pathname === item.href
              return (
                <div key={item.href} className="flex items-center w-full">
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        asChild
                        variant={isActive ? "default" : "ghost"}
                        className="flex-1 flex flex-col items-center justify-center h-20 space-y-1 rounded-none hover:bg-background transition-all duration-200 relative group"
                      >
                        <Link href={item.href} className="flex items-center justify-center">
                          <div className="relative transition-transform duration-200 group-hover:scale-110">
                            <Image
                              src={item.image}
                              alt={item.label}
                              width={56}
                              height={60}
                              className="w-auto h-auto"
                            />
                          </div>
                        </Link>
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent 
                      side="top" 
                      className="bg-gray-800 text-white px-4 py-2 rounded-lg shadow-lg"
                    >
                      <p className="font-lilita-one text-lg">{item.label}</p>
                    </TooltipContent>
                  </Tooltip>
                  {index < menuItems.length - 1 && (
                    <div className="w-px h-10 bg-[#EEC609] self-center" />
                  )}
                </div>
              )
            })}
          </div>
        </nav>
      </footer>
    </TooltipProvider>
  )
}