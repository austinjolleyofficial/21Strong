'use client'

export default function TestPage() {
  return (
    <div style={{ padding: '50px' }}>
      <button
        onClick={() => alert('TEST WORKS')}
        style={{
          padding: '20px',
          fontSize: '20px',
        }}
      >
        CLICK ME
      </button>
    </div>
  )
}