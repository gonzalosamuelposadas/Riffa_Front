'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Package,
  Clock,
  Check,
  CheckCircle,
  XCircle,
  Star,
  Phone,
  Loader2,
  X,
} from 'lucide-react'
import { api, formatPrice } from '@shared'
import { useAuth } from '@auth'
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
    store: {
      name: string
      slug: string
      whatsapp?: string | null
    }
  }
  variant: {
    id: string
    name: string
    price: number | null
  } | null
  review: {
    id: string
    rating: number
    title: string | null
    comment: string | null
  } | null
}

const statusConfig = {
  PENDING: {
    label: 'Pendiente',
    description: 'Esperando confirmación del vendedor',
    color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300',
    icon: Clock,
  },
  CONFIRMED: {
    label: 'Confirmada',
    description: 'El vendedor confirmó tu reserva',
    color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300',
    icon: Check,
  },
  COMPLETED: {
    label: 'Completada',
    description: 'Entrega finalizada',
    color: 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300',
    icon: CheckCircle,
  },
  CANCELLED: {
    label: 'Cancelada',
    description: 'Reserva cancelada',
    color: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300',
    icon: XCircle,
  },
}

export default function MisReservasPage() {
  const { isLoading: authLoading, isAuthenticated } = useAuth()
  const [reservations, setReservations] = useState<Reservation[]>([])
  const [loading, setLoading] = useState(true)
  const [cancelling, setCancelling] = useState<string | null>(null)

  // Review modal state
  const [showReviewModal, setShowReviewModal] = useState(false)
  const [reviewingReservation, setReviewingReservation] = useState<Reservation | null>(null)
  const [reviewRating, setReviewRating] = useState(5)
  const [reviewTitle, setReviewTitle] = useState('')
  const [reviewComment, setReviewComment] = useState('')
  const [submittingReview, setSubmittingReview] = useState(false)

  const fetchReservations = async () => {
    try {
      const { data } = await api.get<Reservation[]>('/reservations/my')
      setReservations(data)
    } catch (error) {
      console.error('Error fetching reservations:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    // Wait for auth to be ready before fetching
    if (!authLoading && isAuthenticated) {
      fetchReservations()
    } else if (!authLoading && !isAuthenticated) {
      setLoading(false)
    }
  }, [authLoading, isAuthenticated])

  const handleCancel = async (id: string) => {
    if (!confirm('¿Cancelar esta reserva?')) {
      return
    }

    setCancelling(id)
    try {
      await api.delete(`/reservations/${id}`)
      toast.success('Reserva cancelada')
      fetchReservations()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al cancelar')
    } finally {
      setCancelling(null)
    }
  }

  const openReviewModal = (reservation: Reservation) => {
    setReviewingReservation(reservation)
    setReviewRating(5)
    setReviewTitle('')
    setReviewComment('')
    setShowReviewModal(true)
  }

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!reviewingReservation) return

    setSubmittingReview(true)
    try {
      await api.post('/reviews', {
        productId: reviewingReservation.product.id,
        reservationId: reviewingReservation.id,
        rating: reviewRating,
        title: reviewTitle.trim() || undefined,
        comment: reviewComment.trim() || undefined,
      })

      toast.success('Gracias por tu opinión')
      setShowReviewModal(false)
      fetchReservations()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al enviar opinión')
    } finally {
      setSubmittingReview(false)
    }
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    })
  }

  if (loading || authLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Mis Reservas de Productos
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Aquí puedes ver el estado de tus reservas
        </p>
      </div>

      {reservations.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            No tienes reservas
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Explora los productos de las tiendas y realiza tu primera reserva
          </p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            Explorar tiendas
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {reservations.map((reservation) => {
            const StatusIcon = statusConfig[reservation.status].icon
            const unitPrice = reservation.variant?.price || reservation.product.price
            const total = unitPrice * reservation.quantity
            const canCancel = reservation.status === 'PENDING'
            const canReview = reservation.status === 'COMPLETED' && !reservation.review

            return (
              <div
                key={reservation.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden"
              >
                <div className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Product image */}
                    <Link
                      href={`/tienda/${reservation.product.store.slug}/productos/${reservation.product.slug}`}
                      className="w-full sm:w-24 h-24 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0"
                    >
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
                    </Link>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div>
                          <Link
                            href={`/tienda/${reservation.product.store.slug}/productos/${reservation.product.slug}`}
                            className="font-semibold text-slate-800 dark:text-white hover:text-amber-600 dark:hover:text-amber-400"
                          >
                            {reservation.product.name}
                          </Link>
                          {reservation.variant && (
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              Variante: {reservation.variant.name}
                            </p>
                          )}
                          <p className="text-sm text-slate-500 dark:text-slate-400">
                            Tienda:{' '}
                            <Link
                              href={`/tienda/${reservation.product.store.slug}`}
                              className="hover:text-amber-600 dark:hover:text-amber-400"
                            >
                              {reservation.product.store.name}
                            </Link>
                          </p>
                        </div>

                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 text-xs rounded-full ${statusConfig[reservation.status].color}`}
                        >
                          <StatusIcon className="w-3.5 h-3.5" />
                          {statusConfig[reservation.status].label}
                        </span>
                      </div>

                      <div className="mt-3 flex flex-wrap gap-x-6 gap-y-1 text-sm">
                        <span className="text-slate-600 dark:text-slate-300">
                          Cantidad: <strong>{reservation.quantity}</strong>
                        </span>
                        <span className="text-slate-600 dark:text-slate-300">
                          Total:{' '}
                          <strong className="text-amber-600 dark:text-amber-400">
                            {formatPrice(total)}
                          </strong>
                        </span>
                        <span className="text-slate-400 dark:text-slate-500">
                          Fecha: {formatDate(reservation.createdAt)}
                        </span>
                      </div>

                      <p className="mt-2 text-xs text-slate-500 dark:text-slate-400">
                        {statusConfig[reservation.status].description}
                      </p>

                      {/* Review shown */}
                      {reservation.review && (
                        <div className="mt-3 p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-xs text-slate-500 dark:text-slate-400">Tu opinión:</span>
                            <div className="flex items-center">
                              {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                  key={star}
                                  className={`w-3 h-3 ${
                                    star <= reservation.review!.rating
                                      ? 'text-amber-400 fill-amber-400'
                                      : 'text-slate-300 dark:text-slate-600'
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          {reservation.review.comment && (
                            <p className="text-sm text-slate-600 dark:text-slate-300">
                              {reservation.review.comment}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 flex flex-wrap gap-2">
                    {reservation.product.store.whatsapp && (
                      <a
                        href={`https://wa.me/${reservation.product.store.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, tengo una pregunta sobre mi reserva de "${reservation.product.name}"`)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
                      >
                        <Phone className="w-4 h-4" />
                        Contactar
                      </a>
                    )}

                    {canCancel && (
                      <button
                        onClick={() => handleCancel(reservation.id)}
                        disabled={cancelling === reservation.id}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm border border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {cancelling === reservation.id ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <X className="w-4 h-4" />
                        )}
                        Cancelar
                      </button>
                    )}

                    {canReview && (
                      <button
                        onClick={() => openReviewModal(reservation)}
                        className="flex items-center gap-1 px-3 py-1.5 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
                      >
                        <Star className="w-4 h-4" />
                        Dejar opinión
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && reviewingReservation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-slate-800 dark:text-white">
                  Dejar opinión
                </h3>
                <button
                  onClick={() => setShowReviewModal(false)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                ¿Qué te pareció <strong>{reviewingReservation.product.name}</strong>?
              </p>

              <form onSubmit={handleSubmitReview} className="space-y-4">
                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Calificación
                  </label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setReviewRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-8 h-8 transition-colors ${
                            star <= reviewRating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-slate-300 dark:text-slate-600 hover:text-amber-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Título (opcional)
                  </label>
                  <input
                    type="text"
                    value={reviewTitle}
                    onChange={(e) => setReviewTitle(e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    placeholder="Ej: Excelente producto"
                  />
                </div>

                {/* Comment */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                    Comentario (opcional)
                  </label>
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    placeholder="Cuéntanos tu experiencia..."
                  />
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={() => setShowReviewModal(false)}
                    className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    disabled={submittingReview}
                    className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50"
                  >
                    {submittingReview ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      'Enviar'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
