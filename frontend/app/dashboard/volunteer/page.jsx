'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import toast, { Toaster } from 'react-hot-toast'

const statusColors = {
  pending: 'bg-blue-50 text-blue-600',
  confirmed: 'bg-yellow-50 text-yellow-600',
  completed: 'bg-green-50 text-green-600',
  cancelled: 'bg-red-50 text-red-600',
}

export default function VolunteerDashboard() {
  const router = useRouter()
  const { user, logout, initAuth } = useAuthStore()
  const [pickups, setPickups] = useState([])
  const [available, setAvailable] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('available')
  const [completing, setCompleting] = useState({})

  useEffect(() => {
    initAuth()
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const pendingRes = await api.get('/pickups/pending')
      setAvailable(pendingRes.data.pickups || [])

      const pickupsRes = await api.get('/pickups/volunteer/my')
      setPickups(pickupsRes.data.pickups || [])
    } catch (err) {
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleAssign = async (pickupId) => {
    try {
      await api.patch(`/pickups/${pickupId}/assign`)
      toast.success('You are assigned to this pickup!')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to assign')
    }
  }

  const handleComplete = async (pickupId) => {
    setCompleting(prev => ({ ...prev, [pickupId]: true }))
    try {
      await api.patch(`/pickups/${pickupId}/complete`)
      toast.success('Pickup completed! 🎉')
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to complete')
    } finally {
      setCompleting(prev => ({ ...prev, [pickupId]: false }))
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
            🤝 {user?.name || 'Volunteer'}
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
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-[#1a1a1a]">
            Volunteer Dashboard
          </h2>
          <p className="text-[#6b6b6b] text-sm mt-1">
            Help deliver donations to those in need
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-8">
          <div className="bg-white rounded-2xl border border-[#ebe8e2] p-5">
            <p className="text-3xl font-bold text-[#E86C3A]">
              {pickups.filter(p => p.status === 'completed').length}
            </p>
            <p className="text-sm text-[#6b6b6b] mt-1">Completed pickups</p>
          </div>
          <div className="bg-white rounded-2xl border border-[#ebe8e2] p-5">
            <p className="text-3xl font-bold text-[#1a1a1a]">
              {pickups.filter(p => p.status === 'confirmed').length}
            </p>
            <p className="text-sm text-[#6b6b6b] mt-1">Active pickups</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-6">
          {['available', 'my pickups'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                activeTab === tab
                  ? 'bg-[#E86C3A] text-white'
                  : 'bg-white text-[#6b6b6b] border border-[#ebe8e2] hover:border-[#E86C3A]'
              }`}
            >
              {tab === 'available'
                ? `Available (${available.length})`
                : `My Pickups (${pickups.length})`}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="text-center text-[#6b6b6b] py-12">Loading...</div>
        ) : activeTab === 'available' ? (
          available.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#ebe8e2]">
              <div className="text-4xl mb-3">🎉</div>
              <p className="text-[#6b6b6b]">No pickups available right now</p>
              <p className="text-sm text-[#aaa] mt-1">Check back soon!</p>
            </div>
          ) : (
            <div className="space-y-3">
              {available.map(pickup => (
                <div
                  key={pickup.id}
                  className="bg-white rounded-2xl border border-[#ebe8e2] p-5"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-1">
                        <h3 className="font-semibold text-[#1a1a1a]">
                          {pickup.item?.title}
                        </h3>
                        <span className="text-xs px-2 py-0.5 rounded-full bg-yellow-50 text-yellow-600 font-medium">
                          needs pickup
                        </span>
                      </div>
                      <p className="text-sm text-[#6b6b6b]">
                        {pickup.item?.description}
                      </p>
                      <p className="text-xs text-[#aaa] mt-2">
                        {pickup.item?.category} • {pickup.ngo?.location}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => handleAssign(pickup.id)}
                    className="mt-4 text-xs px-4 py-2 rounded-lg bg-[#E86C3A] text-white font-medium hover:bg-[#d45f2f] transition"
                  >
                    Assign to me
                  </button>
                </div>
              ))}
            </div>
          )
        ) : (
          pickups.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-[#ebe8e2]">
              <div className="text-4xl mb-3">📦</div>
              <p className="text-[#6b6b6b]">No pickups assigned yet</p>
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
                      <p className="text-sm text-[#6b6b6b] mt-1">
                        {pickup.notes}
                      </p>
                      <p className="text-xs text-[#aaa] mt-2">
                        Scheduled:{' '}
                        {pickup.scheduledTime
                          ? new Date(pickup.scheduledTime).toLocaleDateString()
                          : 'Not set'}
                      </p>
                    </div>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${statusColors[pickup.status]}`}>
                      {pickup.status}
                    </span>
                  </div>
                  {pickup.status === 'confirmed' && (
                    <button
                      onClick={() => handleComplete(pickup.id)}
                      disabled={completing[pickup.id]}
                      className="mt-4 text-xs px-4 py-2 rounded-lg bg-green-500 text-white font-medium hover:bg-green-600 transition disabled:opacity-50"
                    >
                      {completing[pickup.id] ? 'Completing...' : '✅ Mark as Delivered'}
                    </button>
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