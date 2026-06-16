'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function JoinPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()

    localStorage.setItem('user_name', name)

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo:
          'https://21-strong.vercel.app/dashboard',
      },
    })

    if (error) {
      setMessage(error.message)
      console.error(error)
    } else {
      setMessage(
        'Check your email and tap the link to sign in.'
      )
    }
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-4xl font-bold text-purple-500 mb-6">
          Join 21 Strong
        </h1>

        <form
          onSubmit={handleLogin}
          className="space-y-4"
        >
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 p-3 rounded"
          >
            Send Login Link
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}
      </div>
    </main>
  )
}