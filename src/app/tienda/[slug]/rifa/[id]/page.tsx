'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Ticket, Calendar, Users, Clock, Gift, ShoppingCart } from 'lucide-react'
import { api } from '@shared'
import { useAuth } from '@/modules/auth'
import toast from 'react-hot-toast'

interface RaffleDetail {
  id: string
  title: string
  description: string
  prize: string
  prizeImage: string | null
  ticketPrice: number
  totalTickets: number
  soldTickets: number
  drawDate: string
  status: string
  store: {
    id: string
    name: string
    slug: string
  }
  availableTickets: number[]
}

export default function RifaDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { user, isAuthenticated } = useAuth()
  const slug = params.slug as string
  const id = params.id as string

  const [raffle, setRaffle] = useState<RaffleDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedTickets, setSelectedTickets] = useState<number[]>([])
  const [purchasing, setPurchasing] = useState(false)

  useEffect(() => {
    const fetchRaffle = async () => {
      try {
        const { data } = await api.get<RaffleDetail>(`/raffles/${id}/public`)
        setRaffle(data)
      } catch (error) {
        console.error('Error fetching raffle:', error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchRaffle()
    }
  }, [id])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  const getTimeRemaining = (drawDate: string) => {
    const now = new Date()
    const draw = new Date(drawDate)
    const diff = draw.getTime() - now.getTime()

    if (diff <= 0) return 'Sorteo finalizado'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))

    if (days > 0) return `${days}d ${hours}h restantes`
    if (hours > 0) return `${hours}h ${minutes}m restantes`
    return `${minutes} minutos restantes`
  }

  const toggleTicket = (ticketNumber: number) => {
    setSelectedTickets((prev) =>
      prev.includes(ticketNumber)
        ? prev.filter((t) => t !== ticketNumber)
        : [...prev, ticketNumber]
    )
  }

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      router.push(`/login?redirect=/tienda/${slug}/rifa/${id}`)
      return
    }

    if (selectedTickets.length === 0) {
      toast.error('Selecciona al menos un boleto')
      return
    }

    setPurchasing(true)
    try {
      await api.post('/purchases', {
        raffleId: id,
        ticketNumbers: selectedTickets,
      })
      toast.success('Compra realizada exitosamente')
      router.push('/mi-cuenta')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al realizar la compra')
    } finally {
      setPurchasing(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-6 w-32 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl mb-6" />
          <div className="h-8 w-64 bg-slate-200 dark:bg-slate-700 rounded mb-4" />
          <div className="h-4 w-full bg-slate-200 dark:bg-slate-700 rounded mb-2" />
          <div className="h-4 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
        </div>
      </div>
    )
  }

  if (!raffle) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <Ticket className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-2">
            Rifa no encontrada
          </h1>
          <Link
            href={`/tienda/${slug}`}
            className="text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            Volver a la tienda
          </Link>
        </div>
      </div>
    )
  }

  const isActive = raffle.status === 'ACTIVE'
  const progress = (raffle.soldTickets / raffle.totalTickets) * 100

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Back link */}
      <Link
        href={`/tienda/${slug}`}
        className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        Volver a rifas
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image */}
        <div className="bg-white dark:bg-slate-800 rounded-xl overflow-hidden">
          {raffle.prizeImage ? (
            <img
              src={raffle.prizeImage}
              alt={raffle.prize}
              className="w-full aspect-square object-cover"
            />
          ) : (
            <div className="w-full aspect-square bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
              <Gift className="w-24 h-24 text-slate-300 dark:text-slate-600" />
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="mb-4">
            <span
              className={`inline-block px-3 py-1 text-sm font-medium rounded-full ${
                isActive
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
              }`}
            >
              {isActive ? 'Activa' : raffle.status}
            </span>
          </div>

          <h1 className="text-3xl font-bold text-slate-800 dark:text-white mb-2">
            {raffle.title}
          </h1>

          <p className="text-slate-600 dark:text-slate-300 mb-6">
            {raffle.description}
          </p>

          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-3">
              <Gift className="w-8 h-8 text-amber-600 dark:text-amber-400" />
              <div>
                <p className="text-sm text-amber-700 dark:text-amber-300">Premio</p>
                <p className="font-bold text-amber-800 dark:text-amber-200">
                  {raffle.prize}
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4 mb-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Calendar className="w-5 h-5" />
                <span>Fecha del sorteo</span>
              </div>
              <span className="font-medium text-slate-800 dark:text-white">
                {formatDate(raffle.drawDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Clock className="w-5 h-5" />
                <span>Tiempo restante</span>
              </div>
              <span className="font-medium text-amber-600 dark:text-amber-400">
                {getTimeRemaining(raffle.drawDate)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                <Users className="w-5 h-5" />
                <span>Boletos vendidos</span>
              </div>
              <span className="font-medium text-slate-800 dark:text-white">
                {raffle.soldTickets} / {raffle.totalTickets}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mb-6">
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-500 rounded-full transition-all"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 text-right">
              {progress.toFixed(1)}% vendido
            </p>
          </div>

          {/* Price */}
          <div className="flex items-center justify-between mb-6">
            <span className="text-slate-600 dark:text-slate-400">Precio por boleto</span>
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {formatCurrency(raffle.ticketPrice)}
            </span>
          </div>
        </div>
      </div>

      {/* Ticket Selection */}
      {isActive && raffle.availableTickets && raffle.availableTickets.length > 0 && (
        <div className="mt-8 bg-white dark:bg-slate-800 rounded-xl p-6">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-4">
            Selecciona tus boletos
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            {raffle.availableTickets.length} boletos disponibles
          </p>

          <div className="grid grid-cols-10 gap-2 mb-6 max-h-64 overflow-y-auto p-2">
            {Array.from({ length: raffle.totalTickets }, (_, i) => i + 1).map((num) => {
              const isAvailable = raffle.availableTickets.includes(num)
              const isSelected = selectedTickets.includes(num)

              return (
                <button
                  key={num}
                  onClick={() => isAvailable && toggleTicket(num)}
                  disabled={!isAvailable}
                  className={`
                    aspect-square rounded-lg text-sm font-medium transition-all
                    ${
                      isSelected
                        ? 'bg-amber-500 text-white ring-2 ring-amber-300'
                        : isAvailable
                        ? 'bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-white hover:bg-amber-100 dark:hover:bg-amber-900/30'
                        : 'bg-slate-200 dark:bg-slate-600 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                    }
                  `}
                >
                  {num}
                </button>
              )
            })}
          </div>

          {/* Purchase summary */}
          {selectedTickets.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-slate-600 dark:text-slate-400">
                    {selectedTickets.length} boleto(s) seleccionado(s)
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Boletos: {selectedTickets.sort((a, b) => a - b).join(', ')}
                  </p>
                </div>
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {formatCurrency(selectedTickets.length * raffle.ticketPrice)}
                </p>
              </div>

              <button
                onClick={handlePurchase}
                disabled={purchasing}
                className="w-full py-3 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingCart className="w-5 h-5" />
                {purchasing ? 'Procesando...' : 'Comprar boletos'}
              </button>

              {!isAuthenticated && (
                <p className="text-sm text-slate-500 dark:text-slate-400 text-center mt-2">
                  Debes iniciar sesión para comprar
                </p>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  )
}
