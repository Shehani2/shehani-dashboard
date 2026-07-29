'use client'

import { useState, useEffect, useRef } from 'react'
import { X, Sparkles, Send, Bot, User, Loader2 } from 'lucide-react'
import { supabase } from '@/lib/supabase'

interface AssistantDrawerProps {
  open: boolean
  onClose: () => void
}

interface Message {
  id: string
  sender: 'ai' | 'user'
  text: string
}

export function AssistantDrawer({ open, onClose }: AssistantDrawerProps) {
  const [userName, setUserName] = useState('Friend')
  const [input, setInput] = useState('')
  const [messages, setMessages] = useState<Message[]>([])
  const [loading, setLoading] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Fetch Logged-in User Info
  useEffect(() => {
    const fetchUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (user) {
        const name = 
          user?.user_metadata?.nickname || 
          user?.user_metadata?.full_name?.split(' ')[0] || 
          user?.email?.split('@')[0] || 
          'Friend'
        setUserName(name)

        if (messages.length === 0) {
          setMessages([
            {
              id: '1',
              sender: 'ai',
              text: `Hi ${name}! ✨ I'm Rose, your personal AI companion. How can I help you plan your day or goals today?`,
            },
          ])
        }
      }
    }

    if (open) {
      fetchUser()
    }
  }, [open])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  if (!open) return null

  // 🧠 Comprehensive Multi-Language & Context AI Engine
  const generateSmartAIResponse = (userQuery: string, name: string): string => {
    const q = userQuery.toLowerCase().trim()

    // 1. Language Preference Requests
    if (q.includes('english') || q.includes('speak english') || q.includes('speech english')) {
      return `Sure thing, ${name}! I'll stick to English from now on. How can I assist you with your tasks or habits today? 🌸`
    }
    if (q.includes('sinhala') || q.includes('සිංහල') || q.includes('singlish')) {
      return `හරි ${name}, මට සිංහල සහ Singlish දෙකම පුළුවන්! ඔයාට කැමති භාෂාවකින් අහන්න.`
    }

    // 2. Affirmative Responses (yes, ou, ow, sure, yeah, ok)
    if (['ou', 'ow', 'yes', 'yeah', 'sure', 'ok', 'okay', 'ඔව්'].includes(q) || q.startsWith('yes ') || q.startsWith('ou ')) {
      return `Awesome! Let's get to it. Should we review your pending Habits for today, or check your Future Vision targets? 🚀`
    }

    // 3. Greetings
    if (q.includes('hi') || q.includes('hello') || q.includes('hey') || q.includes('කොහොමද')) {
      return `Hello ${name}! 👋 Ready to make progress today? Let me know what you'd like to plan or review!`
    }

    // 4. Daily Focus / Tasks / Today Plan
    if (q.includes('today') || q.includes('do') || q.includes('task') || q.includes('plan') || q.includes('වැඩ')) {
      return `For today, I recommend focusing on your Top Priorities first in the Daily Focus panel, then checking off your daily habits! 💡`
    }

    // 5. Notifications & Reminders
    if (q.includes('reminder') || q.includes('notification') || q.includes('bell') || q.includes('මතක්')) {
      return `You can check all your personalized reminders by clicking the Bell icon 🔔 at the top right of your dashboard!`
    }

    // 6. Future Vision & Goals
    if (q.includes('goal') || q.includes('vision') || q.includes('target') || q.includes('degree') || q.includes('portfolio')) {
      return `Keep working step-by-step toward your goals like building your portfolio or finishing your degree projects! You're making steady progress. 🚀`
    }

    // 7. Identity / Who are you
    if (q.includes('who are you') || q.includes('your name') || q.includes('kavuda')) {
      return `I'm Rose, your personal AI companion built into Bloom LifeOS to help you stay productive and organized! 🌸`
    }

    // 8. General Smart Response
    return `Got it, ${name}! I'm here to support you. Feel free to ask me anything about your schedule, habits, or future goals! ✨`
  }

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return

    const userQuery = input
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: userQuery,
    }

    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Simulate Natural AI Typing Speed
    setTimeout(() => {
      const aiReplyText = generateSmartAIResponse(userQuery, userName)
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'ai',
        text: aiReplyText,
      }
      setMessages((prev) => [...prev, aiReply])
      setLoading(false)
    }, 600)
  }

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-card border-l border-border h-full flex flex-col shadow-2xl">
        
        {/* Drawer Header */}
        <div className="p-4 border-b border-border flex items-center justify-between bg-accent/20">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-primary text-primary-foreground shadow-md">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-sm text-foreground">Ask Rose</h3>
              <p className="text-[11px] text-muted-foreground">Personal AI Companion</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-accent text-muted-foreground hover:text-foreground transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Messages Body */}
        <div className="flex-1 p-4 overflow-y-auto space-y-4">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 text-xs font-bold shadow-sm ${
                  msg.sender === 'user'
                    ? 'bg-accent text-foreground border border-border'
                    : 'bg-primary text-primary-foreground'
                }`}
              >
                {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
              </div>

              <div
                className={`max-w-[80%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-primary text-primary-foreground shadow-sm rounded-tr-none'
                    : 'bg-accent/60 text-foreground border border-border rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground p-2">
              <Loader2 className="w-4 h-4 animate-spin text-primary" />
              <span>Rose is thinking...</span>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-border flex items-center gap-2 bg-card">
          <input
            type="text"
            placeholder="Ask Rose anything..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-background border border-border rounded-2xl px-4 py-2.5 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            disabled={loading}
            className="p-2.5 rounded-2xl bg-primary text-primary-foreground hover:opacity-90 transition shadow-md shadow-primary/20 shrink-0 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
          </button>
        </form>

      </div>
    </div>
  )
}