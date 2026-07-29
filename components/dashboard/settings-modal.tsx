'use client'

import { useState, useEffect } from 'react'
import { X, User, Shield, Palette, Bell, Check, Sparkles, LogOut, Camera, Trash2, Sun, Moon, AlertTriangle } from 'lucide-react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { applyThemeMode, applyAccentColor, AccentColor, ThemeMode } from '@/lib/theme'

interface SettingsModalProps {
  isOpen: boolean
  onClose: () => void
  user: any
  onUserUpdate?: () => void
}

export function SettingsModal({ isOpen, onClose, user, onUserUpdate }: SettingsModalProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<'profile' | 'appearance' | 'notifications' | 'account'>('profile')

  // 1. Profile States
  const [fullName, setFullName] = useState('')
  const [nickname, setNickname] = useState('')
  const [occupation, setOccupation] = useState('')
  const [profileImg, setProfileImg] = useState<string | null>(null)

  // 2. Appearance States (Default Accent = Emerald Green for New Users)
  const [themeMode, setThemeMode] = useState<ThemeMode>('dark')
  const [accentColor, setAccentColor] = useState<AccentColor>('emerald')

  // 3. Notification States
  const [habitReminders, setHabitReminders] = useState(true)
  const [aiSuggestions, setAiSuggestions] = useState(true)

  // 4. Security & Account States
  const [newPassword, setNewPassword] = useState('')

  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')
  const [errorMsg, setErrorMsg] = useState('')

  useEffect(() => {
    if (user) {
      setFullName(user?.user_metadata?.full_name || '')
      setNickname(user?.user_metadata?.nickname || '')
      setOccupation(user?.user_metadata?.occupation || '')

      // Load Profile Picture specifically for this logged-in User ID
      const savedImg = localStorage.getItem(`lifeos_profile_pic_${user.id}`)
      if (savedImg) {
        setProfileImg(savedImg)
      } else {
        setProfileImg(user?.user_metadata?.avatar_url || null)
      }
    }

    // Load Preferences (Default to 'emerald' if not set)
    const savedTheme = (localStorage.getItem('lifeos_theme_mode') as ThemeMode) || 'dark'
    setThemeMode(savedTheme)

    const savedAccent = (localStorage.getItem('lifeos_accent_color') as AccentColor) || 'emerald'
    setAccentColor(savedAccent)

    const savedHabitRem = localStorage.getItem('lifeos_habit_reminders')
    if (savedHabitRem !== null) setHabitReminders(savedHabitRem === 'true')

    const savedAiSugg = localStorage.getItem('lifeos_ai_suggestions')
    if (savedAiSugg !== null) setAiSuggestions(savedAiSugg === 'true')
  }, [user])

  if (!isOpen) return null

  // Live Theme Switch Handlers
  const handleThemeModeChange = (mode: ThemeMode) => {
    setThemeMode(mode)
    applyThemeMode(mode)
  }

  const handleAccentColorChange = (accent: AccentColor) => {
    setAccentColor(accent)
    applyAccentColor(accent)
  }

  // Profile Save
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    setErrorMsg('')

    try {
      const { error } = await supabase.auth.updateUser({
        data: {
          full_name: fullName,
          nickname: nickname,
          occupation: occupation,
        },
      })

      if (error) throw error

      setMessage('Profile details updated! ✨')
      if (onUserUpdate) onUserUpdate()
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update profile')
    } finally {
      setSaving(false)
    }
  }

  // Handle Photo Upload (User-Specific Key)
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && user) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const base64 = reader.result as string
        setProfileImg(base64)
        localStorage.setItem(`lifeos_profile_pic_${user.id}`, base64)
        if (onUserUpdate) onUserUpdate()
        setMessage('Profile photo updated! 📸')
        setTimeout(() => setMessage(''), 3000)
      }
      reader.readAsDataURL(file)
    }
  }

  // Remove Photo (User-Specific Key)
  const handleRemovePhoto = () => {
    setProfileImg(null)
    if (user) {
      localStorage.removeItem(`lifeos_profile_pic_${user.id}`)
    }
    if (onUserUpdate) onUserUpdate()
    setMessage('Profile photo removed!')
    setTimeout(() => setMessage(''), 3000)
  }

  // Save Preferences
  const handleToggleHabitReminders = (val: boolean) => {
    setHabitReminders(val)
    localStorage.setItem('lifeos_habit_reminders', String(val))
  }

  const handleToggleAiSuggestions = (val: boolean) => {
    setAiSuggestions(val)
    localStorage.setItem('lifeos_ai_suggestions', String(val))
  }

  // Password Change
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPassword) return
    setSaving(true)
    setMessage('')
    setErrorMsg('')

    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword })
      if (error) throw error
      setMessage('Password updated successfully! 🔑')
      setNewPassword('')
      setTimeout(() => setMessage(''), 3000)
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to update password')
    } finally {
      setSaving(false)
    }
  }

  // Reset Data
  const handleResetData = () => {
    if (confirm('Are you sure you want to reset local app data? This will reset custom preferences.')) {
      localStorage.clear()
      setMessage('App data reset successfully!')
      setTimeout(() => {
        window.location.reload()
      }, 1500)
    }
  }

  // Handle Log Out
  const handleLogOut = async () => {
    await supabase.auth.signOut()
    router.push('/')
    router.refresh()
  }

  const displayName = 
    nickname || 
    fullName || 
    user?.user_metadata?.nickname || 
    user?.user_metadata?.full_name || 
    user?.email?.split('@')[0] || 
    'U'

  const avatarLetter = displayName.charAt(0).toUpperCase()

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-card border border-border rounded-3xl shadow-2xl overflow-hidden flex flex-col md:flex-row max-h-[90vh]">
        
        {/* Left Navigation Sidebar */}
        <div className="w-full md:w-56 bg-accent/20 border-b md:border-b-0 md:border-r border-border p-5 flex flex-col justify-between shrink-0">
          <div>
            <div className="flex items-center justify-between md:justify-start gap-2 mb-6">
              <span className="font-bold text-base text-primary flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-primary" /> Settings
              </span>
              <button onClick={onClose} className="md:hidden p-1 text-muted-foreground hover:text-foreground">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex md:flex-col gap-1.5 overflow-x-auto">
              <button
                onClick={() => { setActiveTab('profile'); setMessage(''); setErrorMsg(''); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  activeTab === 'profile'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <User className="w-4 h-4" /> Profile & Account
              </button>

              <button
                onClick={() => { setActiveTab('appearance'); setMessage(''); setErrorMsg(''); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  activeTab === 'appearance'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Palette className="w-4 h-4" /> Theme & Colors
              </button>

              <button
                onClick={() => { setActiveTab('notifications'); setMessage(''); setErrorMsg(''); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  activeTab === 'notifications'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Bell className="w-4 h-4" /> Preferences
              </button>

              <button
                onClick={() => { setActiveTab('account'); setMessage(''); setErrorMsg(''); }}
                className={`flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition shrink-0 ${
                  activeTab === 'account'
                    ? 'bg-primary text-primary-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground hover:bg-accent'
                }`}
              >
                <Shield className="w-4 h-4" /> Security & Actions
              </button>
            </nav>
          </div>

          {/* Left Sidebar Log Out Button */}
          <div className="pt-4 border-t border-border/60 mt-4 md:mt-auto">
            <button
              onClick={handleLogOut}
              className="w-full flex items-center justify-center md:justify-start gap-2 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-primary bg-primary/10 border border-primary/30 hover:bg-primary/20 transition"
            >
              <LogOut className="w-4 h-4 text-primary" /> Log Out
            </button>
          </div>
        </div>

        {/* Right Tab Content */}
        <div className="flex-1 p-6 overflow-y-auto relative">
          <button 
            onClick={onClose} 
            className="hidden md:block absolute top-4 right-4 p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Feedback Messages */}
          {message && (
            <div className="mb-4 p-3 rounded-xl bg-primary/10 border border-primary/20 text-primary text-xs font-medium text-center flex items-center justify-center gap-2">
              <Check className="w-4 h-4" /> {message}
            </div>
          )}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/20 text-destructive text-xs font-medium text-center">
              {errorMsg}
            </div>
          )}

          {/* TAB 1: Profile & Photo */}
          {activeTab === 'profile' && (
            <div>
              <h2 className="text-lg font-bold mb-1">Account & Profile</h2>
              <p className="text-xs text-muted-foreground mb-6">Manage photo, display name and details.</p>

              {/* Photo Change Section */}
              <div className="flex items-center gap-4 mb-6 p-4 rounded-2xl border border-border bg-accent/20">
                <div className="relative">
                  {profileImg ? (
                    <img 
                      src={profileImg} 
                      alt="Avatar" 
                      onError={() => setProfileImg(null)}
                      className="w-14 h-14 rounded-2xl object-cover border-2 border-primary" 
                    />
                  ) : (
                    <div className="w-14 h-14 rounded-2xl bg-primary text-primary-foreground font-bold text-xl flex items-center justify-center shadow-md">
                      {avatarLetter}
                    </div>
                  )}
                </div>
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-2">
                    <label htmlFor="settings-photo-input" className="cursor-pointer px-3.5 py-1.5 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition flex items-center gap-1.5 shadow-sm">
                      <Camera className="w-3.5 h-3.5" /> Upload Photo
                    </label>
                    <input id="settings-photo-input" type="file" accept="image/*" onChange={handlePhotoUpload} className="hidden" />
                    
                    {profileImg && (
                      <button 
                        type="button" 
                        onClick={handleRemovePhoto} 
                        className="px-3.5 py-1.5 bg-primary/10 text-primary border border-primary/20 rounded-xl text-xs font-semibold hover:bg-primary/20 transition flex items-center gap-1.5"
                      >
                        <Trash2 className="w-3.5 h-3.5 text-primary" /> Remove
                      </button>
                    )}
                  </div>
                  <span className="text-[11px] text-muted-foreground">PNG or JPG up to 5MB.</span>
                </div>
              </div>

              {/* Profile Details Form */}
              <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Nickname (App Greeting Name)</label>
                  <input
                    type="text"
                    required
                    value={nickname}
                    onChange={(e) => setNickname(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted-foreground mb-1 block">Role / Occupation</label>
                  <input
                    type="text"
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    placeholder="e.g. Student, Business Analyst"
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={saving}
                    className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition shadow-md disabled:opacity-50"
                  >
                    {saving ? 'Saving...' : 'Save Profile Changes'}
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* TAB 2: Appearance & Theme */}
          {activeTab === 'appearance' && (
            <div>
              <h2 className="text-lg font-bold mb-1">Theme & Appearance</h2>
              <p className="text-xs text-muted-foreground mb-6">Customize interface themes and primary accent colors.</p>

              {/* Color Accent Picker */}
              <div className="mb-6">
                <label className="text-xs font-semibold text-muted-foreground mb-3 block">Color Accent</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleAccentColorChange('emerald')}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${accentColor === 'emerald' ? 'border-primary bg-primary/10' : 'border-border'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: '#10b981' }} />
                      <span className="text-xs font-semibold">Emerald Green</span>
                    </div>
                    {accentColor === 'emerald' && <Check className="w-4 h-4 text-primary" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAccentColorChange('violet')}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${accentColor === 'violet' ? 'border-primary bg-primary/10' : 'border-border'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: '#a855f7' }} />
                      <span className="text-xs font-semibold">Violet Glow</span>
                    </div>
                    {accentColor === 'violet' && <Check className="w-4 h-4 text-primary" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAccentColorChange('pink')}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${accentColor === 'pink' ? 'border-primary bg-primary/10' : 'border-border'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: '#ec4899' }} />
                      <span className="text-xs font-semibold">Rose Pink</span>
                    </div>
                    {accentColor === 'pink' && <Check className="w-4 h-4 text-primary" />}
                  </button>

                  <button
                    type="button"
                    onClick={() => handleAccentColorChange('amber')}
                    className={`p-3 rounded-2xl border flex items-center justify-between transition ${accentColor === 'amber' ? 'border-primary bg-primary/10' : 'border-border'}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div className="w-5 h-5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: '#f59e0b' }} />
                      <span className="text-xs font-semibold">Gold Accent</span>
                    </div>
                    {accentColor === 'amber' && <Check className="w-4 h-4 text-primary" />}
                  </button>
                </div>
              </div>

              {/* Mode Selection */}
              <div>
                <label className="text-xs font-semibold text-muted-foreground mb-3 block">Display Mode</label>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => handleThemeModeChange('dark')}
                    className={`flex-1 p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${themeMode === 'dark' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    <Moon className="w-4 h-4" /> Dark Mode
                  </button>

                  <button
                    type="button"
                    onClick={() => handleThemeModeChange('light')}
                    className={`flex-1 p-3.5 rounded-2xl border flex items-center justify-center gap-2 text-xs font-semibold transition ${themeMode === 'light' ? 'border-primary bg-primary/10 text-primary' : 'border-border text-muted-foreground'}`}
                  >
                    <Sun className="w-4 h-4" /> Light Mode
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Notifications & Preferences */}
          {activeTab === 'notifications' && (
            <div>
              <h2 className="text-lg font-bold mb-1">Notifications & Preferences</h2>
              <p className="text-xs text-muted-foreground mb-6">Manage smart alerts and AI assistance options.</p>

              <div className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10">
                  <div>
                    <h4 className="text-xs font-bold mb-0.5">Daily Habit Reminders</h4>
                    <p className="text-[11px] text-muted-foreground">Receive daily motivational streak check-ins.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={habitReminders}
                    onChange={(e) => handleToggleHabitReminders(e.target.checked)}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                </div>

                <div className="flex items-center justify-between p-4 rounded-2xl border border-border bg-accent/10">
                  <div>
                    <h4 className="text-xs font-bold mb-0.5">AI Rose Suggestions</h4>
                    <p className="text-[11px] text-muted-foreground">Allow AI Rose to suggest daily productivity tips.</p>
                  </div>
                  <input
                    type="checkbox"
                    checked={aiSuggestions}
                    onChange={(e) => handleToggleAiSuggestions(e.target.checked)}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary accent-primary cursor-pointer"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Security & Actions */}
          {activeTab === 'account' && (
            <div>
              <h2 className="text-lg font-bold mb-1">Security & Account Actions</h2>
              <p className="text-xs text-muted-foreground mb-6">Update password and manage data safety.</p>

              <div className="mb-6 p-4 rounded-2xl border border-border bg-accent/20">
                <span className="text-xs text-muted-foreground block mb-1">Logged-in Email</span>
                <span className="text-sm font-semibold">{user?.email}</span>
              </div>

              {/* Password Form */}
              <form onSubmit={handleUpdatePassword} className="flex flex-col gap-4 mb-8">
                <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Change Password</h3>
                <div>
                  <input
                    type="password"
                    required
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-xl border border-border bg-background py-2.5 px-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div>
                  <button
                    type="submit"
                    disabled={saving || !newPassword}
                    className="rounded-xl bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground hover:opacity-90 transition shadow-md disabled:opacity-50"
                  >
                    {saving ? 'Updating...' : 'Update Password'}
                  </button>
                </div>
              </form>

              {/* Danger Zone */}
              <div className="pt-6 border-t border-border">
                <h3 className="text-xs font-bold text-primary uppercase tracking-wider mb-3 flex items-center gap-1.5">
                  <AlertTriangle className="w-4 h-4 text-primary" /> Danger Zone
                </h3>
                <div className="flex flex-col gap-2.5">
                  <button
                    type="button"
                    onClick={handleResetData}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/20 hover:bg-primary/20 transition"
                  >
                    <span>Reset Local Preferences & Data</span>
                    <Trash2 className="w-4 h-4 text-primary" />
                  </button>

                  <button
                    type="button"
                    onClick={handleLogOut}
                    className="w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-semibold bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition"
                  >
                    <span>Log Out from LifeOS</span>
                    <LogOut className="w-4 h-4 text-primary" />
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}