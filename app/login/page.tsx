'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Sparkles, ArrowLeft, Mail, Lock, CheckCircle2, Eye, EyeOff, User, Briefcase, Smile } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter()
  const [isSignUp, setIsSignUp] = useState(false)
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  
  // Form Fields
  const [fullName, setFullName] = useState('')
  const [nickname, setNickname] = useState('')
  const [occupation, setOccupation] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)

  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  // Google 1-Click Login
  const handleGoogleLogin = async () => {
    setLoading(true)
    setErrorMsg('')
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/`,
      },
    })
    if (error) {
      setErrorMsg(error.message)
      setLoading(false)
    }
  }

  // Handle Form Submit
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrorMsg('')
    setMessage('')

    try {
      if (isForgotPassword) {
        // Forgot Password Logic
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/reset-password`,
        })
        if (error) throw error
        setMessage('Password reset link sent to your email! Please check your inbox 📩')
      } else if (isSignUp) {
        if (!email.toLowerCase().includes('@') || email.length < 6) {
          throw new Error('Please enter a valid email address.')
        }

        const finalNickname = nickname.trim() || fullName.split(' ')[0]

        // Sign Up Request
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              nickname: finalNickname,
              occupation: occupation,
            },
            emailRedirectTo: `${window.location.origin}/`,
          },
        })
        if (error) throw error

        if (data.user && !data.session) {
          setMessage('Account created successfully! Please check your email inbox to click the verification link and activate your account 📩')
        } else {
          router.push('/')
          router.refresh()
        }
      } else {
        // Sign In Logic
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
        router.push('/')
        router.refresh()
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4 relative overflow-hidden text-foreground">
      {/* Background Glow */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <Link 
        href="/" 
        className="absolute top-6 left-6 flex items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Workspace
      </Link>

      <div className="w-full max-w-md rounded-3xl border border-border bg-card p-8 shadow-2xl relative z-10 my-8">
        {/* Header */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="p-3 rounded-2xl bg-primary/10 text-primary mb-3">
            <Sparkles className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {isForgotPassword 
              ? 'Reset Password' 
              : isSignUp 
              ? 'Create Your Account' 
              : 'Welcome Back'}
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            {isForgotPassword 
              ? 'Enter your email to receive a password reset link.' 
              : isSignUp 
              ? 'Fill in your details to personalize your LifeOS experience.' 
              : 'Sign in to access your LifeOS workspace.'}
          </p>
        </div>

        {/* Notifications */}
        {errorMsg && (
          <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
            {errorMsg}
          </div>
        )}
        {message && (
          <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium text-center flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            {message}
          </div>
        )}

        {/* Google Login Option */}
        {!isForgotPassword && (
          <>
            <button
              onClick={handleGoogleLogin}
              disabled={loading}
              type="button"
              className="w-full flex items-center justify-center gap-3 rounded-xl border border-border bg-background py-3 px-4 font-semibold text-sm hover:bg-accent transition shadow-sm disabled:opacity-50"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {loading ? 'Connecting...' : 'Continue with Google'}
            </button>

            <div className="relative my-5 text-center text-xs text-muted-foreground">
              <span className="bg-card px-3 relative z-10">OR</span>
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-border"></div></div>
            </div>
          </>
        )}

        {/* Input Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5" autoComplete="off">
          
          {/* Sign Up Fields */}
          {isSignUp && (
            <>
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    required
                    name="random_name_field_9182"
                    autoComplete="off"
                    data-lpignore="true"
                    placeholder="e.g. Shehani Vimodya"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nickname</label>
                <div className="relative">
                  <Smile className="absolute left-3 top-3 h-4 w-4 text-primary" />
                  <input
                    type="text"
                    required
                    name="random_nick_field_3812"
                    autoComplete="off"
                    data-lpignore="true"
                    placeholder="e.g. Shehani"
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-1 block">Role / Occupation</label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <select
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary text-foreground"
                  >
                    <option value="">Select your role...</option>
                    <option value="Student">Student</option>
                    <option value="Business Analyst">Business Analyst</option>
                    <option value="Software Engineer / Developer">Software Engineer / Developer</option>
                    <option value="Freelancer">Freelancer</option>
                    <option value="Entrepreneur">Entrepreneur</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>
            </>
          )}

          {/* Email Field */}
          <div>
            <label className="text-xs font-semibold text-muted-foreground mb-1 block">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                required
                name="random_email_field_4829"
                autoComplete="off"
                data-lpignore="true"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl border border-border bg-background py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Password Field */}
          {!isForgotPassword && (
            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-xs font-semibold text-muted-foreground">Password</label>
                {!isSignUp && (
                  <button
                    type="button"
                    onClick={() => { setIsForgotPassword(true); setErrorMsg(''); setMessage(''); }}
                    className="text-[11px] text-primary hover:underline font-medium"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  name="random_pass_field_7319"
                  autoComplete="new-password"
                  data-lpignore="true"
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
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground hover:opacity-90 transition shadow-md disabled:opacity-50 mt-2"
          >
            {loading 
              ? 'Please wait...' 
              : isForgotPassword 
              ? 'Send Reset Link' 
              : isSignUp 
              ? 'Create Account & Continue' 
              : 'Sign In'}
          </button>
        </form>

        {/* Toggle Links */}
        <div className="mt-6 text-center text-xs text-muted-foreground">
          {isForgotPassword ? (
            <button
              onClick={() => { setIsForgotPassword(false); setErrorMsg(''); setMessage(''); }}
              className="text-primary font-semibold hover:underline"
            >
              ← Back to Sign In
            </button>
          ) : isSignUp ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => { setIsSignUp(false); setErrorMsg(''); setMessage(''); }}
                className="text-primary font-semibold hover:underline"
              >
                Sign In
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => { setIsSignUp(true); setErrorMsg(''); setMessage(''); }}
                className="text-primary font-semibold hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}