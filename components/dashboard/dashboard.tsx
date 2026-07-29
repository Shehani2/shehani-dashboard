'use client'

import { useState, useEffect } from 'react'
import { CalendarDays, Sparkles, Camera, Settings } from 'lucide-react'
import { DailyFocus } from './daily-focus'
import { ProjectsKanban } from './projects-kanban'
import { GoalsRoadmap } from './goals-roadmap'
import { AssistantDrawer } from './assistant-drawer'
import { SettingsModal } from './settings-modal'
import { NotificationPopover } from './notification-popover'
import { supabase } from '@/lib/supabase'
import { applyAccentColor, AccentColor } from '@/lib/theme'

export function Dashboard() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [settingsOpen, setSettingsOpen] = useState(false)
  const [greeting, setGreeting] = useState('Good morning')
  const [currentDate, setCurrentDate] = useState('')
  const [profileImg, setProfileImg] = useState<string | null>(null)
  const [user, setUser] = useState<any>(null)

  // Fetch / Refetch User Data
  const fetchUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)

    if (user) {
      // 1. Account-Specific Profile Photo
      const userPhotoKey = `lifeos_profile_pic_${user.id}`
      const savedImg = localStorage.getItem(userPhotoKey)
      setProfileImg(savedImg || user?.user_metadata?.avatar_url || null)

      // 2. Account-Specific Accent Color (Defaults to 'emerald' for new user accounts)
      const userAccentKey = `lifeos_accent_color_${user.id}`
      const userAccent = (localStorage.getItem(userAccentKey) as AccentColor) || 'emerald'
      applyAccentColor(userAccent)
    } else {
      setProfileImg(null)
      applyAccentColor('emerald')
    }
  }

  useEffect(() => {
    fetchUser()

    const updateDateTime = () => {
      const now = new Date()
      const formattedDate = now.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'long',
        day: 'numeric',
      })
      setCurrentDate(formattedDate)

      const hour = now.getHours()
      if (hour < 12) setGreeting('Good morning')
      else if (hour < 18) setGreeting('Good afternoon')
      else setGreeting('Good evening')
    }

    updateDateTime()
    const timer = setInterval(updateDateTime, 60000)

    return () => clearInterval(timer)
  }, [])

  // Handle Profile Photo Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileImg(base64String)
        localStorage.setItem(`lifeos_profile_pic_${user.id}`, base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const displayName = 
    user?.user_metadata?.nickname || 
    user?.user_metadata?.full_name?.split(' ')[0] || 
    user?.email?.split('@')[0] || 
    'Friend'

  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border/40 pb-6">
          <div className="flex items-center gap-3.5">
            <div className="relative group cursor-pointer">
              <label htmlFor="dashboard-profile-upload" className="cursor-pointer">
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt={displayName}
                    onError={() => setProfileImg(null)}
                    className="h-12 w-12 rounded-2xl object-cover border-2 border-primary/40 shadow-md shadow-primary/20 transition group-hover:opacity-80"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 border border-primary-foreground/20">
                    <span className="font-display text-xl font-bold">{avatarLetter}</span>
                  </span>
                )}
                
                <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/50 opacity-0 group-hover:opacity-100 transition">
                  <Camera className="h-4 w-4 text-white" />
                </div>
              </label>

              <input
                id="dashboard-profile-upload"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            <div>
              <p className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                {currentDate || 'Loading date...'}
              </p>
              <h1 className="font-display text-2xl font-bold leading-tight text-balance">
                {greeting}, {displayName} 
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setSettingsOpen(true)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground hover:bg-accent"
              aria-label="Settings"
              title="Settings"
            >
              <Settings className="h-5 w-5" aria-hidden="true" />
            </button>

            <NotificationPopover />

            <button
              type="button"
              onClick={() => setAssistantOpen(true)}
              className="flex h-11 items-center gap-2 rounded-xl bg-primary px-4 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 shadow-md shadow-primary/20"
            >
              <Sparkles className="h-4.5 w-4.5" aria-hidden="true" />
              Ask Rose
            </button>
          </div>
        </header>

        <DailyFocus />
        <ProjectsKanban />
        <GoalsRoadmap />
      </div>

      <AssistantDrawer open={assistantOpen} onClose={() => setAssistantOpen(false)} />

      <SettingsModal
        isOpen={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        onUserUpdate={fetchUser}
      />

      <button
        type="button"
        onClick={() => setAssistantOpen(true)}
        className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform hover:scale-105"
        aria-label="Open AI assistant"
      >
        <Sparkles className="h-6 w-6" aria-hidden="true" />
      </button>
    </div>
  )
}