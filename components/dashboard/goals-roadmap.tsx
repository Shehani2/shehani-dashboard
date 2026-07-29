'use client'

import { useState, useEffect } from 'react'
import { Target, Plus, Pencil, Trash2 } from 'lucide-react'

interface Goal {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
}

export function GoalsRoadmap() {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: '1',
      title: 'Launch my own project / portfolio',
      description: 'Build a strong portfolio and complete degree projects.',
      targetDate: 'Q4 2026',
      progress: 84,
    },
    {
      id: '2',
      title: 'Complete degree',
      description: 'BSc Honors in Information Systems',
      targetDate: '2028',
      progress: 21,
    },
  ])

  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newTarget, setNewTarget] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  useEffect(() => {
    const savedGoals = localStorage.getItem('lifeos_goals')
    if (savedGoals) {
      try {
        setGoals(JSON.parse(savedGoals))
      } catch (e) {
        console.error('Failed to parse goals', e)
      }
    }
  }, [])

  const saveGoals = (updated: Goal[]) => {
    setGoals(updated)
    localStorage.setItem('lifeos_goals', JSON.stringify(updated))
  }

  const handleProgressChange = (id: string, newProgress: number) => {
    const updated = goals.map((g) => (g.id === id ? { ...g, progress: newProgress } : g))
    saveGoals(updated)
  }

  const handleAddGoal = () => {
    if (!newTitle.trim()) return
    const newGoalItem: Goal = {
      id: Date.now().toString(),
      title: newTitle,
      description: newDesc,
      targetDate: newTarget || '2026',
      progress: 0,
    }
    saveGoals([...goals, newGoalItem])
    setNewTitle('')
    setNewDesc('')
    setNewTarget('')
    setShowAddModal(false)
  }

  const handleDeleteGoal = (id: string) => {
    const updated = goals.filter((g) => g.id !== id)
    saveGoals(updated)
  }

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-xl backdrop-blur-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-primary/10 p-2 text-primary border border-primary/20">
            <Target className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="font-bold text-foreground">Future vision</h3>
            <p className="text-xs text-muted-foreground">Long-term targets you're working toward</p>
          </div>
        </div>
        <button
          onClick={() => setShowAddModal(!showAddModal)}
          className="flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-semibold text-primary-foreground hover:opacity-90 transition shadow-md shadow-primary/20"
        >
          <Plus className="h-4 w-4" /> Add Vision
        </button>
      </div>

      {/* Add Form Collapse */}
      {showAddModal && (
        <div className="mb-6 p-4 rounded-xl border border-border bg-accent/20 flex flex-col gap-3">
          <input
            type="text"
            placeholder="Target Title..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Short description..."
            value={newDesc}
            onChange={(e) => setNewDesc(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Target Date (e.g. Q4 2026)"
              value={newTarget}
              onChange={(e) => setNewTarget(e.target.value)}
              className="flex-1 rounded-xl border border-border bg-background px-3.5 py-2 text-xs text-foreground focus:outline-none focus:ring-1 focus:ring-primary"
            />
            <button
              onClick={handleAddGoal}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-xl text-xs font-semibold hover:opacity-90 transition"
            >
              Save Target
            </button>
          </div>
        </div>
      )}

      {/* Vision Goals List */}
      <div className="space-y-4">
        {goals.map((goal) => (
          <div
            key={goal.id}
            className="rounded-xl border border-border bg-background/60 p-4 transition-all hover:border-primary/30"
          >
            <div className="flex items-start justify-between mb-2">
              <div>
                <h4 className="text-sm font-bold text-foreground">{goal.title}</h4>
                {goal.description && <p className="text-xs text-muted-foreground mt-0.5">{goal.description}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded bg-accent border border-border px-2 py-0.5 text-[10px] font-mono text-muted-foreground">
                  {goal.targetDate}
                </span>
                <button
                  onClick={() => handleDeleteGoal(goal.id)}
                  className="text-muted-foreground hover:text-destructive p-1 transition"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>

            {/* Dynamic Slider Bar */}
            <div className="mt-4 flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={goal.progress}
                onChange={(e) => handleProgressChange(goal.id, Number(e.target.value))}
                className="w-full h-2 rounded-lg cursor-pointer bg-accent accent-primary"
              />
              <span className="text-xs font-mono font-bold text-primary shrink-0 min-w-[32px] text-right">
                {goal.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}