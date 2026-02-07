'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Store, Trophy, Home, Package } from 'lucide-react'
import { api } from '@shared'

interface StoreInfo {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  owner: {
    name: string
  }
}

export default function TiendaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const params = useParams()
  const slug = params.slug as string
  const [store, setStore] = useState<StoreInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await api.get<StoreInfo>(`/stores/${slug}/public`)
        setStore(data)
      } catch {
        setError(true)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchStore()
    }
  }, [slug])

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
        <div className="animate-pulse">
          <div className="h-16 bg-slate-200 dark:bg-slate-800" />
          <div className="max-w-6xl mx-auto p-6">
            <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
            <div className="h-4 w-96 bg-slate-200 dark:bg-slate-700 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !store) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <Store className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Tienda no encontrada
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            La tienda que buscas no existe o no está disponible
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <Home className="w-4 h-4" />
            Ir al inicio
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <header className="bg-white dark:bg-slate-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Link href={`/tienda/${slug}`} className="flex items-center gap-3">
              {store.logo ? (
                <img
                  src={store.logo}
                  alt={store.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
              ) : (
                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                  <Store className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
              )}
              <div>
                <h1 className="font-bold text-slate-800 dark:text-white">
                  {store.name}
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  por {store.owner.name}
                </p>
              </div>
            </Link>

            <nav className="flex items-center gap-4">
              <Link
                href={`/tienda/${slug}`}
                className="text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm font-medium"
              >
                Rifas
              </Link>
              <Link
                href={`/tienda/${slug}/productos`}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm font-medium"
              >
                <Package className="w-4 h-4" />
                Productos
              </Link>
              <Link
                href={`/tienda/${slug}/ganadores`}
                className="flex items-center gap-1 text-slate-600 dark:text-slate-300 hover:text-amber-600 dark:hover:text-amber-400 transition-colors text-sm font-medium"
              >
                <Trophy className="w-4 h-4" />
                Ganadores
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Store description banner */}
      {store.description && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border-b border-amber-100 dark:border-amber-800">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <p className="text-sm text-amber-800 dark:text-amber-200 text-center">
              {store.description}
            </p>
          </div>
        </div>
      )}

      {/* Main content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 mt-12">
        <div className="max-w-6xl mx-auto px-4 py-6">
          <div className="flex flex-col items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {store.name} - Tienda en RifaApp
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-xs">
              <Link
                href="/legal/terminos"
                className="text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                Términos
              </Link>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <Link
                href="/legal/privacidad"
                className="text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                Privacidad
              </Link>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <Link
                href="/legal/antifraude"
                className="text-slate-400 dark:text-slate-500 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
              >
                Anti-fraude
              </Link>
            </div>
            <p className="text-xs text-slate-400 dark:text-slate-500 text-center">
              Cada tienda organiza sus propias rifas y productos. RifaApp solo facilita la plataforma.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
