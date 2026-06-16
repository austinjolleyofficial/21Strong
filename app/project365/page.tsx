'use client'

export default function Project365Page() {
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
          maxWidth: '800px',
          textAlign: 'center',
        }}
      >
        <h1
          style={{
            color: '#9333ea',
            fontSize: '64px',
            marginBottom: '20px',
          }}
        >
          PROJECT 365
        </h1>

        <h2
          style={{
            color: '#fff',
            marginBottom: '30px',
          }}
        >
          Expose. Rebuild. Fortify.
        </h2>

        <p
          style={{
            fontSize: '22px',
            lineHeight: '1.8',
            color: '#ccc',
          }}
        >
          21 Strong gave you proof.
          <br />
          <br />
          For 21 days, you made promises to
          yourself and kept them.
          <br />
          <br />
          Most people never do that.
          <br />
          <br />
          Now you have evidence that you are
          capable of discipline,
          accountability, and consistency.
          <br />
          <br />
          But proof is only the beginning.
          <br />
          <br />
          Project 365 is designed to help you
          take that proof and build an identity
          around it.
          <br />
          <br />
          This is not another challenge.
          <br />
          <br />
          This is a year-long commitment to
          becoming the person you were created
          to be.
        </p>

        <a
          href="/request-access"
          style={{
            display: 'inline-block',
            marginTop: '40px',
            padding: '16px 32px',
            background: '#9333ea',
            color: '#fff',
            textDecoration: 'none',
            borderRadius: '12px',
            fontWeight: 'bold',
            fontSize: '18px',
          }}
        >
          REQUEST EARLY ACCESS
        </a>
      </div>
    </main>
  )
}