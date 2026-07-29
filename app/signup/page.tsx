'span client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { Sparkles, Lock, Mail, User, Briefcase } from 'lucide-react'

export default function SignUpPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [nickname, setNickname] = useState('')
  const [occupation, setOccupation] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [errorMsg, setErrorMsg] = useState('')

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            nickname: nickname,
            occupation: occupation,
          },
        },
      })

      if (error) throw error

      // Redirect to dashboard after successful signup
      router.push('/')
      router.refresh()
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to sign up')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-3xl p-8 shadow-2xl">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex p-3 rounded-2xl bg-primary/10 text-primary mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h1 className="text-xl font-bold">Create LifeOS Account</h1>
          <p className="text-xs text-muted-foreground mt-1">Start organizing your goals, habits, and tasks today.</p>
        </div>

        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs text-center">
            {errorMsg}
          </div>
        )}

        {/* Sign Up Form with Autofill Protection */}
        <form onSubmit={handleSignUp} className="flex flex-col gap-4" autoComplete="off">
          
          {/* Full Name */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="e.g. Shehani Vimodya"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Nickname */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nickname (App Greeting Name)</label>
            <div className="relative flex items-center">
              <User className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                required
                autoComplete="off"
                placeholder="e.g. Shehani"
                value={nickname}
                onChange={(e) => setNickname(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Occupation */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Role / Occupation</label>
            <div className="relative flex items-center">
              <Briefcase className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                autoComplete="off"
                placeholder="e.g. Student, Business Analyst"
                value={occupation}
                onChange={(e) => setOccupation(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Email Address (Protected from Autofill) */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email Address</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="email"
                required
                autoComplete="off"
                name="new-user-email-field"
                placeholder="e.g. shehani@gmail.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Password (Protected from Autofill) */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Password</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-muted-foreground" />
              <input
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-primary py-3 text-xs font-semibold text-primary-foreground hover:opacity-90 transition shadow-md disabled:opacity-50"
            >
              {loading ? 'Creating Account...' : 'Create Account & Continue'}
            </button>
          </div>
        </form>

        <div className="mt-6 text-center text-xs text-muted-foreground">
          Already have an account?{' '}
          <a href="/signin" className="text-primary font-semibold hover:underline">
            Sign In
          </a>
        </div>

      </div>
    </div>
  )
}