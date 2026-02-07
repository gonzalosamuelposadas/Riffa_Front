'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2, DollarSign, Hash, User, Mail, Phone, Calendar, TrendingUp } from 'lucide-react'
import { raffleService } from '@raffles'
import { formatPrice } from '@shared'

interface SalesData {
  raffle: {
    id: string
    name: string
    prize: string
    price: number
    currency: string
    totalNumbers: number
    soldNumbers: number
    totalRevenue: number
    percentageSold: number
  }
  purchases: Array<{
    id: string
    buyerName: string
    buyerEmail: string
    buyerPhone: string | null
    totalAmount: number
    numbersCount: number
    numbers: number[]
    user: { id: string; name: string; email: string } | null
    createdAt: string
  }>
}

export default function RaffleSalesPage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<SalesData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadSales = async () => {
      try {
        setLoading(true)
        setError(null)
        const salesData = await raffleService.getSales(id)
        setData(salesData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar las ventas')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadSales()
    }
  }, [id])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Error al cargar los datos'}</p>
          <Link
            href={`/admin/rifas/${id}`}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Volver a la rifa
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link
          href={`/admin/rifas/${id}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la rifa
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Ventas</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">{data.raffle.name}</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Total Recaudado</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {formatPrice(data.raffle.totalRevenue, data.raffle.currency)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Hash className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Numeros Vendidos</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {data.raffle.soldNumbers} / {data.raffle.totalNumbers}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Porcentaje Vendido</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {data.raffle.percentageSold}%
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
              <User className="w-5 h-5 text-amber-600 dark:text-amber-400" />
            </div>
            <div>
              <p className="text-sm text-gray-500 dark:text-slate-400">Compras</p>
              <p className="text-xl font-bold text-gray-800 dark:text-white">
                {data.purchases.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Purchases List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Historial de Compras</h2>
        </div>

        {data.purchases.length === 0 ? (
          <div className="p-10 text-center text-gray-500 dark:text-slate-400">
            No hay compras registradas
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700/50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Comprador
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Numeros
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Monto
                  </th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-500 dark:text-slate-400 uppercase tracking-wider">
                    Fecha
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 dark:divide-slate-700">
                {data.purchases.map((purchase) => (
                  <tr key={purchase.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-800 dark:text-white">
                            {purchase.buyerName}
                            {purchase.user && (
                              <span className="ml-2 text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                                Usuario
                              </span>
                            )}
                          </p>
                          <div className="flex items-center gap-3 text-sm text-gray-500 dark:text-slate-400">
                            <span className="flex items-center gap-1">
                              <Mail className="w-3 h-3" />
                              {purchase.buyerEmail}
                            </span>
                            {purchase.buyerPhone && (
                              <span className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {purchase.buyerPhone}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex flex-wrap gap-1">
                        {purchase.numbers.slice(0, 5).map((num) => (
                          <span
                            key={num}
                            className="inline-flex items-center justify-center w-8 h-8 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded-lg text-sm font-medium"
                          >
                            {num}
                          </span>
                        ))}
                        {purchase.numbers.length > 5 && (
                          <span className="inline-flex items-center justify-center px-2 h-8 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded-lg text-sm">
                            +{purchase.numbers.length - 5}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatPrice(purchase.totalAmount, data.raffle.currency)}
                      </span>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1 text-sm text-gray-500 dark:text-slate-400">
                        <Calendar className="w-4 h-4" />
                        {new Date(purchase.createdAt).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
