'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Dashboard() {
  const [commitment, setCommitment] = useState('')
  const [locked, setLocked] = useState(false)
  const [completed, setCompleted] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [proofUrl, setProofUrl] = useState('')
  const [currentDay, setCurrentDay] = useState(1)
  const [completedDays, setCompletedDays] = useState(0)
  const [commitments, setCommitments] = useState<any[]>([])
  const [todayCommitmentId, setTodayCommitmentId] = useState<string | null>(null)
const [unreadNotifications, setUnreadNotifications] = useState(0)
  useEffect(() => {
    loadDashboard()
  }, [])

  const loadDashboard = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return
const { count } = await supabase
  .from('notifications')
  .select('*', {
    count: 'exact',
    head: true,
  })
  .eq('user_id', user.id)
  .eq('is_read', false)

setUnreadNotifications(count || 0)
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile) return

    const progress = profile.completed_days || 0
    const day = progress + 1

    setCompletedDays(progress)
    setCurrentDay(day)

    const { data: allCommitments } = await supabase
      .from('commitments')
      .select('*')
      .eq('user_id', user.id)

    setCommitments(allCommitments || [])

    const { data: todayCommitment } = await supabase
      .from('commitments')
      .select('*')
      .eq('user_id', user.id)
      .eq('day_number', day)
      .maybeSingle()

    if (todayCommitment) {
      setCommitment(todayCommitment.commitment)
      setLocked(true)
      setCompleted(todayCommitment.completed)
      setTodayCommitmentId(todayCommitment.id)

      const { data: proofData } = await supabase
        .from('proofs')
        .select('*')
        .eq('commitment_id', todayCommitment.id)
        .maybeSingle()

      if (proofData?.proof_url) {
        setProofUrl(proofData.proof_url)
      }
    }
  }

  const lockCommitment = async () => {
    if (!commitment.trim()) return

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      alert('Not logged in')
      return
    }

    const { data: existing } = await supabase
      .from('commitments')
      .select('*')
      .eq('user_id', user.id)
      .eq('day_number', currentDay)
      .maybeSingle()

    if (existing) {
      alert('You already locked a commitment for today.')
      return
    }

    const { data, error } = await supabase
      .from('commitments')
      .insert({
        user_id: user.id,
        commitment,
        day_number: currentDay,
        completed: false,
      })
      .select()
      .single()

    if (error) {
      alert(error.message)
      return
    }

    setLocked(true)
    setTodayCommitmentId(data.id)
    setCommitments((prev) => [...prev, data])
  }

  const uploadProof = async () => {
    if (!file) {
      alert('Choose a photo first')
      return
    }

    if (!todayCommitmentId) {
      alert('Lock a commitment first')
      return
    }

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return

    const fileName = `${user.id}-${Date.now()}.jpg`

    const { error } = await supabase.storage
      .from('proofs')
      .upload(fileName, file)

    if (error) {
      alert(error.message)
      return
    }

    const { data } = supabase.storage
      .from('proofs')
      .getPublicUrl(fileName)

    setProofUrl(data.publicUrl)

    await supabase
      .from('proofs')
      .insert({
        user_id: user.id,
        commitment_id: todayCommitmentId,
        proof_url: data.publicUrl,
      })

    alert('Proof uploaded')
  }

 const completeCommitment = async () => {
  if (!proofUrl) {
    alert('Upload proof first')
    return
  }

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user || !todayCommitmentId) return

  const { error } = await supabase
    .from('commitments')
    .update({ completed: true })
    .eq('id', todayCommitmentId)

  if (error) {
    alert(error.message)
    return
  }

 const newCompletedDays =
  Math.min(completedDays + 1, 21)

 await supabase
  .from('profiles')
  .update({
    completed_days: newCompletedDays,
    current_day:
      newCompletedDays >= 21
        ? 21
        : newCompletedDays + 1,
    current_streak: newCompletedDays,

    graduated:
      newCompletedDays >= 21,

    graduated_at:
      newCompletedDays >= 21
        ? new Date().toISOString()
        : null,
  })
  .eq('id', user.id)
    const { data: postData, error: postError } = await supabase
  .from('posts')
  .insert({
    user_id: user.id,
    commitment_id: todayCommitmentId,
  })
  .select()
if (postError) {
  alert('POST ERROR: ' + postError.message)
  console.log(postError)
}

  setCompleted(true)
  setCompletedDays(newCompletedDays)
 setCurrentDay(
  newCompletedDays >= 21
    ? 21
    : newCompletedDays + 1
)

  alert(`Progress: ${newCompletedDays}/21 completed`)
}

  return (
    <main
      style={{
        background: '#000',
        color: '#fff',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
  style={{
    display: 'flex',
    gap: '20px',
    marginBottom: '30px',
  }}
>
  <a href="/feed">Feed</a>
  <a href="/dashboard">Dashboard</a>
  <a href="/history">History</a>

  <button
    onClick={async () => {
      await supabase.auth.signOut()
      window.location.href = '/join'
    }}
  >
    Logout
  </button>
</div>
      <div style={{ width: '600px' }}>
    <div
  style={{
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  }}
>
  <h1
    style={{
      color: '#9333ea',
      fontSize: '64px',
      fontWeight: 'bold',
      margin: 0,
    }}
  >
    Day {currentDay} of 21
  </h1>

  <a
    href="/notifications"
    style={{
      position: 'relative',
      textDecoration: 'none',
      fontSize: '40px',
    }}
  >
    🔔

    {unreadNotifications > 0 && (
      <div
        style={{
          position: 'absolute',
          top: '-8px',
          right: '-12px',
          background: '#ef4444',
          color: '#fff',
          borderRadius: '50%',
          minWidth: '24px',
          height: '24px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '12px',
          fontWeight: 'bold',
        }}
      >
        {unreadNotifications}
      </div>
    )}
  </a>
</div>

        <h3>Progress: {completedDays}/21</h3>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(7, 1fr)',
            gap: '8px',
            marginTop: '20px',
            marginBottom: '20px',
          }}
        >
   {[...Array(21)].map((_, index) => {
  const day = index + 1

  const isCompleted = day < currentDay
  const isCurrent = day === currentDay

  return (
    <div
      key={day}
      style={{
        height: '60px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: '10px',
        fontWeight: 'bold',
        fontSize: '18px',
        background: isCompleted
          ? '#16a34a'
          : isCurrent
          ? '#9333ea'
          : '#111',
        border: isCurrent
          ? '2px solid #c084fc'
          : '1px solid #333',
        color: '#fff',
      }}
    >
      {day}
    </div>
  )
})}
        </div>

        <div
          style={{
            background: '#111',
            padding: '16px',
            borderRadius: '12px',
            marginTop: '12px',
            marginBottom: '20px',
            border: '1px solid #333',
          }}
        >
          🔥 Current Streak: {completedDays} Days
        </div>

        <div
          style={{
            width: '100%',
            height: '20px',
            background: '#222',
            borderRadius: '10px',
            overflow: 'hidden',
            marginBottom: '20px',
          }}
        >
          <div
            style={{
              width: `${(completedDays / 21) * 100}%`,
              height: '100%',
              background: '#9333ea',
            }}
          />
        </div>

        {!locked ? (
          <>
            <h2>What is today's commitment?</h2>

            <input
              value={commitment}
              onChange={(e) => setCommitment(e.target.value)}
              style={{
                width: '100%',
                padding: '16px',
                background: '#07132b',
                color: '#fff',
                border: '1px solid #333',
              }}
            />

            <button
              onClick={lockCommitment}
              style={{
                marginTop: '16px',
                background: '#9333ea',
                color: '#fff',
                padding: '12px 24px',
                border: 'none',
              }}
            >
              LOCK COMMITMENT
            </button>
          </>
        ) : (
          <>
            <h2>Today's Commitment</h2>

            <div
              style={{
                background: '#07132b',
                padding: '16px',
                marginBottom: '20px',
              }}
            >
              {commitment}
            </div>

            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
            />

            <br />
            <br />

            <button
              onClick={uploadProof}
              style={{
                background: '#9333ea',
                color: '#fff',
                padding: '12px 24px',
                border: 'none',
              }}
            >
              UPLOAD PROOF
            </button>

            {proofUrl && (
              <>
                <br />
                <br />

                <h3>Today's Proof</h3>

                <img
                  src={proofUrl}
                  alt="proof"
                  width="300"
                />

                <br />
                <br />
              </>
            )}

            {!completed ? (
              <button
                onClick={completeCommitment}
                style={{
                  background: 'green',
                  color: '#fff',
                  padding: '12px 24px',
                  border: 'none',
                }}
              >
                MARK COMPLETE
              </button>
   ) : (
  <div
    style={{
      textAlign: 'center',
      padding: '40px',
      background: '#111',
      borderRadius: '20px',
      border: '1px solid #22c55e',
      marginTop: '30px',
    }}
  >
    <div
      style={{
        fontSize: '80px',
        marginBottom: '20px',
      }}
    >
      {completedDays >= 21 ? '🏆' : '✅'}
    </div>

   <h1
  style={{
    color: completedDays >= 21
      ? '#fbbf24'
      : '#22c55e',
    marginBottom: '20px',
  }}
>
  {completedDays >= 21
    ? '🏆 21 STRONG COMPLETE'
    : 'DAY COMPLETE'}
</h1>

    <h2>
      Current Streak: {completedDays} Days
    </h2>

    <h3>
      Progress: {completedDays}/21
    </h3>

   <p
  style={{
    color: '#aaa',
    marginTop: '20px',
    fontSize: '18px',
  }}
>
  {completedDays >= 21
    ? 'You kept 21 promises to yourself. Most people quit. You did not.'
    : 'See you tomorrow.'}
</p>

<a
  href="/history"
  style={{
    display: 'inline-block',
    marginTop: '30px',
    padding: '12px 24px',
    background: '#22c55e',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
  }}
>
  VIEW HISTORY
</a>
<a
  href="/graduates"
  style={{
    display: 'inline-block',
    marginTop: '15px',
    marginLeft: '15px',
    padding: '12px 24px',
    background: '#9333ea',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
  }}
>
  VIEW GRADUATES
</a>
<br />
<br />

<a
  href="/project365"
  style={{
    display: 'inline-block',
    marginTop: '15px',
    padding: '12px 24px',
    background: '#9333ea',
    color: '#fff',
    textDecoration: 'none',
    borderRadius: '10px',
    fontWeight: 'bold',
  }}
>
  LEARN ABOUT PROJECT 365
</a>
      {completedDays >= 21 && (
  <div
    style={{
      marginTop: '20px',
      color: '#fbbf24',
      fontWeight: 'bold',
      fontSize: '20px',
    }}
  >
    You now have proof.
  </div>
)}

  </div>
)}
          </>
        )}
      </div>
    </main>
  )
}
