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

export default function NGODashboard() {
  const router = useRouter()
  const { user, logout, initAuth } = useAuthStore()
  const [items, setItems] = useState([])
  const [pickups, setPickups] = useState([])
  const [hasProfile, setHasProfile] = useState(false)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('available')
  const [aiMatching, setAiMatching] = useState({})
  const [profileForm, setProfileForm] = useState({
    orgName: '',
    description: '',
    location: '',
    acceptedCategories: []
  })

  useEffect(() => {
    initAuth()
    checkProfile()
  }, [])

  const checkProfile = async () => {
    try {
      await api.get('/ngos/profile')
      setHasProfile(true)
      fetchData()
    } catch (err) {
      setHasProfile(false)
      setLoading(false)
    }
  }

  const fetchData = async () => {
    try {
      const [itemsRes, pickupsRes] = await Promise.all([
        api.get('/items'),
        api.get('/pickups/my')
      ])
      setItems(itemsRes.data.items)
      setPickups(pickupsRes.data.pickups)
    } catch (err) {
      toast.error('Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    try {
      await api.post('/ngos/profile', profileForm)
      toast.success('Profile created!')
      setHasProfile(true)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create profile')
    }
  }

  const toggleCategory = (cat) => {
    const current = profileForm.acceptedCategories
    if (current.includes(cat)) {
      setProfileForm({ ...profileForm, acceptedCategories: current.filter(c => c !== cat) })
    } else {
      setProfileForm({ ...profileForm, acceptedCategories: [...current, cat] })
    }
  }

  const handleAiMatch = async (itemId) => {
    setAiMatching(prev => ({ ...prev, [itemId]: true }))
    try {
      const res = await api.get(`/items/ai/match/${itemId}`)
      toast.success(`Best match: ${res.data.match.reason}`)
    } catch (err) {
      toast.error('AI matching failed')
    } finally {
      setAiMatching(prev => ({ ...prev, [itemId]: false }))
    }
  }

  const handleAccept = async (itemId) => {
    try {
      await api.post('/pickups', {
        itemId,
        scheduledTime: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        notes: 'Will coordinate pickup with donor'
      })
      toast.success('Donation accepted!')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to accept')
    }
  }

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  // Profile setup screen
  if (!hasProfile && !loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex items-center justify-center p-4">
        <Toaster position="top-center" />
        <div className="w-full max-w-md bg-white rounded-2xl border border-[#ebe8e2] p-8">
          <h2 className="text-xl font-bold text-[#1a1a1a] mb-2">
            Set up your NGO profile
          </h2>
          <p className="text-sm text-[#6b6b6b] mb-6">
            Tell donors about your organization
          </p>
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <input
              type="text"
              placeholder="Organization name"
              value={profileForm.orgName}
              onChange={e => setProfileForm({ ...profileForm, orgName: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition"
            />
            <input
              type="text"
              placeholder="Location (e.g. Pune, Maharashtra)"
              value={profileForm.location}
              onChange={e => setProfileForm({ ...profileForm, location: e.target.value })}
              required
              className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition"
            />
            <textarea
              placeholder="Describe your organization"
              value={profileForm.description}
              onChange={e => setProfileForm({ ...profileForm, description: e.target.value })}
              rows={3}
              className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition resize-none"
            />
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-2">
                We accept
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3 py-1.5 rounded-lg text-sm font-medium transition ${
                      profileForm.acceptedCategories.includes(cat)
                        ? 'bg-[#E86C3A] text-white'
                        : 'bg-[#f0ede8] text-[#6b6b6b] hover:bg-[#e8e4de]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-[#E86C3A] hover:bg-[#d45f2f] text-white font-semibold py-2.5 rounded-xl transition"
            >
              Save Profile
            </button>
          </form>
        </div>
      </div>
    )
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
          <span className="text-sm text-[#6b6b6b]">🏢 {user?.name || 'NGO'}</span>
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">NGO Dashboard</h2>
          <p className="text-[#6b6b6b] text-sm mt-1">
            Browse and accept incoming donations
          </p>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['available', 'accepted'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-[#E86C3A] text-white'
                  : 'bg-white text-[#6b6b6b] border border-[#ebe8e2] hover:border-[#E86C3A]'
              }`}
            >
              {tab === 'available' ? `Available (${items.length})` : `Accepted (${pickups.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-[#6b6b6b] py-12">Loading...</div>
        ) : activeTab === 'available' ? (
          items.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#ebe8e2]">
              <div className="text-4xl mb-3">🎁</div>
              <p className="text-[#6b6b6b]">No donations available right now</p>
            </div>
          ) : (
            <div className="space-y-3">
              {items.map(item => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-[#ebe8e2] p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-[#1a1a1a]">{item.title}</h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-600 font-medium">
                          {item.category}
                        </span>
                      </div>
                      <p className="text-sm text-[#6b6b6b]">{item.description}</p>
                      <p className="text-xs text-[#aaa] mt-2">
                        From {item.donor?.name} • {item.donor?.city}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button
                      onClick={() => handleAiMatch(item.id)}
                      disabled={aiMatching[item.id]}
                      className="text-xs px-3 py-1.5 rounded-lg border border-[#E86C3A] text-[#E86C3A] font-medium hover:bg-[#fff5f0] transition disabled:opacity-50"
                    >
                      {aiMatching[item.id] ? 'Matching...' : '✨ AI Match'}
                    </button>
                    <button
                      onClick={() => handleAccept(item.id)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-[#E86C3A] text-white font-medium hover:bg-[#d45f2f] transition"
                    >
                      Accept Donation
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          pickups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#ebe8e2]">
              <div className="text-4xl mb-3">📋</div>
              <p className="text-[#6b6b6b]">No accepted donations yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pickups.map(pickup => (
                <div
                  key={pickup.id}
                  className="bg-white rounded-2xl border border-[#ebe8e2] p-5"
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-semibold text-[#1a1a1a]">
                        {pickup.item?.title}
                      </h3>
                      <p className="text-sm text-[#6b6b6b] mt-1">{pickup.notes}</p>
                      <p className="text-xs text-[#aaa] mt-2">
                        Scheduled: {pickup.scheduledTime
                          ? new Date(pickup.scheduledTime).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[pickup.status] || 'bg-gray-50 text-gray-600'}`}>
                      {pickup.status}
                    </span>
                  </div>
                  {pickup.volunteer && (
                    <p className="text-xs text-green-600 mt-2">
                      ✅ Volunteer: {pickup.volunteer.name}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  )
}