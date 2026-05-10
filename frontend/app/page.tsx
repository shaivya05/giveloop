'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

const steps = [
  {
    icon: '📦',
    title: 'List your item',
    desc: 'Describe what you want to donate. Our AI instantly categorizes it and finds the best match.',
    color: 'bg-orange-50'
  },
  {
    icon: '🤝',
    title: 'NGO accepts',
    desc: 'A verified NGO in your city reviews and accepts your donation within 24 hours.',
    color: 'bg-blue-50'
  },
  {
    icon: '🚗',
    title: 'Volunteer collects',
    desc: 'A volunteer picks up from your doorstep. No trips, no hassle, no cost.',
    color: 'bg-green-50'
  },
  {
    icon: '💚',
    title: 'See your impact',
    desc: 'Get a personal impact report showing exactly who received your donation.',
    color: 'bg-purple-50'
  },
]

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <div className="min-h-screen bg-[#FAFAF8] text-[#1a1a1a]">

      {/* Navbar */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-white shadow-sm border-b border-[#ebe8e2]' : 'bg-transparent'
      }`}>
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight">
            Give<span className="text-[#E86C3A]">Loop</span>
          </h1>
          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="text-sm font-medium text-[#3a3a3a] hover:text-[#E86C3A] transition"
            >
              Sign in
            </Link>
            <Link
              href="/register"
              className="text-sm font-semibold bg-[#E86C3A] hover:bg-[#d45f2f] text-white px-4 py-2 rounded-xl transition"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-100 text-[#E86C3A] text-xs font-semibold px-4 py-2 rounded-full mb-8">
            ✨ AI-powered donation matching
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-[#1a1a1a] leading-tight mb-6">
            Your unused items
            <br />
            <span className="text-[#E86C3A]">change lives.</span>
          </h1>
          <p className="text-xl text-[#6b6b6b] max-w-2xl mx-auto mb-10 leading-relaxed">
            GiveLoop connects donors with verified NGOs using AI matching.
            List an item, we handle the rest — pickup, delivery, and impact tracking.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/register"
              className="bg-[#E86C3A] hover:bg-[#d45f2f] text-white font-semibold px-8 py-3.5 rounded-xl transition text-base"
            >
              Start donating free →
            </Link>
            <Link
              href="/register"
              className="bg-white border border-[#ddd8d0] hover:border-[#E86C3A] text-[#3a3a3a] font-semibold px-8 py-3.5 rounded-xl transition text-base"
            >
              Register your NGO
            </Link>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="py-20 px-6 bg-white border-y border-[#ebe8e2]">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-[#1a1a1a]">
              How GiveLoop works
            </h2>
            <p className="text-[#6b6b6b] mt-3 text-lg">
              From your doorstep to someone in need — in 4 simple steps
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {steps.map((step, i) => (
              <div
                key={i}
                className={`${step.color} rounded-2xl p-7 border border-[#ebe8e2]`}
              >
                <div className="text-3xl mb-4">{step.icon}</div>
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-xs font-bold text-[#E86C3A] bg-white px-2 py-0.5 rounded-full border border-orange-100">
                    Step {i + 1}
                  </span>
                  <h3 className="font-semibold text-[#1a1a1a] text-lg">
                    {step.title}
                  </h3>
                </div>
                <p className="text-[#6b6b6b] text-sm leading-relaxed">
                  {step.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Feature highlight */}
      <section className="py-20 px-6 bg-[#1a1a1a]">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-orange-900/30 border border-orange-800/30 text-orange-400 text-xs font-semibold px-4 py-2 rounded-full mb-8">
            ✨ Powered by AI
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Smart matching that
            <span className="text-[#E86C3A]"> actually works</span>
          </h2>
          <p className="text-[#999] text-lg max-w-2xl mx-auto mb-12 leading-relaxed">
            Our AI analyzes your donation and matches it to the most suitable
            NGO based on category, location, and need — instantly.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-left">
            {[
              { icon: '🎯', title: 'Auto categorization', desc: 'Describe your item in plain words — AI picks the right category automatically' },
              { icon: '📍', title: 'Location matching', desc: 'Matched to NGOs in your city that specifically need what you\'re donating' },
              { icon: '💌', title: 'Impact reports', desc: 'AI writes a personal message after delivery showing your donation\'s real impact' },
            ].map((feature, i) => (
              <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
                <div className="text-2xl mb-3">{feature.icon}</div>
                <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
                <p className="text-[#999] text-sm leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-6 bg-[#E86C3A]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to make a difference?
          </h2>
          <p className="text-orange-100 text-lg mb-10">
            Join donors, NGOs, and volunteers already on GiveLoop.
          </p>
          <Link
            href="/register"
            className="bg-white text-[#E86C3A] font-bold px-8 py-3.5 rounded-xl hover:bg-orange-50 transition text-base inline-block"
          >
            Get started for free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 border-t border-[#ebe8e2]">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-xl font-bold">
            Give<span className="text-[#E86C3A]">Loop</span>
          </h1>
          <p className="text-sm text-[#6b6b6b]">
            Built with ❤️ for a better India
          </p>
        </div>
      </footer>

    </div>
  )
}