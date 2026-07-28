"use client"

import { useState, useEffect } from "react"
import { Plus, Target, Edit2, Trash2, X } from "lucide-react"

interface Vision {
  id: string
  title: string
  description: string
  targetDate: string
  progress: number
}

export function GoalsRoadmap() {
  const [visions, setVisions] = useState<Vision[]>([
    {
      id: "1",
      title: "Launch my own project / portfolio",
      description: "Build a strong portfolio and complete degree projects.",
      targetDate: "Q4 2026",
      progress: 60,
    },
  ])

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  const [newTitle, setNewTitle] = useState("")
  const [newDesc, setNewDesc] = useState("")
  const [newDate, setNewDate] = useState("")
  const [newProgress, setNewProgress] = useState(0)

  // Load saved visions
  useEffect(() => {
    const saved = localStorage.getItem("lifeos_future_visions")
    if (saved) {
      try { setVisions(JSON.parse(saved)) } catch (e) {}
    }
  }, [])

  // Save visions
  const saveVisions = (updated: Vision[]) => {
    setVisions(updated)
    localStorage.setItem("lifeos_future_visions", JSON.stringify(updated))
  }

  // Update progress directly via slider
  const handleProgressChange = (id: string, newProg: number) => {
    const updated = visions.map(v => v.id === id ? { ...v, progress: newProg } : v)
    saveVisions(updated)
  }

  const handleOpenModal = (vision?: Vision) => {
    if (vision) {
      setEditingId(vision.id)
      setNewTitle(vision.title)
      setNewDesc(vision.description)
      setNewDate(vision.targetDate)
      setNewProgress(vision.progress)
    } else {
      setEditingId(null)
      setNewTitle("")
      setNewDesc("")
      setNewDate("")
      setNewProgress(0)
    }
    setIsModalOpen(true)
  }

  const handleDelete = (id: string) => {
    const updated = visions.filter(v => v.id !== id)
    saveVisions(updated)
  }

  const handleSaveVision = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim()) return

    if (editingId) {
      // Edit existing
      const updated = visions.map(v => v.id === editingId ? {
        ...v,
        title: newTitle,
        description: newDesc,
        targetDate: newDate,
        progress: newProgress
      } : v)
      saveVisions(updated)
    } else {
      // Add new
      const newItem: Vision = {
        id: Date.now().toString(),
        title: newTitle,
        description: newDesc,
        targetDate: newDate || "2026",
        progress: Number(newProgress) || 0,
      }
      saveVisions([...visions, newItem])
    }

    setIsModalOpen(false)
  }

  return (
    <div className="rounded-2xl border border-rose-950/50 bg-zinc-950/80 p-7 shadow-2xl backdrop-blur-md">
      {/* Header with Icon, Title, and Add Button */}
      <div className="flex items-center justify-between mb-7">
        <div className="flex items-center gap-4">
          <div className="rounded-xl bg-rose-500/15 p-2.5 text-rose-400 border border-rose-500/25">
            <Target className="h-6 w-6" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-zinc-100">Future vision</h3>
            <p className="text-xs text-zinc-400">Long-term targets you're working toward</p>
          </div>
        </div>

        {/* Pink Glow Button */}
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center gap-2 rounded-xl bg-rose-600 px-4 py-2.5 text-xs font-semibold text-white hover:bg-rose-500 transition-all shadow-lg shadow-rose-950/40"
        >
          <Plus className="h-4 w-4" /> Add Vision
        </button>
      </div>

      {/* Visions List */}
      <div className="space-y-5">
        {visions.map((item) => (
          <div key={item.id} className="group relative rounded-xl border border-zinc-800/80 bg-zinc-900/50 p-5 transition hover:border-rose-900/50 hover:bg-zinc-900">
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="flex-1">
                <h4 className="font-semibold text-zinc-200 text-sm tracking-tight">{item.title}</h4>
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed">{item.description}</p>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="rounded-md bg-zinc-800 px-3 py-1 text-[11px] text-zinc-400 font-mono border border-zinc-700/60">
                  {item.targetDate}
                </span>
                <button onClick={() => handleOpenModal(item)} className="text-zinc-500 hover:text-rose-400 p-1.5 transition">
                  <Edit2 className="h-4 w-4" />
                </button>
                <button onClick={() => handleDelete(item.id)} className="text-zinc-500 hover:text-red-400 p-1.5 transition">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Dynamic Interactive Progress Slider with Pink Aesthetic */}
            <div className="mt-5 flex items-center gap-4">
              <input
                type="range"
                min="0"
                max="100"
                value={item.progress}
                onChange={(e) => handleProgressChange(item.id, Number(e.target.value))}
                className="h-2 flex-1 cursor-pointer appearance-none rounded-full bg-zinc-800/60 accent-rose-500 transition-all"
              />
              <span className="text-xs font-mono font-bold text-rose-400 min-w-[36px] text-right">
                {item.progress}%
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal - Floating on top */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-6 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-2xl border border-zinc-800 bg-zinc-950 p-7 shadow-2xl shadow-rose-950/20">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-extrabold text-zinc-100 tracking-tight">
                {editingId ? "Edit Vision Goal" : "Add New Vision Goal"}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-zinc-400 hover:text-rose-400">
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSaveVision} className="space-y-5">
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Goal Title</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3.5 text-sm text-zinc-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 focus:outline-none"
                  placeholder="e.g. Master BA Fundamentals & SQL"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Description</label>
                <input
                  type="text"
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3.5 text-sm text-zinc-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 focus:outline-none"
                  placeholder="Short summary of this target..."
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Target Date</label>
                  <input
                    type="text"
                    value={newDate}
                    onChange={(e) => setNewDate(e.target.value)}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3.5 text-sm text-zinc-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 focus:outline-none"
                    placeholder="e.g. Q4 2026"
                  />
                </div>
                <div>
                  <label className="text-xs text-zinc-400 block mb-1.5 font-medium">Progress %</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={newProgress}
                    onChange={(e) => setNewProgress(Number(e.target.value))}
                    className="w-full rounded-lg border border-zinc-800 bg-zinc-900 p-3.5 text-sm text-zinc-200 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="rounded-lg border border-zinc-800 px-5 py-2.5 text-xs text-zinc-400 font-medium hover:bg-zinc-900 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-lg bg-rose-600 px-5 py-2.5 text-xs text-white font-semibold hover:bg-rose-500 transition shadow-md shadow-rose-950/30"
                >
                  {editingId ? "Update Goal" : "Save Vision"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}