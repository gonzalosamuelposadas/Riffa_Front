'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, LayoutDashboard, Users, DollarSign, Receipt, Home, Store } from 'lucide-react'
import { AdminHeader, useAuth } from '@auth'
import { Loading, ThemeToggle } from '@shared'

export default function SuperAdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, isSuperAdmin } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?callbackUrl=/super-admin')
    }
    // Solo SUPER_ADMIN puede acceder
    if (!isLoading && isAuthenticated && !isSuperAdmin) {
      router.push('/admin')
    }
  }, [isAuthenticated, isLoading, isSuperAdmin, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors">
        <Loading size="lg" text="Cargando..." />
      </div>
    )
  }

  if (!isAuthenticated || !isSuperAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-amber-900 dark:bg-amber-950 text-white p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="w-8 h-8 text-amber-300" />
          <span className="text-xl font-bold">RifaApp</span>
        </div>
        <p className="text-xs text-amber-300 mb-8 pl-1">Super Admin</p>

        <nav className="space-y-2">
          <Link
            href="/super-admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-800 dark:hover:bg-amber-900 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/super-admin/vendedores"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-800 dark:hover:bg-amber-900 transition-colors"
          >
            <Users className="w-5 h-5" />
            Vendedores
          </Link>
          <Link
            href="/super-admin/comisiones"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-800 dark:hover:bg-amber-900 transition-colors"
          >
            <DollarSign className="w-5 h-5" />
            Comisiones
          </Link>
          <Link
            href="/super-admin/facturacion"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-800 dark:hover:bg-amber-900 transition-colors"
          >
            <Receipt className="w-5 h-5" />
            Facturación
          </Link>
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 transition-colors text-white"
          >
            <Store className="w-5 h-5" />
            Panel Admin
          </Link>
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-amber-800 dark:hover:bg-amber-900 transition-colors text-amber-200"
          >
            <Home className="w-5 h-5" />
            Ver Sitio
          </Link>
        </div>
      </aside>

      {/* Top bar */}
      <div className="lg:ml-64">
        <header className="bg-white dark:bg-slate-800 shadow-sm dark:shadow-slate-900/50 px-6 py-4 flex items-center justify-between transition-colors">
          {/* Mobile menu */}
          <div className="lg:hidden flex items-center gap-2">
            <Ticket className="w-6 h-6 text-amber-500" />
            <span className="font-bold text-slate-800 dark:text-white">Super Admin</span>
          </div>
          <div className="hidden lg:block" />

          {/* Right side */}
          <div className="flex items-center gap-4">
            <ThemeToggle />
            <AdminHeader />
          </div>
        </header>

        {/* Main content */}
        <main className="min-h-screen">
          {children}
        </main>
      </div>
    </div>
  )
}
