'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import api from '@/lib/api'
import useAuthStore from '@/store/authStore'
import toast, { Toaster } from 'react-hot-toast'

export default function LoginPage() {
  const router = useRouter()
  const { setAuth } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({ email: '', password: '' })

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await api.post('/auth/login', form)
      setAuth(res.data.user, res.data.token)
      toast.success('Welcome back!')

      // Redirect based on role
      const role = res.data.user.role
      if (role === 'donor') router.push('/dashboard/donor')
      else if (role === 'ngo') router.push('/dashboard/ngo')
      else if (role === 'volunteer') router.push('/dashboard/volunteer')

    } catch (err) {
      toast.error(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="w-full max-w-md">
      <Toaster position="top-center" />
      
      {/* Logo */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold text-[#1a1a1a] tracking-tight">
          Give<span className="text-[#E86C3A]">Loop</span>
        </h1>
        <p className="text-[#6b6b6b] mt-2 text-sm">
          Connecting donors to those who need it most
        </p>
      </div>

      {/* Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-[#ebe8e2] p-8">
        <h2 className="text-xl font-semibold text-[#1a1a1a] mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#E86C3A] hover:bg-[#d45f2f] text-white font-semibold py-2.5 rounded-xl transition duration-200 mt-2 disabled:opacity-60"
          >
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      {/* Footer */}
      <p className="text-center text-sm text-[#6b6b6b] mt-6">
        Don't have an account?{' '}
        <Link href="/register" className="text-[#E86C3A] font-medium hover:underline">
          Create one
        </Link>
      </p>
    </div>
  )
}