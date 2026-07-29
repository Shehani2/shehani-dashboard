'use client'

import { useState, useEffect } from 'react'
import { Dashboard } from '@/components/dashboard/dashboard'
import { supabase } from '@/lib/supabase'
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, LayoutDashboard } from 'lucide-react'
import Link from 'next/link'

export default function Page() {
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
        <div className="flex items-center gap-2 animate-pulse text-primary font-semibold">
          <Sparkles className="w-5 h-5 animate-spin" /> Loading LifeOS...
        </div>
      </div>
    )
  }

  // 1️⃣ User කෙනෙක් Logged in නම් කෙලින්ම Dashboard එක පෙන්වන්න
  if (user) {
    return <Dashboard />
  }

  // 2️⃣ Sign out වෙච්ච / අලුතින් App එකට ආපු කෙනෙක්ට Brand Landing Page එක පෙන්වන්න
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col items-center justify-center px-4 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-primary/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-2xl w-full text-center relative z-10 py-12">
        {/* Brand Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5" /> Your Ultimate Productivity Workspace
        </div>

        {/* Brand Title */}
        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight mb-4">
          Welcome to <span className="text-primary">LifeOS</span>
        </h1>
        <p className="text-sm sm:text-base text-muted-foreground max-w-lg mx-auto mb-10 leading-relaxed">
          Manage your daily tasks, track habits, organize projects, and supercharge your personal productivity all in one secure place.
        </p>

        {/* Next Steps / Features Highlight Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
          <div className="p-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-sm">
            <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Smart Priorities</h3>
            <p className="text-xs text-muted-foreground">Focus on what truly matters every single day without distraction.</p>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-sm">
            <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit mb-3">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Habit & Task Sync</h3>
            <p className="text-xs text-muted-foreground">Track consistency and keep your projects fully synchronized in cloud.</p>
          </div>

          <div className="p-4 rounded-2xl border border-border bg-card/50 backdrop-blur-sm shadow-sm">
            <div className="p-2 rounded-xl bg-primary/10 text-primary w-fit mb-3">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <h3 className="font-semibold text-sm mb-1">Secure & Private</h3>
            <p className="text-xs text-muted-foreground">Your personal data is encrypted and stored safely with Supabase.</p>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/login"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-primary text-primary-foreground px-8 py-3.5 rounded-2xl font-semibold text-sm hover:opacity-90 transition shadow-lg shadow-primary/25"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  )
}