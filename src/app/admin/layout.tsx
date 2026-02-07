'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Ticket, LayoutDashboard, Gift, Clock, Home, Users, Store, Package, FolderOpen, ShoppingBag } from 'lucide-react'
import { AdminHeader, useAuth } from '@auth'
import { Loading, ThemeToggle } from '@shared'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading, isAdmin, isSuperAdmin, storeName } = useAuth()
  const router = useRouter()

  // ADMIN o SUPER_ADMIN pueden acceder
  const hasAccess = isAdmin || isSuperAdmin

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/login?callbackUrl=/admin')
    }
    // Redirect users without admin access to user dashboard
    if (!isLoading && isAuthenticated && !hasAccess) {
      router.push('/mi-cuenta')
    }
  }, [isAuthenticated, isLoading, hasAccess, router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-100 dark:bg-slate-900 flex items-center justify-center transition-colors">
        <Loading size="lg" text="Cargando..." />
      </div>
    )
  }

  if (!isAuthenticated || !hasAccess) {
    return null
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-900 transition-colors">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-full w-64 bg-slate-900 dark:bg-black text-white p-6 hidden lg:block">
        <div className="flex items-center gap-2 mb-2">
          <Ticket className="w-8 h-8 text-amber-400" />
          <span className="text-xl font-bold">RifaApp</span>
        </div>
        {storeName && (
          <p className="text-sm text-slate-400 mb-8 pl-1">{storeName}</p>
        )}
        {isSuperAdmin && (
          <p className="text-xs text-amber-400 mb-8 pl-1">Modo Super Admin</p>
        )}

        <nav className="space-y-2">
          <Link
            href="/admin"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
            <LayoutDashboard className="w-5 h-5" />
            Dashboard
          </Link>
          <Link
            href="/admin/rifas"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
            <Gift className="w-5 h-5" />
            Rifas
          </Link>
          <Link
            href="/admin/reservas"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
            <Clock className="w-5 h-5" />
            Reservas
          </Link>
          <Link
            href="/admin/usuarios"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
          >
            <Users className="w-5 h-5" />
            Usuarios
          </Link>

          {/* Sección de Productos */}
          <div className="pt-4 mt-4 border-t border-slate-700">
            <p className="px-4 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Tienda
            </p>
            <Link
              href="/admin/productos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
            >
              <Package className="w-5 h-5" />
              Productos
            </Link>
            <Link
              href="/admin/categorias"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
            >
              <FolderOpen className="w-5 h-5" />
              Categorías
            </Link>
            <Link
              href="/admin/reservas-productos"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Reservas Prod.
            </Link>
          </div>

          {isAdmin && (
            <Link
              href="/admin/mi-tienda"
              className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors"
            >
              <Store className="w-5 h-5" />
              Mi Tienda
            </Link>
          )}
        </nav>

        <div className="absolute bottom-6 left-6 right-6 space-y-2">
          {isSuperAdmin && (
            <Link
              href="/super-admin"
              className="flex items-center gap-3 px-4 py-3 rounded-lg bg-amber-600 hover:bg-amber-700 transition-colors text-white"
            >
              <LayoutDashboard className="w-5 h-5" />
              Panel Super Admin
            </Link>
          )}
          <Link
            href="/"
            className="flex items-center gap-3 px-4 py-3 rounded-lg hover:bg-slate-800 dark:hover:bg-slate-900 transition-colors text-slate-400"
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
            <span className="font-bold text-slate-800 dark:text-white">RifaApp</span>
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
