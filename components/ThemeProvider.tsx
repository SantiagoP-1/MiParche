'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import type { Theme } from '@/types'

interface ThemeContextValue {
  theme: Theme
  toggle: () => Promise<void>
}

const ThemeContext = createContext<ThemeContextValue>({
  theme: 'dark',
  toggle: async () => {},
})

export function useTheme() {
  return useContext(ThemeContext)
}

interface Props {
  initialTheme: Theme
  children: React.ReactNode
}

export function ThemeProvider({ initialTheme, children }: Props) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  // Apply theme class to <html> on mount and on change
  useEffect(() => {
    const root = document.documentElement
    if (theme === 'light') {
      root.classList.add('light')
      root.classList.remove('dark')
    } else {
      root.classList.add('dark')
      root.classList.remove('light')
    }
  }, [theme])

  async function toggle() {
    const next: Theme = theme === 'dark' ? 'light' : 'dark'
    setTheme(next) // optimistic update

    try {
      await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: next }),
      })
    } catch {
      // revert on error
      setTheme(theme)
    }
  }

  return (
    <ThemeContext.Provider value={{ theme, toggle }}>
      {children}
    </ThemeContext.Provider>
  )
}
