'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { Sparkles, Lock, CheckCircle2, Eye, EyeOff, ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    // Check if there is an error in URL hash (like expired link)
    const hash = window.location.hash
    if (hash.includes('error_description')) {
      const params = new URLSearchParams(hash.replace('#', '?'))
      const errorDesc = params.get('error_description')
      if (errorDesc) {
        setErrorMsg(decodeURIComponent(errorDesc).replace(/\+/g, ' '))
      }
    }
  }, [])

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setMessage('')

    try {
      const { error } = await supabase.auth.updateUser({ password })
      if (error) throw error

      setMessage('Password එක සාර්ථකව වෙනස් කළා! ඊළඟ තත්පරයේදී Sign In වෙත යොමු කෙරේ...')
      setTimeout(() => {
        router.push('/login')
      }, 2000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden text-foreground">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-3">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Set New Password</h1>
          <p className="text-xs text-muted-foreground mt-1">
            Enter your new password below to update your account.
          </p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
            {errorMsg}
            <div className="mt-2">
              <Link href="/login" className="text-primary underline text-xs font-semibold">
                Request a new reset link
              </Link>
            </div>
          </div>
        )}

        {message && (
          <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {message}
          </div>
        )}

        {!errorMsg.includes('expired') && (
          <form onSubmit={handleResetPassword} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-muted-foreground mb-1 block">New Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}

        <div className="mt-6 text-center text-xs text-muted-foreground">
          <Link href="/login" className="text-primary font-semibold hover:underline flex items-center justify-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  )
}