export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center bg-black text-white">
      <h1 className="text-6xl font-bold text-purple-500">
        21 STRONG
      </h1>

      <p className="mt-4 text-xl">
        Accountability • Discipline • Proof
      </p>

      <p className="mt-8 text-center max-w-md">
        Can you stay accountable for 21 days?
      </p>

      <a
  href="/join"
  className="mt-8 px-6 py-3 bg-purple-600 rounded-lg"
>
  Join 21 Strong
</a>
    </main>
  )
}
