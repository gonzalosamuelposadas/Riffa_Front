'use client'

import Link from 'next/link'
import { AlertCircle, ShoppingBag, ChevronRight, Clock, CheckCircle, XCircle, Timer } from 'lucide-react'
import { Loading } from '@shared'
import { useUserPurchases, UserPurchase } from '@/modules/user-auth'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

function getStatusInfo(status: string) {
  const info = {
    PENDING: {
      icon: Clock,
      label: 'Pendiente',
      color: 'text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30'
    },
    COMPLETED: {
      icon: CheckCircle,
      label: 'Completada',
      color: 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/30'
    },
    CANCELLED: {
      icon: XCircle,
      label: 'Cancelada',
      color: 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/30'
    },
    EXPIRED: {
      icon: Timer,
      label: 'Expirada',
      color: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-700'
    }
  }

  return info[status as keyof typeof info] || info.PENDING
}

export default function MisComprasPage() {
  const { data: purchases, isLoading, error } = useUserPurchases()

  if (isLoading) {
    return <Loading size="lg" text="Cargando compras..." />
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Error al cargar las compras</h3>
        <p className="text-red-600 dark:text-red-400 mt-1">Por favor intenta de nuevo mas tarde</p>
      </div>
    )
  }

  const purchasesList = purchases as UserPurchase[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mis Compras</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Historial de todas tus compras</p>
        </div>
        <Link
          href="/mi-cuenta"
          className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
        >
          Volver al dashboard
        </Link>
      </div>

      {purchasesList.length === 0 ? (
        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <ShoppingBag className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No tienes compras</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-4">Explora las rifas disponibles y participa!</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Ver rifas disponibles
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {purchasesList.map((purchase) => {
            const statusInfo = getStatusInfo(purchase.status)
            const StatusIcon = statusInfo.icon

            return (
              <div
                key={purchase.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {purchase.raffle.prizeImage && (
                        <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                          <img
                            src={purchase.raffle.prizeImage}
                            alt={purchase.raffle.prize}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <Link
                          href={`/rifa/${purchase.raffle.id}`}
                          className="font-semibold text-slate-900 dark:text-white hover:text-amber-600 dark:hover:text-amber-400"
                        >
                          {purchase.raffle.name}
                        </Link>
                        <p className="text-sm text-slate-500 dark:text-slate-400">{purchase.raffle.prize}</p>
                        <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">
                          {new Date(purchase.createdAt).toLocaleDateString('es-MX', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-lg font-bold text-slate-900 dark:text-white">
                          {formatCurrency(purchase.totalAmount)}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {purchase.numbers.length} numeros
                        </p>
                      </div>
                      <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full ${statusInfo.color}`}>
                        <StatusIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{statusInfo.label}</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                    <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Numeros comprados:</p>
                    <div className="flex flex-wrap gap-2">
                      {purchase.numbers.map((n) => (
                        <span
                          key={n.number}
                          className={`text-sm px-2.5 py-1 rounded-lg font-medium ${
                            purchase.status === 'COMPLETED'
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                              : purchase.status === 'PENDING'
                              ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          #{n.number}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
