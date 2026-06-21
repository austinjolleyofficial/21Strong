'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function JoinPage() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  const handleSubmit = async (
    e: React.FormEvent
  ) => {
    e.preventDefault()

    setMessage('')

    if (isLogin) {
      const { error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        })

      if (error) {
        setMessage(error.message)
        return
      }

      window.location.href = '/feed'
      return
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      setMessage(error.message)
      return
    }

    if (user) {
      await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          name,
        })
    }

    setMessage(
      'Account created successfully. You can now log in.'
    )

    setIsLogin(true)
    setPassword('')
  }

  return (
    <main className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="w-full max-w-md p-8">
        <h1 className="text-4xl font-bold text-purple-500 mb-6">
          21 Strong
        </h1>

        <h2 className="text-xl mb-6">
          {isLogin
            ? 'Login'
            : 'Create Account'}
        </h2>

        <form
          onSubmit={handleSubmit}
          className="space-y-4"
        >
          {!isLogin && (
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
          )}

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

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full p-3 rounded bg-gray-900 border border-gray-700"
            required
          />

          <button
            type="submit"
            className="w-full bg-purple-600 p-3 rounded"
          >
            {isLogin
              ? 'Login'
              : 'Create Account'}
          </button>
        </form>

        <button
          type="button"
          onClick={() =>
            setIsLogin(!isLogin)
          }
          className="mt-4 text-purple-400 underline"
        >
          {isLogin
            ? 'Need an account? Create one'
            : 'Already have an account? Login'}
        </button>

        {message && (
          <p className="mt-4 text-center">
            {message}
          </p>
        )}
      </div>
    </main>
  )
}