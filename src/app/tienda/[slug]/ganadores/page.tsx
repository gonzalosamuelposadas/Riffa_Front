'use client'

import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { Trophy, Gift, Calendar, Ticket } from 'lucide-react'
import { api } from '@shared'

interface Winner {
  id: string
  raffle: {
    id: string
    title: string
    prize: string
    prizeImage: string | null
    drawDate: string
  }
  winningTicket: number
  user: {
    name: string
  }
  wonAt: string
}

export default function GanadoresPage() {
  const params = useParams()
  const slug = params.slug as string
  const [winners, setWinners] = useState<Winner[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchWinners = async () => {
      try {
        const { data } = await api.get<Winner[]>(`/stores/${slug}/winners`)
        setWinners(data)
      } catch (error) {
        console.error('Error fetching winners:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchWinners()
    }
  }, [slug])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('es-MX', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    })
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-8">
        <div className="p-3 bg-amber-100 dark:bg-amber-900/30 rounded-xl">
          <Trophy className="w-8 h-8 text-amber-600 dark:text-amber-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Ganadores
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Historial de ganadores de nuestras rifas
          </p>
        </div>
      </div>

      {winners.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <Trophy className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            Sin ganadores aún
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Los ganadores aparecerán aquí cuando se realicen los sorteos
          </p>
          <Link
            href={`/tienda/${slug}`}
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <Ticket className="w-4 h-4" />
            Ver rifas activas
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {winners.map((winner) => (
            <div
              key={winner.id}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden"
            >
              <div className="flex items-stretch">
                {/* Image */}
                <div className="w-32 h-32 flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                  {winner.raffle.prizeImage ? (
                    <img
                      src={winner.raffle.prizeImage}
                      alt={winner.raffle.prize}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Gift className="w-8 h-8 text-slate-300 dark:text-slate-600" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 p-4 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-white mb-1">
                      {winner.raffle.title}
                    </h3>
                    <p className="text-sm text-amber-600 dark:text-amber-400">
                      Premio: {winner.raffle.prize}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-2">
                        <Trophy className="w-4 h-4 text-amber-500" />
                        <span className="text-sm font-medium text-slate-800 dark:text-white">
                          {winner.user.name}
                        </span>
                      </div>
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        Boleto #{winner.winningTicket}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(winner.wonAt)}</span>
                    </div>
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
