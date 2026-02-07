'use client'

import { useEffect, useState } from 'react'
import { Loader2, Package, Check, X, Clock, CheckCircle, XCircle, Phone } from 'lucide-react'
import { api, formatPrice } from '@shared'
import toast from 'react-hot-toast'

type ReservationStatus = 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED'

interface Reservation {
  id: string
  quantity: number
  status: ReservationStatus
  buyerName: string
  buyerPhone: string
  buyerEmail: string | null
  notes: string | null
  createdAt: string
  confirmedAt: string | null
  completedAt: string | null
  cancelledAt: string | null
  product: {
    id: string
    name: string
    slug: string
    price: number
    images: { url: string }[]
  }
  variant: {
    id: string
    name: string
    price: number | null
  } | null
  user: {
    id: string
    name: string
    email: string
  }
}

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmada',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    icon: Check,
  },
  COMPLETED: {
    label: 'Completada',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelada',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    icon: XCircle,
  },
}

export default function ReservasProductosPage() {
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState<string>('')
  const [updating, setUpdating] = useState<string | null>(null)

  const fetchReservations = async () => {
    try {
      const params = statusFilter ? `?status=${statusFilter}` : ''
      const { data } = await api.get<Reservation[]>(`/reservations/admin${params}`)
      setReservations(data)
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReservations()
  }, [statusFilter])

  const handleConfirm = async (id: string) => {
    setUpdating(id)
    try {
      await api.patch(`/reservations/${id}/confirm`)
      toast.success('Reserva confirmada')
      fetchReservations()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al confirmar')
    } finally {
      setUpdating(null)
    }
  }

  const handleComplete = async (id: string) => {
    setUpdating(id)
    try {
      await api.patch(`/reservations/${id}/complete`)
      toast.success('Reserva completada')
      fetchReservations()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al completar')
    } finally {
      setUpdating(null)
    }
  }

  const handleCancel = async (id: string) => {
    if (!confirm('¿Cancelar esta reserva? El stock será restaurado.')) {
      return
    }

    setUpdating(id)
    try {
      await api.patch(`/reservations/${id}/cancel`)
      toast.success('Reserva cancelada')
      fetchReservations()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al cancelar')
    } finally {
      setUpdating(null)
    }
  }

  const openWhatsApp = (phone: string, reservation: Reservation) => {
    const message = encodeURIComponent(
      `Hola ${reservation.buyerName}, te contacto por tu reserva de "${reservation.product.name}"${
        reservation.variant ? ` (${reservation.variant.name})` : ''
      }. ¿Cómo deseas proceder con el pago?`
    )
    window.open(`https://wa.me/${phone.replace(/\D/g, '')}?text=${message}`, '_blank')
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Reservas de Productos
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Gestiona las reservas de tus productos
          </p>
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-white"
        >
          <option value="">Todas</option>
          <option value="PENDING">Pendientes</option>
          <option value="CONFIRMED">Confirmadas</option>
          <option value="COMPLETED">Completadas</option>
          <option value="CANCELLED">Canceladas</option>
        </select>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            No hay reservas
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {statusFilter
              ? 'No hay reservas con este estado'
              : 'Las reservas de productos aparecerán aquí'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const StatusIcon = statusConfig[reservation.status].icon
            const unitPrice = reservation.variant?.price || reservation.product.price
            const total = unitPrice * reservation.quantity

            return (
              <div
                key={reservation.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6"
              >
                <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                  {/* Product image */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                    {reservation.product.images[0] ? (
                      <img
                        src={reservation.product.images[0].url}
                        alt={reservation.product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="w-8 h-8 text-slate-400" />
                      </div>
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <h3 className="font-semibold text-slate-800 dark:text-white">
                        {reservation.product.name}
                      </h3>
                      {reservation.variant && (
                        <span className="px-2 py-0.5 text-xs rounded-full bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                          {reservation.variant.name}
                        </span>
                      )}
                      <span
                        className={`inline-flex items-center gap-1 px-2 py-0.5 text-xs rounded-full ${statusConfig[reservation.status].color}`}
                      >
                        <StatusIcon className="w-3 h-3" />
                        {statusConfig[reservation.status].label}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Cliente: </span>
                        <span className="text-slate-700 dark:text-slate-200">
                          {reservation.buyerName}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Teléfono: </span>
                        <span className="text-slate-700 dark:text-slate-200">
                          {reservation.buyerPhone}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Cantidad: </span>
                        <span className="text-slate-700 dark:text-slate-200">
                          {reservation.quantity}
                        </span>
                      </div>
                      <div>
                        <span className="text-slate-500 dark:text-slate-400">Total: </span>
                        <span className="font-medium text-amber-600 dark:text-amber-400">
                          {formatPrice(total)}
                        </span>
                      </div>
                    </div>

                    {reservation.notes && (
                      <p className="mt-2 text-sm text-slate-600 dark:text-slate-400 italic">
                        Nota: {reservation.notes}
                      </p>
                    )}

                    <p className="mt-2 text-xs text-slate-400 dark:text-slate-500">
                      Creada: {formatDate(reservation.createdAt)}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-2 lg:flex-col lg:items-end">
                    <button
                      onClick={() => openWhatsApp(reservation.buyerPhone, reservation)}
                      className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                    >
                      <Phone className="w-4 h-4" />
                      WhatsApp
                    </button>

                    {reservation.status === 'PENDING' && (
                      <>
                        <button
                          onClick={() => handleConfirm(reservation.id)}
                          disabled={updating === reservation.id}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <Check className="w-4 h-4" />
                          Confirmar
                        </button>
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          disabled={updating === reservation.id}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </>
                    )}

                    {reservation.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => handleComplete(reservation.id)}
                          disabled={updating === reservation.id}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <CheckCircle className="w-4 h-4" />
                          Completar
                        </button>
                        <button
                          onClick={() => handleCancel(reservation.id)}
                          disabled={updating === reservation.id}
                          className="flex items-center gap-1 px-3 py-1.5 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" />
                          Cancelar
                        </button>
                      </>
                    )}
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
