'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import toast, { Toaster } from 'react-hot-toast'

const categories = ['clothes', 'books', 'food', 'electronics', 'furniture', 'other']

const statusColors = {
  listed: 'bg-blue-50 text-blue-600',
  matched: 'bg-yellow-50 text-yellow-600',
  pickup_scheduled: 'bg-purple-50 text-purple-600',
  delivered: 'bg-green-50 text-green-600',
}

export default function DonorDashboard() {
  const router = useRouter()
  const { user, logout, initAuth } = useAuthStore()
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [aiLoading, setAiLoading] = useState(false)
  const [form, setForm] = useState({
    title: '',
    description: '',
    category: ''
  })

  useEffect(() => {
    initAuth()
    fetchMyItems()
  }, [])

  const fetchMyItems = async () => {
    try {
      const res = await api.get('/items/my')
      setItems(res.data.items)
    } catch (err) {
      toast.error('Failed to load items')
    } finally {
      setLoading(false)
    }
  }

  const handleAiCategorize = async () => {
    if (!form.title || !form.description) {
      toast.error('Enter title and description first')
      return
    }
    setAiLoading(true)
    try {
      const res = await api.post('/items/ai/categorize', {
        title: form.title,
        description: form.description
      })
      setForm({ ...form, category: res.data.result.category })
      toast.success(`AI suggested: ${res.data.result.category}`)
    } catch (err) {
      toast.error('AI categorization failed')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/items', form)
      toast.success('Item listed successfully!')
      setForm({ title: '', description: '', category: '' })
      setShowForm(false)
      fetchMyItems()
    } catch (err) {
      toast.error('Failed to list item')
    }
  }

  const handleDelete = async (id) => {
    try {
      await api.delete(`/items/${id}`)
      toast.success('Item removed')
      fetchMyItems()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Cannot delete item')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0]">
      <Toaster position="top-center" />

      {/* Navbar */}
      <nav className="bg-white border-b border-[#ebe8e2] px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-[#1a1a1a] tracking-tight">
          Give<span className="text-[#E86C3A]">Loop</span>
        </h1>
        <div className="flex items-center gap-4">
          <span className="text-sm text-[#6b6b6b]">
            👋 {user?.name || 'Donor'}
          </span>
          <button
            onClick={handleLogout}
            className="text-sm text-[#E86C3A] hover:underline font-medium"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-[#1a1a1a]">My Donations</h2>
            <p className="text-[#6b6b6b] text-sm mt-1">
              Track everything you've donated
            </p>
          </div>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-[#E86C3A] hover:bg-[#d45f2f] text-white font-semibold px-5 py-2.5 rounded-xl transition"
          >
            {showForm ? 'Cancel' : '+ Donate Item'}
          </button>
        </div>

        {/* Donate Form */}
        {showForm && (
          <div className="bg-white rounded-2xl border border-[#ebe8e2] p-6 mb-6">
            <h3 className="text-lg font-semibold text-[#1a1a1a] mb-4">
              List a new item
            </h3>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Item title
                </label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  required
                  placeholder="e.g. Winter Jacket"
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                  Description
                </label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  required
                  rows={3}
                  placeholder="Describe the item, its condition, size etc."
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition resize-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-sm font-medium text-[#3a3a3a]">
                    Category
                  </label>
                  <button
                    type="button"
                    onClick={handleAiCategorize}
                    disabled={aiLoading}
                    className="text-xs text-[#E86C3A] font-medium hover:underline disabled:opacity-50"
                  >
                    {aiLoading ? 'AI thinking...' : '✨ Auto-detect with AI'}
                  </button>
                </div>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition"
                >
                  <option value="">Select a category</option>
                  {categories.map(c => (
                    <option key={c} value={c}>
                      {c.charAt(0).toUpperCase() + c.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <button
                type="submit"
                className="w-full bg-[#E86C3A] hover:bg-[#d45f2f] text-white font-semibold py-2.5 rounded-xl transition"
              >
                List Item
              </button>
            </form>
          </div>
        )}

        {/* Items List */}
        {loading ? (
          <div className="text-center text-[#6b6b6b] py-12">Loading...</div>
        ) : items.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-2xl border border-[#ebe8e2]">
            <div className="text-4xl mb-3">📦</div>
            <p className="text-[#6b6b6b]">No donations yet</p>
            <p className="text-sm text-[#aaa] mt-1">
              Click "Donate Item" to get started
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-[#ebe8e2] p-5 flex items-start justify-between"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="font-semibold text-[#1a1a1a]">{item.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[item.status]}`}>
                      {item.status.replace('_', ' ')}
                    </span>
                  </div>
                  <p className="text-sm text-[#6b6b6b]">{item.description}</p>
                  <p className="text-xs text-[#aaa] mt-2">
                    {item.category} • {new Date(item.createdAt).toLocaleDateString()}
                  </p>
                </div>
                {item.status === 'listed' && (
                  <button
                    onClick={() => handleDelete(item.id)}
                    className="text-sm text-red-400 hover:text-red-600 ml-4 transition"
                  >
                    Remove
                  </button>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}