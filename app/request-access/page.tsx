'use client'

import { useState } from 'react'
import { supabase } from '@/lib/supabase'
export default function RequestAccessPage() {
  const [submitted, setSubmitted] =
  useState(false)

const [fullName, setFullName] =
  useState('')

const [email, setEmail] =
  useState('')

const [focusArea, setFocusArea] =
  useState('')

const [reason, setReason] =
  useState('')

const [commitment, setCommitment] =
  useState('')

  if (submitted) {
    return (
      <main
        style={{
          background: '#000',
          color: '#fff',
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '40px',
        }}
      >
        <div
          style={{
            textAlign: 'center',
            maxWidth: '700px',
          }}
        >
          <h1
            style={{
              color: '#9333ea',
              fontSize: '56px',
            }}
          >
            Application Received
          </h1>

          <p
            style={{
              fontSize: '22px',
              color: '#ccc',
            }}
          >
            Thank you for applying to
            Project 365.
            <br />
            <br />
            We will review your application
            and contact you soon.
          </p>
        </div>
      </main>
    )
  }

  return (
    <main
      style={{
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '40px',
      }}
    >
      <div
        style={{
          maxWidth: '800px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            color: '#9333ea',
            fontSize: '56px',
            marginBottom: '10px',
          }}
        >
          PROJECT 365 APPLICATION
        </h1>

        <p
          style={{
            color: '#ccc',
            marginBottom: '40px',
          }}
        >
          Complete the application below.
        </p>

        <input
        
  value={fullName}
  onChange={(e) =>
    setFullName(e.target.value)
  }
  placeholder="Full Name"
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '20px',
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '10px',
          }}
        />

        <input
  value={email}
  onChange={(e) =>
    setEmail(e.target.value)
  }
  placeholder="Email Address"
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '20px',
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '10px',
          }}
        />

        <select
  value={focusArea}
  onChange={(e) =>
    setFocusArea(e.target.value)
  }
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '20px',
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '10px',
          }}
        >
          <option>
            What area needs the most work?
          </option>
          <option>Faith</option>
          <option>Health</option>
          <option>Marriage</option>
          <option>Family</option>
          <option>Business</option>
          <option>Finances</option>
          <option>Discipline</option>
          <option>Purpose</option>
          <option>Other</option>
        </select>

        <textarea
  value={reason}
  onChange={(e) =>
    setReason(e.target.value)
  }
          placeholder="Why do you want to join Project 365?"
          rows={8}
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '20px',
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '10px',
          }}
        />

        <select
  value={commitment}
  onChange={(e) =>
    setCommitment(e.target.value)
  }
          style={{
            width: '100%',
            padding: '15px',
            marginBottom: '30px',
            background: '#111',
            color: '#fff',
            border: '1px solid #333',
            borderRadius: '10px',
          }}
        >
          <option>
            Are you willing to commit to a
            full year?
          </option>
          <option>Yes</option>
          <option>No</option>
        </select>

        <button
       onClick={async () => {
  const { error } =
    await supabase
      .from(
        'project365_applications'
      )
      .insert({
        full_name: fullName,
        email,
        focus_area: focusArea,
        reason,
        commitment,
      })

  if (error) {
    alert(error.message)
    return
  }

  setSubmitted(true)
}}
          style={{
            background: '#9333ea',
            color: '#fff',
            border: 'none',
            padding: '16px 32px',
            borderRadius: '10px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          SUBMIT APPLICATION
        </button>
      </div>
    </main>
  )
}