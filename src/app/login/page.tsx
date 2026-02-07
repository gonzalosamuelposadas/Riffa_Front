import { Suspense } from 'react'
import { Ticket } from 'lucide-react'
import { LoginForm } from '@auth'
import { Loading } from '@shared'

export const metadata = {
  title: 'Iniciar Sesion | RifaApp',
  description: 'Inicia sesion en tu cuenta'
}

function LoadingFallback() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full mb-4">
          <Ticket className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <Loading size="md" text="Cargando..." />
      </div>
    </main>
  )
}

export default function LoginPage() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <LoginForm />
    </Suspense>
  )
}
