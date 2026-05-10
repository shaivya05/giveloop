'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import toast, { Toaster } from 'react-hot-toast'

const roles = [
  { value: 'donor', label: '🎁 Donor', desc: 'I want to donate items' },
  { value: 'ngo', label: '🏢 NGO', desc: 'We collect and distribute' },
  { value: 'volunteer', label: '🤝 Volunteer', desc: 'I help with pickups' },
]

export default function RegisterPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    phone: '',
    city: ''
  })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.role) {
      toast.error('Please select a role')
      return
    }
    setLoading(true)
    try {
      const res = await api.post('/auth/register', form)
      setAuth(res.data.user, res.data.token)
      toast.success('Account created!')

      const role = res.data.user.role
      if (role === 'donor') router.push('/dashboard/donor')
      else if (role === 'ngo') router.push('/dashboard/ngo')
      else if (role === 'volunteer') router.push('/dashboard/volunteer')

    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Toaster position="top-center" />

      {/* Logo */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-[#1a1a1a] tracking-tight">
          Give<span className="text-[#E86C3A]">Loop</span>
        </h1>
        <p className="text-[#6b6b6b] mt-2 text-sm">
          Join thousands making a difference
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#ebe8e2] p-8">
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">
          Create your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Role selector */}
          <div>
            <label className="block text-sm font-medium text-[#3a3a3a] mb-2">
              I am a...
            </label>
            <div className="grid grid-cols-3 gap-2">
              {roles.map((r) => (
                <button
                  key={r.value}
                  type="button"
                  onClick={() => setForm({ ...form, role: r.value })}
                  className={`p-3 rounded-xl border text-center transition cursor-pointer ${
                    form.role === r.value
                      ? 'border-[#E86C3A] bg-[#fff5f0]'
                      : 'border-[#ddd8d0] bg-[#faf9f7] hover:border-[#E86C3A]'
                  }`}
                >
                  <div className="text-lg">{r.label.split(' ')[0]}</div>
                  <div className="text-xs font-medium text-[#1a1a1a] mt-0.5">
                    {r.label.split(' ')[1]}
                  </div>
                  <div className="text-[10px] text-[#888] mt-0.5">{r.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
              Full name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              required
              placeholder="Rahul Sharma"
              className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
              Email address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              required
              placeholder="you@example.com"
              className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              required
              placeholder="••••••••"
              className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition"
            />
          </div>

          {/* Phone + City */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                Phone
              </label>
              <input
                type="tel"
                name="phone"
                value={form.phone}
                onChange={handleChange}
                placeholder="9876543210"
                className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-[#3a3a3a] mb-1.5">
                City
              </label>
              <input
                type="text"
                name="city"
                value={form.city}
                onChange={handleChange}
                placeholder="Pune"
                className="w-full px-4 py-2.5 rounded-xl border border-[#ddd8d0] bg-[#faf9f7] text-[#1a1a1a] placeholder-[#aaa] focus:outline-none focus:ring-2 focus:ring-[#E86C3A] focus:border-transparent transition"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E86C3A] hover:bg-[#d45f2f] text-white font-semibold py-2.5 rounded-xl transition duration-200 mt-2 disabled:opacity-60"
          >
            {loading ? 'Creating account...' : 'Create account'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-[#6b6b6b] mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-[#E86C3A] font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}