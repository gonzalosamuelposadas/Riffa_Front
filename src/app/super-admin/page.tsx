'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Store, DollarSign, TrendingUp, Users, AlertCircle, ArrowRight } from 'lucide-react'
import { api } from '@shared'

interface DashboardData {
  totalStores: number
  activeStores: number
  totalAdmins: number
  totalSalesThisMonth: number
  totalCommissionsPending: number
  totalCommissionsPaid: number
  topStores: {
    id: string
    name: string
    slug: string
    owner: { name: string; email: string }
    totalRevenue: number
  }[]
}

export default function SuperAdminDashboard() {
  const [data, setData] = useState<DashboardData | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const { data: dashboardData } = await api.get<DashboardData>('/super-admin/dashboard')
        setData(dashboardData)
      } catch (error) {
        console.error('Error fetching dashboard:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchDashboard()
  }, [])

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Dashboard Super Admin
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Resumen general de la plataforma
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
              <Store className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Tiendas</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {data?.activeStores || 0}
                <span className="text-sm font-normal text-slate-400"> / {data?.totalStores || 0}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 dark:bg-green-900/30 rounded-lg">
              <TrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Ventas del Mes</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {formatCurrency(data?.totalSalesThisMonth || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-lg">
              <DollarSign className="w-6 h-6 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Comisiones Pendientes</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                {formatCurrency(data?.totalCommissionsPending || 0)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 dark:bg-purple-900/30 rounded-lg">
              <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Vendedores</p>
              <p className="text-2xl font-bold text-slate-800 dark:text-white">
                {data?.totalAdmins || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alert if pending commissions */}
      {data && data.totalCommissionsPending > 0 && (
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            <p className="text-amber-800 dark:text-amber-200">
              Tienes <strong>{formatCurrency(data.totalCommissionsPending)}</strong> en comisiones pendientes de cobro
            </p>
          </div>
          <Link
            href="/super-admin/comisiones"
            className="flex items-center gap-1 text-amber-600 dark:text-amber-400 hover:underline text-sm font-medium"
          >
            Ver comisiones
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/super-admin/vendedores/nuevo"
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Crear Vendedor
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Agregar nuevo admin con tienda
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
          </div>
        </Link>

        <Link
          href="/super-admin/comisiones"
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Gestionar Comisiones
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Ver y marcar pagos
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
          </div>
        </Link>

        <Link
          href="/super-admin/vendedores"
          className="bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-slate-800 dark:text-white group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                Ver Vendedores
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400">
                Lista de tiendas y stats
              </p>
            </div>
            <ArrowRight className="w-5 h-5 text-slate-400 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors" />
          </div>
        </Link>
      </div>

      {/* Top Stores */}
      {data?.topStores && data.topStores.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
              Top Tiendas por Ingresos
            </h2>
          </div>
          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {data.topStores.map((store, index) => (
              <Link
                key={store.id}
                href={`/super-admin/vendedores/${store.id}`}
                className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
              >
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 flex items-center justify-center bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 rounded-full font-bold text-sm">
                    {index + 1}
                  </span>
                  <div>
                    <p className="font-medium text-slate-800 dark:text-white">{store.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{store.owner.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800 dark:text-white">
                    {formatCurrency(store.totalRevenue)}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">ingresos totales</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
