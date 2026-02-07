'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { Ticket, Calendar, Users, Clock } from 'lucide-react'
import { api } from '@shared'

interface PublicRaffle {
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
}

export default function TiendaPage() {
  const params = useParams()
  const slug = params.slug as string
  const [raffles, setRaffles] = useState<PublicRaffle[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchRaffles = async () => {
      try {
        const { data } = await api.get<PublicRaffle[]>(`/stores/${slug}/raffles`)
        setRaffles(data)
      } catch (error) {
        console.error('Error fetching raffles:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchRaffles()
    }
  }, [slug])

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
    })
  }

  const getTimeRemaining = (drawDate: string) => {
    const now = new Date()
    const draw = new Date(drawDate)
    const diff = draw.getTime() - now.getTime()

    if (diff <= 0) return 'Sorteo finalizado'

    const days = Math.floor(diff / (1000 * 60 * 60 * 24))
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))

    if (days > 0) return `${days} días restantes`
    return `${hours} horas restantes`
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-80 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const activeRaffles = raffles.filter((r) => r.status === 'ACTIVE')
  const upcomingRaffles = raffles.filter((r) => r.status === 'PENDING')

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Active Raffles */}
      <section className="mb-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Rifas Activas
        </h2>

        {activeRaffles.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
            <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
              No hay rifas activas
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Vuelve pronto para ver nuevas rifas
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {activeRaffles.map((raffle) => (
              <Link
                key={raffle.id}
                href={`/tienda/${slug}/rifa/${raffle.id}`}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group"
              >
                {/* Image */}
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                  {raffle.prizeImage ? (
                    <img
                      src={raffle.prizeImage}
                      alt={raffle.prize}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-green-500 text-white text-xs font-medium rounded-full">
                    Activa
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                    {raffle.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                    {raffle.description}
                  </p>

                  <div className="flex items-center justify-between text-sm mb-3">
                    <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
                      <Users className="w-4 h-4" />
                      <span>{raffle.soldTickets}/{raffle.totalTickets}</span>
                    </div>
                    <div className="flex items-center gap-1 text-amber-600 dark:text-amber-400">
                      <Clock className="w-4 h-4" />
                      <span>{getTimeRemaining(raffle.drawDate)}</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full h-2 bg-slate-100 dark:bg-slate-700 rounded-full mb-3 overflow-hidden">
                    <div
                      className="h-full bg-amber-500 rounded-full transition-all"
                      style={{ width: `${(raffle.soldTickets / raffle.totalTickets) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-amber-600 dark:text-amber-400">
                      {formatCurrency(raffle.ticketPrice)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      por boleto
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Raffles */}
      {upcomingRaffles.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
            Próximas Rifas
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingRaffles.map((raffle) => (
              <div
                key={raffle.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden opacity-75"
              >
                {/* Image */}
                <div className="aspect-video bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
                  {raffle.prizeImage ? (
                    <img
                      src={raffle.prizeImage}
                      alt={raffle.prize}
                      className="w-full h-full object-cover grayscale"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Ticket className="w-12 h-12 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                  <div className="absolute top-3 right-3 px-2 py-1 bg-slate-500 text-white text-xs font-medium rounded-full">
                    Próximamente
                  </div>
                </div>

                {/* Content */}
                <div className="p-4">
                  <h3 className="font-bold text-slate-800 dark:text-white mb-1">
                    {raffle.title}
                  </h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mb-3 line-clamp-2">
                    {raffle.description}
                  </p>

                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <Calendar className="w-4 h-4" />
                    <span>Sorteo: {formatDate(raffle.drawDate)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
