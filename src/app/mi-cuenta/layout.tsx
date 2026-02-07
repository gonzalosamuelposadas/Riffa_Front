'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@auth'
import { Loading, ThemeToggle } from '@shared'
import { User, LogOut, Ticket, Home } from 'lucide-react'

export default function UserAccountLayout({
  children
}: {
  children: React.ReactNode
}) {
  const { user, isLoading, isAuthenticated, isUser, logout } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?callbackUrl=/mi-cuenta')
    }
    // Redirect admin users to admin dashboard
    if (!isLoading && isAuthenticated && !isUser) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, isUser, router])

  const handleLogout = () => {
    logout()
    router.push('/')
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
        <Loading size="lg" text="Cargando..." />
      </div>
    )
  }

  if (!isAuthenticated || !isUser) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm border-b border-slate-200 dark:border-slate-700 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Link href="/" className="flex items-center gap-2 text-slate-800 dark:text-white hover:text-amber-600 dark:hover:text-amber-400">
                <Ticket className="w-6 h-6 text-amber-500" />
                <span className="font-bold text-lg">RifaApp</span>
              </Link>
            </div>

            <nav className="flex items-center gap-4 sm:gap-6">
              <ThemeToggle />
              <Link
                href="/"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <Home className="w-4 h-4" />
                <span className="hidden sm:inline">Inicio</span>
              </Link>
              <Link
                href="/mi-cuenta"
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                <User className="w-4 h-4" />
                <span className="hidden sm:inline">{user?.name}</span>
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-red-600 dark:hover:text-red-400 transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Salir</span>
              </button>
            </nav>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  )
}
