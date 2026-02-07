'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { User, LogIn, LogOut, Shield } from 'lucide-react'
import { useAuth } from '@auth'

export function UserNavMenu() {
  const { user, isAuthenticated, isLoading, isAdmin, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/')
    router.refresh()
  }

  if (isLoading) {
    return (
      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse" />
    )
  }

  if (isAuthenticated && user) {
    return (
      <div className="flex items-center gap-3">
        <Link
          href={isAdmin ? '/admin' : '/mi-cuenta'}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
        >
          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isAdmin ? 'bg-slate-200 dark:bg-slate-700' : 'bg-amber-100 dark:bg-amber-900/50'}`}>
            {isAdmin ? (
              <Shield className="w-4 h-4 text-slate-600 dark:text-slate-300" />
            ) : (
              <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            )}
          </div>
          <span className="hidden sm:inline font-medium">{user.name.split(' ')[0]}</span>
        </Link>
        <button
          onClick={handleLogout}
          className="text-slate-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-colors"
          title="Cerrar sesion"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <Link
        href="/login"
        className="flex items-center gap-2 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
      >
        <LogIn className="w-5 h-5" />
        <span className="hidden sm:inline">Entrar</span>
      </Link>
      <Link
        href="/registro"
        className="hidden sm:flex items-center gap-2 bg-slate-800 dark:bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-slate-700 dark:hover:bg-amber-500 transition-colors text-sm font-medium"
      >
        Registrarse
      </Link>
    </div>
  )
}
