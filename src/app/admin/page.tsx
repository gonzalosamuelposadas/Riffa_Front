'use client'

import { useMemo, useEffect, useState } from 'react'
import Link from 'next/link'
import { Gift, DollarSign, Users, TrendingUp, Plus, Loader2, Clock, Store, ExternalLink } from 'lucide-react'
import { formatPrice, api } from '@shared'
import { useAdminRaffles } from '@raffles'
import { usePurchases, usePendingPurchases } from '@purchases'
import { useAuth } from '@/modules/auth'

interface StoreStats {
  totalRaffles: number
  activeRaffles: number
  completedRaffles: number
  totalSales: number
  pendingCommissions: number
  paidCommissions: number
}

export default function AdminDashboard() {
  const { storeName, storeSlug, isSuperAdmin } = useAuth()
  const { data: raffles, isLoading: loadingRaffles } = useAdminRaffles()
  const { data: purchases, isLoading: loadingPurchases } = usePurchases()
  const { data: pendingPurchases, isLoading: loadingPending } = usePendingPurchases()
  const [storeStats, setStoreStats] = useState<StoreStats | null>(null)

  useEffect(() => {
    const fetchStoreStats = async () => {
      if (isSuperAdmin) return
      try {
        const { data } = await api.get<StoreStats>('/stores/my-store/stats')
        setStoreStats(data)
      } catch (error) {
        console.error('Error fetching store stats:', error)
      }
    }
    fetchStoreStats()
  }, [isSuperAdmin])

  const isLoading = loadingRaffles || loadingPurchases || loadingPending

  const stats = useMemo(() => {
    if (!raffles || !purchases || !pendingPurchases) {
      return {
        totalRaffles: 0,
        activeRaffles: 0,
        totalRevenue: 0,
        totalSold: 0,
        pendingReservations: 0,
        recentPurchases: [],
      }
    }

    const completedPurchases = purchases.filter((p) => p.status === 'COMPLETED')
    const totalRevenue = completedPurchases.reduce((acc, p) => acc + p.totalAmount, 0)
    const totalSold = raffles.reduce(
      (acc, r) => acc + (r.numbers?.filter((n) => n.status === 'SOLD').length || 0),
      0
    )
    const activeRaffles = raffles.filter((r) => r.status === 'ACTIVE').length

    return {
      totalRaffles: raffles.length,
      activeRaffles,
      totalRevenue,
      totalSold,
      pendingReservations: pendingPurchases.length,
      recentPurchases: completedPurchases.slice(0, 5),
    }
  }, [raffles, purchases, pendingPurchases])

  if (isLoading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      {/* Store Header (for ADMIN only) */}
      {storeName && !isSuperAdmin && (
        <div className="mb-6 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 dark:bg-amber-900/50 rounded-lg">
              <Store className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="font-semibold text-amber-800 dark:text-amber-200">{storeName}</p>
              <p className="text-xs text-amber-600 dark:text-amber-400">/tienda/{storeSlug}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/admin/mi-tienda"
              className="text-amber-600 dark:text-amber-400 hover:underline text-sm"
            >
              Configurar
            </Link>
            <a
              href={`/tienda/${storeSlug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-amber-600 dark:text-amber-400 hover:bg-amber-100 dark:hover:bg-amber-900/30 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Dashboard</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">
            {isSuperAdmin ? 'Administración de la plataforma' : 'Resumen de tu tienda de rifas'}
          </p>
        </div>
        <Link
          href="/admin/rifas/nueva"
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Rifa
        </Link>
      </div>

      {/* Commission Alert (for ADMIN only) */}
      {storeStats && storeStats.pendingCommissions > 0 && (
        <div className="mb-6 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
          <p className="text-red-800 dark:text-red-200">
            Tienes <strong>{formatPrice(storeStats.pendingCommissions)}</strong> en comisiones pendientes de pago (5% de ventas)
          </p>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Rifas Activas</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.activeRaffles}</p>
            </div>
            <div className="w-12 h-12 bg-amber-100 dark:bg-amber-900/30 rounded-xl flex items-center justify-center">
              <Gift className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Numeros Vendidos</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.totalSold}</p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Ingresos Totales</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{formatPrice(stats.totalRevenue)}</p>
            </div>
            <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-900/30 rounded-xl flex items-center justify-center">
              <DollarSign className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-500 dark:text-slate-400 text-sm">Total Rifas</p>
              <p className="text-3xl font-bold text-gray-800 dark:text-white mt-1">{stats.totalRaffles}</p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Acciones Rapidas</h2>
          <div className="space-y-3">
            <Link
              href="/admin/reservas"
              className="flex items-center justify-between p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg hover:bg-amber-100 dark:hover:bg-amber-900/30 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                <span className="font-medium text-amber-700 dark:text-amber-400">Reservas pendientes</span>
              </div>
              {stats.pendingReservations > 0 && (
                <span className="bg-amber-500 text-white text-sm font-bold px-2 py-1 rounded-full">
                  {stats.pendingReservations}
                </span>
              )}
            </Link>
            <Link
              href="/admin/rifas/nueva"
              className="flex items-center gap-3 p-4 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors"
            >
              <Gift className="w-5 h-5 text-slate-600 dark:text-slate-300" />
              <span className="font-medium text-slate-700 dark:text-slate-200">Crear nueva rifa</span>
            </Link>
            <Link
              href="/admin/rifas"
              className="flex items-center gap-3 p-4 bg-slate-50 dark:bg-slate-700/50 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
            >
              <Gift className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              <span className="font-medium text-gray-700 dark:text-slate-300">Ver todas las rifas</span>
            </Link>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">Compras Recientes</h2>
          {stats.recentPurchases.length === 0 ? (
            <p className="text-gray-500 dark:text-slate-400 text-center py-8">No hay compras aun</p>
          ) : (
            <div className="space-y-3">
              {stats.recentPurchases.map((purchase) => (
                <div key={purchase.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800 dark:text-white">{purchase.buyerName}</p>
                    <p className="text-sm text-gray-500 dark:text-slate-400">{purchase.buyerEmail}</p>
                  </div>
                  <span className="font-bold text-green-600 dark:text-green-400">{formatPrice(purchase.totalAmount)}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
