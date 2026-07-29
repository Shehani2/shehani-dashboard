'use client'

import { useEffect } from 'react'
import { applyThemeMode, applyAccentColor } from '@/lib/theme'

export function ThemeInitializer() {
  useEffect(() => {
    // Load Saved Theme Mode & Accent Color on app startup
    const savedMode = (localStorage.getItem('lifeos_theme_mode') as any) || 'dark'
    const savedAccent = (localStorage.getItem('lifeos_accent_color') as any) || 'pink'

    applyThemeMode(savedMode)
    applyAccentColor(savedAccent)
  }, [])

  return null
}