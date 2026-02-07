'use client'

import { useRouter } from 'next/navigation'
import { LogOut, User } from 'lucide-react'
import { useAuth } from '../contexts/AuthContext'

export function AdminHeader() {
  const { user, logout } = useAuth()
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div className="flex items-center gap-4">
      {user && (
        <>
          <div className="flex items-center gap-2 text-gray-600">
            <User className="w-4 h-4" />
            <span className="text-sm hidden sm:inline">{user.name}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-500 hover:text-red-600 transition-colors text-sm"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Salir</span>
          </button>
        </>
      )}
    </div>
  )
}
