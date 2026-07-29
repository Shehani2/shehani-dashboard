'use client'

import { useState, useEffect, useRef } from 'react'
import { Bell, Check, Sparkles, Flame, Target, Trash2, X } from 'lucide-react'

export interface NotificationItem {
  id: string
  title: string
  message: string
  time: string
  type: 'habit' | 'ai' | 'goal' | 'system'
  read: boolean
}

export function NotificationPopover() {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState<NotificationItem[]>([])
  const popoverRef = useRef<HTMLDivElement>(null)

  // Load and auto-generate smart notifications based on user settings
  useEffect(() => {
    const isHabitEnabled = localStorage.getItem('lifeos_habit_reminders') !== 'false'
    const isAiEnabled = localStorage.getItem('lifeos_ai_suggestions') !== 'false'

    const sampleNotifications: NotificationItem[] = []

    if (isHabitEnabled) {
      sampleNotifications.push({
        id: '1',
        title: 'Habit Streak Alert 💧',
        message: 'Keep up your 21-day streak! Drink 2L of water today.',
        time: '10 mins ago',
        type: 'habit',
        read: false,
      })
    }

    if (isAiEnabled) {
      sampleNotifications.push({
        id: '2',
        title: 'AI Rose Suggestion 🌸',
        message: 'Great momentum today! Focus on completing your #1 Top Priority.',
        time: '1 hour ago',
        type: 'ai',
        read: false,
      })
    }

    sampleNotifications.push({
      id: '3',
      title: 'Vision Milestone 🚀',
      message: 'You reached 84% progress on "Launch my portfolio"!',
      time: 'Yesterday',
      type: 'goal',
      read: true,
    })

    const savedNotifs = localStorage.getItem('lifeos_notifications')
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs))
      } catch (e) {
        setNotifications(sampleNotifications)
      }
    } else {
      setNotifications(sampleNotifications)
      localStorage.setItem('lifeos_notifications', JSON.stringify(sampleNotifications))
    }
  }, [])

  // Close popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (popoverRef.current && !popoverRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const unreadCount = notifications.filter((n) => !n.read).length

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }))
    setNotifications(updated)
    localStorage.setItem('lifeos_notifications', JSON.stringify(updated))
  }

  const deleteNotification = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    const updated = notifications.filter((n) => n.id !== id)
    setNotifications(updated)
    localStorage.setItem('lifeos_notifications', JSON.stringify(updated))
  }

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'habit':
        return <Flame className="w-4 h-4 text-primary" />
      case 'ai':
        return <Sparkles className="w-4 h-4 text-primary" />
      case 'goal':
        return <Target className="w-4 h-4 text-primary" />
      default:
        return <Bell className="w-4 h-4 text-primary" />
    }
  }

  return (
    <div className="relative" ref={popoverRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 rounded-2xl border border-border bg-card text-muted-foreground hover:text-foreground hover:border-primary/50 transition cursor-pointer"
        aria-label="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1.5 right-1.5 w-2.5 h-2.5 bg-primary rounded-full ring-2 ring-background animate-pulse" />
        )}
      </button>

      {/* Notification Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 md:w-96 bg-card border border-border rounded-3xl shadow-2xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className="p-4 border-b border-border flex items-center justify-between bg-accent/20">
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-foreground">Notifications</span>
              {unreadCount > 0 && (
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-primary/20 text-primary border border-primary/30">
                  {unreadCount} new
                </span>
              )}
            </div>
            {unreadCount > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-[11px] font-semibold text-primary hover:underline flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" /> Mark all read
              </button>
            )}
          </div>

          {/* Notification List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border/40">
            {notifications.length === 0 ? (
              <div className="p-8 text-center text-xs text-muted-foreground">
                No notifications right now! ✨
              </div>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className={`p-3.5 flex items-start justify-between gap-3 transition ${
                    item.read ? 'bg-transparent opacity-70' : 'bg-primary/5'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-xl bg-primary/10 border border-primary/20 shrink-0 mt-0.5">
                      {getIcon(item.type)}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-foreground mb-0.5">{item.title}</h4>
                      <p className="text-[11px] text-muted-foreground leading-relaxed">{item.message}</p>
                      <span className="text-[10px] text-muted-foreground/70 mt-1 block font-mono">
                        {item.time}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={(e) => deleteNotification(item.id, e)}
                    className="text-muted-foreground hover:text-destructive p-1 rounded-lg transition"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}