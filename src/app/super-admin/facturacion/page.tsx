'use client'

import { useEffect, useState } from 'react'
import { Receipt, Lock } from 'lucide-react'
import { api } from '@shared'
import toast from 'react-hot-toast'

interface BillingPeriod {
  id: string
  period: string
  totalSales: number
  totalCommission: number
  status: 'OPEN' | 'CLOSED' | 'PAID'
  closedAt: string | null
  paidAt: string | null
  store: {
    id: string
    name: string
    slug: string
  }
}

export default function FacturacionPage() {
  const [periods, setPeriods] = useState<BillingPeriod[]>([])
  const [loading, setLoading] = useState(true)
  const [closing, setClosing] = useState<string | null>(null)

  const fetchPeriods = async () => {
    try {
      const { data } = await api.get<BillingPeriod[]>('/super-admin/billing')
      setPeriods(data)
    } catch (error) {
      console.error('Error fetching billing periods:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPeriods()
  }, [])

  const handleClosePeriod = async (period: string) => {
    if (!confirm(`¿Cerrar el período ${period}? Las comisiones pasarán a estado "Facturado".`)) {
      return
    }

    setClosing(period)
    try {
      await api.post(`/super-admin/billing/${period}/close`)
      toast.success(`Período ${period} cerrado`)
      fetchPeriods()
    } catch {
      toast.error('Error al cerrar período')
    } finally {
      setClosing(null)
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const formatPeriod = (period: string) => {
    const [year, month] = period.split('-')
    const months = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ]
    return `${months[parseInt(month) - 1]} ${year}`
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'OPEN':
        return (
          <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs rounded-full">
            Abierto
          </span>
        )
      case 'CLOSED':
        return (
          <span className="px-2 py-1 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs rounded-full">
            Cerrado
          </span>
        )
      case 'PAID':
        return (
          <span className="px-2 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-xs rounded-full">
            Pagado
          </span>
        )
    }
  }

  // Group periods by month
  const groupedPeriods = periods.reduce((acc, period) => {
    if (!acc[period.period]) {
      acc[period.period] = []
    }
    acc[period.period].push(period)
    return acc
  }, {} as Record<string, BillingPeriod[]>)

  const uniquePeriods = Object.keys(groupedPeriods).sort().reverse()

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Facturación
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Períodos de facturación mensual
        </p>
      </div>

      {uniquePeriods.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <Receipt className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            Sin períodos de facturación
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Los períodos se crean automáticamente cuando hay ventas
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {uniquePeriods.map((period) => {
            const periodData = groupedPeriods[period]
            const totalSales = periodData.reduce((sum, p) => sum + p.totalSales, 0)
            const totalCommission = periodData.reduce((sum, p) => sum + p.totalCommission, 0)
            const hasOpen = periodData.some((p) => p.status === 'OPEN')
            const currentPeriod = new Date().toISOString().slice(0, 7)
            const isCurrentPeriod = period === currentPeriod

            return (
              <div key={period} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
                <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-slate-800 dark:text-white">
                      {formatPeriod(period)}
                    </h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {periodData.length} tiendas • Ventas: {formatCurrency(totalSales)} • Comisión: {formatCurrency(totalCommission)}
                    </p>
                  </div>
                  {hasOpen && !isCurrentPeriod && (
                    <button
                      onClick={() => handleClosePeriod(period)}
                      disabled={closing === period}
                      className="px-4 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white text-sm rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Lock className="w-4 h-4" />
                      {closing === period ? 'Cerrando...' : 'Cerrar Período'}
                    </button>
                  )}
                  {isCurrentPeriod && (
                    <span className="text-sm text-blue-600 dark:text-blue-400">
                      Período actual
                    </span>
                  )}
                </div>

                <div className="divide-y divide-slate-200 dark:divide-slate-700">
                  {periodData.map((item) => (
                    <div key={item.id} className="p-4 flex items-center justify-between">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">
                          {item.store.name}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Ventas: {formatCurrency(item.totalSales)}
                          </p>
                          <p className="font-medium text-amber-600 dark:text-amber-400">
                            Comisión: {formatCurrency(item.totalCommission)}
                          </p>
                        </div>
                        {getStatusBadge(item.status)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
