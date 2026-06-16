'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function NotificationsPage() {
  const [notifications, setNotifications] =
    useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadNotifications()
  }, [])

  const loadNotifications = async () => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      setLoading(false)
      return
    }

    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', {
        ascending: false,
      })

    if (error) {
      alert(error.message)
      setLoading(false)
      return
    }

    setNotifications(data || [])
    setLoading(false)
  }

  const markAsRead = async (id: string) => {
    await supabase
      .from('notifications')
      .update({
        is_read: true,
      })
      .eq('id', id)

    await loadNotifications()
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
      <h1
        style={{
          color: '#9333ea',
          fontSize: '42px',
          marginBottom: '25px',
        }}
      >
        Notifications
      </h1>

      {loading && (
        <p style={{ color: '#aaa' }}>
          Loading notifications...
        </p>
      )}

      {!loading && notifications.length === 0 && (
        <p style={{ color: '#aaa' }}>
          No notifications yet.
        </p>
      )}

      {notifications.map((notification) => (
        <div
          key={notification.id}
          style={{
            background: notification.is_read
              ? '#111'
              : '#1a0b2e',
            border: notification.is_read
              ? '1px solid #333'
              : '1px solid #9333ea',
            borderRadius: '12px',
            padding: '16px',
            marginBottom: '12px',
          }}
        >
          <p
            style={{
              margin: 0,
              fontWeight: notification.is_read
                ? 'normal'
                : 'bold',
            }}
          >
            {notification.message}
          </p>

          <p
            style={{
              color: '#777',
              fontSize: '13px',
              marginTop: '8px',
            }}
          >
            {new Date(
              notification.created_at
            ).toLocaleString()}
          </p>

          {!notification.is_read && (
            <button
              onClick={() =>
                markAsRead(notification.id)
              }
              style={{
                marginTop: '10px',
                background: '#9333ea',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '8px 12px',
                cursor: 'pointer',
              }}
            >
              Mark as read
            </button>
          )}
        </div>
      ))}
    </main>
  )
}