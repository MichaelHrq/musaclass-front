import FormLogin from '@/components/form/login'

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <div className="max-w-[400px] w-full p-8 rounded-lg bg-[#1E1E1E] flex flex-col justify-around items-center">
        <h2 className="text-3xl font-[500] mb-4">Login</h2>
        <FormLogin />
      </div>
    </main>
  )
}
