'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Loader2, Trophy, Users, DollarSign, Eye, Hash } from 'lucide-react'
import toast from 'react-hot-toast'
import { RaffleForm, raffleService, usePerformDraw } from '@raffles'
import type { Raffle } from '@shared'

export default function EditRafflePage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string

  const [raffle, setRaffle] = useState<Raffle | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showDrawConfirm, setShowDrawConfirm] = useState(false)

  const drawMutation = usePerformDraw()

  const loadRaffle = async () => {
    try {
      setLoading(true)
      setError(null)
      const data = await raffleService.getById(id)
      setRaffle(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar la rifa')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (id) {
      loadRaffle()
    }
  }, [id])

  const handleDraw = async () => {
    try {
      const result = await drawMutation.mutateAsync(id)
      toast.success(`Sorteo realizado! Numero ganador: #${result.winningNumber}`)
      setShowDrawConfirm(false)
      loadRaffle()
    } catch (err) {
      toast.error(err instanceof Error ? err.message : 'Error al realizar el sorteo')
    }
  }

  const soldCount = raffle?.numbers?.filter((n) => n.status === 'SOLD').length || 0

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error || !raffle) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Rifa no encontrada'}</p>
          <button
            onClick={() => router.push('/admin/rifas')}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Volver a rifas
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link
          href="/admin/rifas"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a rifas
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Editar Rifa</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">{raffle.name}</p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Link
          href={`/rifa/${raffle.id}`}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
            <Eye className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <span className="font-medium text-gray-700 dark:text-slate-200">Ver Rifa</span>
        </Link>

        <Link
          href={`/admin/rifas/${raffle.id}/ventas`}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
            <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
          </div>
          <span className="font-medium text-gray-700 dark:text-slate-200">Ver Ventas</span>
        </Link>

        <Link
          href={`/admin/rifas/${raffle.id}/participantes`}
          className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm hover:shadow-md transition-all"
        >
          <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
            <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
          </div>
          <span className="font-medium text-gray-700 dark:text-slate-200">Participantes</span>
        </Link>

        {raffle.status === 'ACTIVE' && soldCount > 0 && (
          <button
            onClick={() => setShowDrawConfirm(true)}
            className="flex items-center gap-3 p-4 bg-gradient-to-r from-amber-500 to-amber-600 rounded-xl shadow-sm hover:shadow-md transition-all text-white"
          >
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Trophy className="w-5 h-5" />
            </div>
            <span className="font-medium">Realizar Sorteo</span>
          </button>
        )}

        {raffle.status === 'COMPLETED' && raffle.winningNumber && (
          <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-xl shadow-sm text-white">
            <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Hash className="w-5 h-5" />
            </div>
            <div>
              <span className="text-xs text-green-100">Ganador</span>
              <p className="font-bold">#{raffle.winningNumber}</p>
            </div>
          </div>
        )}
      </div>

      {/* Draw Confirmation Modal */}
      {showDrawConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <Trophy className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Realizar Sorteo</h3>
              <p className="text-gray-600 dark:text-slate-400 mb-6">
                Se seleccionara un numero ganador aleatorio de los {soldCount} numeros vendidos.
                Esta accion no se puede deshacer.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDrawConfirm(false)}
                  className="flex-1 px-4 py-3 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDraw}
                  disabled={drawMutation.isPending}
                  className="flex-1 px-4 py-3 bg-amber-500 text-white rounded-lg hover:bg-amber-600 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {drawMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Sorteando...
                    </>
                  ) : (
                    'Confirmar Sorteo'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 lg:p-8 max-w-3xl">
        <RaffleForm raffle={raffle} />
      </div>
    </div>
  )
}
