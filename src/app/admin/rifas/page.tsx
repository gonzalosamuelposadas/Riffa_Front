'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Eye, Loader2 } from 'lucide-react'
import { formatPrice, formatDate, cn } from '@shared'
import { DeleteRaffleButton } from '@admin'
import { raffleService } from '@raffles'

interface RaffleNumber {
  status: string
}

interface Raffle {
  id: string
  name: string
  prize: string
  price: number
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  createdAt: string
  numbers: RaffleNumber[]
}

const statusColors = {
  DRAFT: 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300',
  ACTIVE: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400',
  COMPLETED: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400',
  CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400'
}

const statusLabels = {
  DRAFT: 'Borrador',
  ACTIVE: 'Activa',
  COMPLETED: 'Completada',
  CANCELLED: 'Cancelada'
}

export default function RafflesPage() {
  const [raffles, setRaffles] = useState<Raffle[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadRaffles()
  }, [])

  const loadRaffles = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await raffleService.getAllAdmin()
      setRaffles(data as Raffle[])
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar las rifas')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error}</p>
          <button
            onClick={loadRaffles}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Rifas</h1>
          <p className="text-gray-600 dark:text-slate-400 mt-1">Administra todas tus rifas</p>
        </div>
        <Link
          href="/admin/rifas/nueva"
          className="mt-4 sm:mt-0 inline-flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nueva Rifa
        </Link>
      </div>

      {raffles.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-12 text-center">
          <p className="text-gray-500 dark:text-slate-400 mb-4">No has creado ninguna rifa aun</p>
          <Link
            href="/admin/rifas/nueva"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg hover:bg-amber-600 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Crear tu primera rifa
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-slate-700 border-b dark:border-slate-600">
                <tr>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">Rifa</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">Premio</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">Precio</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">Vendidos</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">Estado</th>
                  <th className="text-left px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">Creada</th>
                  <th className="text-right px-6 py-4 font-semibold text-gray-700 dark:text-slate-200">Acciones</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-slate-700">
                {raffles.map((raffle) => {
                  const sold = raffle.numbers.filter(n => n.status === 'SOLD').length
                  const total = raffle.numbers.length

                  return (
                    <tr key={raffle.id} className="hover:bg-gray-50 dark:hover:bg-slate-700/50">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800 dark:text-white">{raffle.name}</p>
                      </td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-300">{raffle.prize}</td>
                      <td className="px-6 py-4 text-gray-600 dark:text-slate-300">{formatPrice(raffle.price)}</td>
                      <td className="px-6 py-4">
                        <span className="text-gray-800 dark:text-white font-medium">{sold}</span>
                        <span className="text-gray-400 dark:text-slate-500"> / {total}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={cn(
                          'px-3 py-1 rounded-full text-sm font-medium',
                          statusColors[raffle.status]
                        )}>
                          {statusLabels[raffle.status]}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-gray-500 dark:text-slate-400 text-sm">
                        {formatDate(raffle.createdAt)}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/rifa/${raffle.id}`}
                            className="p-2 text-gray-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                            title="Ver"
                          >
                            <Eye className="w-5 h-5" />
                          </Link>
                          <Link
                            href={`/admin/rifas/${raffle.id}`}
                            className="p-2 text-gray-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20 rounded-lg transition-colors"
                            title="Editar"
                          >
                            <Edit className="w-5 h-5" />
                          </Link>
                          <DeleteRaffleButton
                            raffleId={raffle.id}
                            raffleName={raffle.name}
                            onDeleted={loadRaffles}
                          />
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
