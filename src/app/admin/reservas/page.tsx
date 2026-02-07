'use client'

import Link from 'next/link'
import { ArrowLeft, CheckCircle, XCircle, Loader2, Clock, User, Mail, Phone } from 'lucide-react'
import toast from 'react-hot-toast'
import { formatPrice, formatDate } from '@shared'
import { usePendingPurchases, useConfirmPurchase, useCancelPurchase } from '@purchases'

export default function ReservasPage() {
  const { data: reservas, isLoading, error, refetch } = usePendingPurchases()
  const confirmMutation = useConfirmPurchase()
  const cancelMutation = useCancelPurchase()

  const handleConfirm = (id: string) => {
    confirmMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.message)
      },
      onError: (error: Error) => {
        toast.error(error.message)
      },
    })
  }

  const handleCancel = (id: string) => {
    cancelMutation.mutate(id, {
      onSuccess: (data) => {
        toast.success(data.message)
      },
      onError: (error: Error) => {
        toast.error(error.message)
      },
    })
  }

  if (isLoading) {
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
          <p className="text-red-600 dark:text-red-400 mb-4">{error.message}</p>
          <button
            onClick={() => refetch()}
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
      <div className="mb-8">
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver al dashboard
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Reservas Pendientes</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">
          Gestiona las reservas que requieren confirmacion de pago
        </p>
      </div>

      {!reservas || reservas.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 dark:text-slate-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-400 dark:text-slate-500 mb-2">
            No hay reservas pendientes
          </h2>
          <p className="text-gray-500 dark:text-slate-400">
            Las nuevas reservas apareceran aqui para su revision.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservas.map((reserva) => (
            <div
              key={reserva.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-slate-700"
            >
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                {/* Info del cliente */}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full text-sm font-medium">
                      Pendiente
                    </span>
                    <span className="text-gray-500 dark:text-slate-400 text-sm">
                      {formatDate(reserva.createdAt as string)}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2">
                    {reserva.raffle.name}
                  </h3>

                  <div className="space-y-1 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                      <User className="w-4 h-4" />
                      <span>{reserva.buyerName}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                      <Mail className="w-4 h-4" />
                      <span>{reserva.buyerEmail}</span>
                    </div>
                    {reserva.buyerPhone && (
                      <div className="flex items-center gap-2 text-gray-600 dark:text-slate-300">
                        <Phone className="w-4 h-4" />
                        <span>{reserva.buyerPhone}</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Numeros reservados */}
                <div className="flex-1">
                  <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">Numeros reservados:</p>
                  <div className="flex flex-wrap gap-2">
                    {reserva.numbers.map((n) => (
                      <span
                        key={n.number}
                        className="bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1 rounded-full font-mono font-bold text-sm"
                      >
                        #{n.number.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Total y acciones */}
                <div className="flex flex-col items-end gap-4">
                  <div className="text-right">
                    <p className="text-sm text-gray-500 dark:text-slate-400">Total a pagar</p>
                    <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                      {formatPrice(reserva.totalAmount)}
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleCancel(reserva.id)}
                      disabled={cancelMutation.isPending || confirmMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                    >
                      {cancelMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <XCircle className="w-4 h-4" />
                      )}
                      <span>Cancelar</span>
                    </button>
                    <button
                      onClick={() => handleConfirm(reserva.id)}
                      disabled={confirmMutation.isPending || cancelMutation.isPending}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                    >
                      {confirmMutation.isPending ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <CheckCircle className="w-4 h-4" />
                      )}
                      <span>Confirmar Pago</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
