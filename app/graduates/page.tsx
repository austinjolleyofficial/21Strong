'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function GraduatesPage() {
  const [graduates, setGraduates] = useState<any[]>([])

  useEffect(() => {
    loadGraduates()
  }, [])

  const loadGraduates = async () => {
    const { data } = await supabase
      .from('profiles')
      .select(`
        name,
        graduated_at
      `)
      .eq('graduated', true)
      .order('graduated_at', {
        ascending: false,
      })

    setGraduates(data || [])
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
          maxWidth: '900px',
          margin: '0 auto',
        }}
      >
        <h1
          style={{
            color: '#9333ea',
            fontSize: '64px',
            textAlign: 'center',
            marginBottom: '10px',
          }}
        >
          🏆 21 STRONG GRADUATES
        </h1>

        <p
          style={{
            textAlign: 'center',
            color: '#aaa',
            marginBottom: '50px',
          }}
        >
          Proof that discipline works.
        </p>

        {graduates.map((graduate, index) => (
          <div
            key={index}
            style={{
              background: '#111',
              border: '1px solid #333',
              borderRadius: '16px',
              padding: '24px',
              marginBottom: '20px',
            }}
          >
            <h2
              style={{
                color: '#fbbf24',
                marginBottom: '10px',
              }}
            >
              {graduate.name}
            </h2>

            <p
              style={{
                color: '#ccc',
              }}
            >
              Completed{' '}
              {new Date(
                graduate.graduated_at
              ).toLocaleDateString()}
            </p>
          </div>
        ))}
      </div>
    </main>
  )
}