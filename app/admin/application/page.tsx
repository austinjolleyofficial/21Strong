'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function ApplicationsPage() {
  const [applications, setApplications] =
    useState<any[]>([])

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    const { data } = await supabase
      .from('project365_applications')
      .select('*')
      .order('created_at', {
        ascending: false,
      })

    setApplications(data || [])
  }

  const pendingCount =
    applications.filter(
      (app) => app.status === 'pending'
    ).length

  return (
    <main
      style={{
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        padding: '40px',
      }}
    >
      <h1
        style={{
          color: '#9333ea',
          fontSize: '48px',
        }}
      >
        Project 365 Applications
      </h1>

      <div
        style={{
          background: '#111',
          padding: '20px',
          borderRadius: '12px',
          marginTop: '20px',
          marginBottom: '30px',
          border: '1px solid #333',
        }}
      >
        <h2
          style={{
            color: '#fbbf24',
          }}
        >
          Pending Applications:
          {' '}
          {pendingCount}
        </h2>
      </div>

      {applications.map((app) => (
        <div
          key={app.id}
          style={{
            background: '#111',
            border: '1px solid #333',
            borderRadius: '12px',
            padding: '20px',
            marginBottom: '20px',
          }}
        >
          <h2
            style={{
              color: '#9333ea',
            }}
          >
            {app.full_name}
          </h2>

          <p>
            <strong>Email:</strong>{' '}
            {app.email}
          </p>

          <p>
            <strong>Phone:</strong>{' '}
            {app.phone}
          </p>

          <p>
            <strong>Focus Area:</strong>{' '}
            {app.focus_area}
          </p>

          <p>
            <strong>Status:</strong>{' '}
            {app.status}
          </p>

          <p>
            <strong>Reason:</strong>
          </p>

          <p
            style={{
              color: '#ccc',
            }}
          >
            {app.reason}
          </p>

          <p>
            <strong>Notes:</strong>{' '}
            {app.notes}
          </p>
        </div>
      ))}
    </main>
  )
}