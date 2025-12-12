'use client'

import { Button } from '@/components/ui/button'
import { Moon, Sun, Maximize2, Minimize2 } from 'lucide-react'
import { useState, useEffect } from 'react'

interface ReaderControlsProps {
  onThemeToggle?: () => void
  onFullscreenToggle?: () => void
  isFullscreen?: boolean
}

export function ReaderControls({
  onThemeToggle,
  onFullscreenToggle,
  isFullscreen = false,
}: ReaderControlsProps) {
  const [theme, setTheme] = useState<'light' | 'dark'>('dark')

  useEffect(() => {
    // Detectar tema atual
    const isDark = document.documentElement.classList.contains('dark')
    setTheme(isDark ? 'dark' : 'light')
  }, [])

  const handleThemeToggle = () => {
    const html = document.documentElement
    const newTheme = html.classList.contains('dark') ? 'light' : 'dark'
    
    html.classList.toggle('dark')
    setTheme(newTheme)
    
    // Salvar preferência
    localStorage.setItem('theme', newTheme)
    
    onThemeToggle?.()
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 flex gap-2">
      <Button
        variant="outline"
        size="icon"
        onClick={handleThemeToggle}
        className="bg-card/80 backdrop-blur-sm"
        title={theme === 'dark' ? 'Modo Claro' : 'Modo Escuro'}
      >
        {theme === 'dark' ? (
          <Sun className="h-4 w-4" />
        ) : (
          <Moon className="h-4 w-4" />
        )}
      </Button>

      {onFullscreenToggle && (
        <Button
          variant="outline"
          size="icon"
          onClick={onFullscreenToggle}
          className="bg-card/80 backdrop-blur-sm"
          title={isFullscreen ? 'Sair do Modo Tela Cheia' : 'Modo Tela Cheia'}
        >
          {isFullscreen ? (
            <Minimize2 className="h-4 w-4" />
          ) : (
            <Maximize2 className="h-4 w-4" />
          )}
        </Button>
      )}
    </div>
  )
}


