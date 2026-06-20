'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'

export default function Feed() {
  const [posts, setPosts] = useState<any[]>([])
  const [reactions, setReactions] = useState<any[]>([])
  const [comments, setComments] = useState<any[]>([])

  useEffect(() => {
    loadFeed()
  }, [])

  const loadFeed = async () => {
    const { data } = await supabase
      .from('posts')
      .select(`
        *,
        profiles (
          name
        ),
        commitments (
          id,
          commitment,
          day_number,
          proofs (
            proof_url
          )
        )
      `)
      .order('created_at', {
        ascending: false,
      })

    setPosts(data || [])
console.log(
  JSON.stringify(data, null, 2)
)
    const { data: reactionData } = await supabase
      .from('reactions')
      .select('*')

    setReactions(reactionData || [])

    const { data: commentData } = await supabase
      .from('comments')
      .select('*')
      .order('created_at', {
        ascending: true,
      })

    setComments(commentData || [])
  }

  const reactToPost = async (
    postId: string,
    emoji: string
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase
      .from('reactions')
      .insert({
        user_id: user.id,
        post_id: postId,
        reaction_type: emoji,
      })

    if (error?.code === '23505') {
      return
    }

    if (error) {
      alert(error.message)
      return
    }

    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single()

    if (post && post.user_id !== user.id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: post.user_id,
          actor_name: profile?.name,
          message: `${profile?.name} reacted ${emoji} to your post`,
        })
    }

    await loadFeed()
  }

  const addComment = async (
    postId: string,
    comment: string
  ) => {
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { data: profile } = await supabase
      .from('profiles')
      .select('name')
      .eq('id', user.id)
      .single()

    const { error } = await supabase
      .from('comments')
      .insert({
        user_id: user.id,
        post_id: postId,
        comment,
        name: profile?.name || 'Anonymous',
      })

    if (error) {
      alert(error.message)
      return
    }

    const { data: post } = await supabase
      .from('posts')
      .select('user_id')
      .eq('id', postId)
      .single()

    if (post && post.user_id !== user.id) {
      await supabase
        .from('notifications')
        .insert({
          user_id: post.user_id,
          actor_name: profile?.name,
          message: `${profile?.name} commented on your post`,
        })
    }

    await loadFeed()
  }

  const getReactionCount = (
    postId: string,
    emoji: string
  ) => {
    return reactions.filter(
      (r) =>
        r.post_id === postId &&
        r.reaction_type === emoji
    ).length
  }

  const getComments = (postId: string) => {
    return comments.filter(
      (c) => c.post_id === postId
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

      <h1
        style={{
          color: '#9333ea',
          fontSize: '48px',
          marginBottom: '30px',
        }}
      >
        Community Feed
      </h1>

      {posts.map((post) => (
        <div
          key={post.id}
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
              marginBottom: '10px',
            }}
          >
            {post.profiles?.name || '21 Strong Member'}
          </h2>

          <p style={{ fontWeight: 'bold' }}>
            Day {post.commitments?.day_number}
          </p>

          <p
            style={{
              fontSize: '20px',
              marginBottom: '15px',
            }}
          >
            {post.commitments?.commitment}
          </p>

          {post.commitments?.proofs?.[0]?.proof_url && (
            <img
              src={post.commitments.proofs[0].proof_url}
              alt="Proof"
              style={{
                width: '100%',
                maxWidth: '350px',
                borderRadius: '12px',
                marginBottom: '15px',
              }}
            />
          )}

          <p
            style={{
              color: '#22c55e',
              fontWeight: 'bold',
            }}
          >
            ✅ Complete
          </p>

          <div
            style={{
              display: 'flex',
              gap: '10px',
              marginTop: '15px',
            }}
          >
            {['💪', '🔥', '👑', '🙏'].map(
              (emoji) => (
                <button
                  key={emoji}
                  onClick={() =>
                    reactToPost(post.id, emoji)
                  }
                  style={{
                    background: '#111',
                    color: '#fff',
                    border: '1px solid #333',
                    borderRadius: '8px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                  }}
                >
                  {emoji}{' '}
                  {getReactionCount(post.id, emoji)}
                </button>
              )
            )}
          </div>

          <div style={{ marginTop: '20px' }}>
            <input
              id={`comment-${post.id}`}
              placeholder="Encourage someone..."
              style={{
                width: '100%',
                padding: '10px',
                borderRadius: '8px',
                background: '#000',
                color: '#fff',
                border: '1px solid #333',
              }}
            />

            <button
              onClick={() => {
                const input =
                  document.getElementById(
                    `comment-${post.id}`
                  ) as HTMLInputElement

                if (!input.value) return

                addComment(post.id, input.value)
                input.value = ''
              }}
              style={{
                marginTop: '10px',
                background: '#9333ea',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                padding: '10px 16px',
                cursor: 'pointer',
              }}
            >
              Comment
            </button>
          </div>

          <div style={{ marginTop: '20px' }}>
            {getComments(post.id).map((comment) => (
              <div
                key={comment.id}
                style={{
                  background: '#0a0a0a',
                  padding: '10px',
                  borderRadius: '8px',
                  marginBottom: '10px',
                }}
              >
                <div
                  style={{
                    color: '#9333ea',
                    fontWeight: 'bold',
                    marginBottom: '5px',
                  }}
                >
                  {comment.name}
                </div>

                <div>{comment.comment}</div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  )
}