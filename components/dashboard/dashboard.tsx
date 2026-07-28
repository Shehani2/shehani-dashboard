'use client'

import { useState, useEffect } from 'react'
import { Bell, CalendarDays, Sparkles, Camera } from 'lucide-react'
import { DailyFocus } from './daily-focus'
import { ProjectsKanban } from './projects-kanban'
import { GoalsRoadmap } from './goals-roadmap'
import { AssistantDrawer } from './assistant-drawer'

export function Dashboard() {
  const [assistantOpen, setAssistantOpen] = useState(false)
  const [greeting, setGreeting] = useState('Good morning')
  const [profileImg, setProfileImg] = useState<string | null>(null)

  useEffect(() => {
    // 1. Dynamic Greeting based on current time
    const hour = new Date().getHours()
    if (hour < 12) setGreeting('Good morning')
    else if (hour < 18) setGreeting('Good afternoon')
    else setGreeting('Good evening')

    // 2. Load Saved Profile Image from LocalStorage
    const savedImg = localStorage.getItem('lifeos_profile_pic')
    if (savedImg) setProfileImg(savedImg)
  }, [])

  // Handle Interactive Profile Photo Upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setProfileImg(base64String)
        localStorage.setItem('lifeos_profile_pic', base64String)
      }
      reader.readAsDataURL(file)
    }
  }

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-6 md:px-8 md:py-10">
        {/* Header */}
        <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3.5">
            {/* Interactive Profile Photo / Avatar Badge */}
            <div className="relative group cursor-pointer">
              <label htmlFor="dashboard-profile-upload" className="cursor-pointer">
                {profileImg ? (
                  <img
                    src={profileImg}
                    alt="Shehani"
                    className="h-12 w-12 rounded-2xl object-cover border-2 border-primary/40 shadow-md shadow-primary/20 transition group-hover:opacity-80"
                  />
                ) : (
                  <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/20 border border-primary-foreground/20">
                    <span className="font-display text-xl font-bold">S</span>
                  </span>
                )}
                
                {/* Camera Overlay Icon on Hover */}
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
                {today}
              </p>
              <h1 className="font-display text-2xl font-bold leading-tight text-balance">
                {greeting}, Shehani 🌸
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-colors hover:text-foreground"
              aria-label="Notifications"
            >
              <Bell className="h-5 w-5" aria-hidden="true" />
            </button>
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

        {/* 1. Daily Focus */}
        <DailyFocus />

        {/* 2. Monthly & Projects */}
        <ProjectsKanban />

        {/* 3. Future Vision & Goals */}
        <GoalsRoadmap />
      </div>

      {/* 4. AI Personal Assistant Drawer */}
      <AssistantDrawer open={assistantOpen} onClose={() => setAssistantOpen(false)} />

      {/* Floating assistant button (mobile-friendly) */}
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
