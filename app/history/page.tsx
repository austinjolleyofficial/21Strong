'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function History() {
  const [commitments, setCommitments] =
    useState<any[]>([])

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

   const { data } = await supabase
  .from('commitments')
  .select(`
    *,
    proofs (
      proof_url
    )
  `)
  .eq('user_id', user.id)
  .order('day_number', {
    ascending: true,
  })

    setCommitments(data || [])
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
      <div style={{ marginBottom: '20px' }}>
        <a
          href="/dashboard"
          style={{
            color: '#9333ea',
            marginRight: '20px',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          Dashboard
        </a>

        <a
          href="/history"
          style={{
            color: '#9333ea',
            textDecoration: 'none',
            fontWeight: 'bold',
          }}
        >
          History
        </a>
      </div>

      <h1
        style={{
          color: '#9333ea',
          fontSize: '48px',
          marginBottom: '30px',
        }}
      >
        21 Strong History
      </h1>

<div
  style={{
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '20px',
  }}
>
  {commitments.map((item) => (
<div
  key={item.id}
  style={{
    background: item.completed
      ? '#14532d'
      : '#111',

    padding: '16px',
    marginBottom: '12px',
    borderRadius: '10px',

    border: item.completed
      ? '1px solid #22c55e'
      : '1px solid #333',
  }}
>
      <h2>Day {item.day_number}</h2>

      <p>{item.commitment}</p>
{item.proofs?.[0]?.proof_url && (
  <img
    src={item.proofs[0].proof_url}
    alt="Proof"
    style={{
      width: '100%',
      maxWidth: '250px',
      borderRadius: '10px',
      marginTop: '10px',
      marginBottom: '10px',
    }}
  />
)}
 <p
  style={{
    color: item.completed
      ? '#4ade80'
      : '#facc15',
    fontWeight: 'bold',
  }}
>
  {item.completed
    ? '✅ Completed'
    : '⏳ In Progress'}
</p>
    </div>
  ))}
</div>
    </main>
  )
}