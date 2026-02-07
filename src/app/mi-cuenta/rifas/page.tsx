'use client'

import Link from 'next/link'
import { AlertCircle, Ticket, ChevronRight, Calendar, Trophy } from 'lucide-react'
import { Loading } from '@shared'
import { useUserRaffles } from '@/modules/user-auth'

interface RaffleWithPurchases {
  id: string
  name: string
  description: string | null
  prize: string
  prizeImage: string | null
  status: 'DRAFT' | 'ACTIVE' | 'COMPLETED' | 'CANCELLED'
  drawDate: string | null
  purchases: {
    id: string
    status: string
    numbers: { number: number }[]
  }[]
}

function getStatusBadge(status: string) {
  const styles = {
    ACTIVE: 'bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400',
    COMPLETED: 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300',
    CANCELLED: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400',
    DRAFT: 'bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400'
  }

  const labels = {
    ACTIVE: 'Activa',
    COMPLETED: 'Finalizada',
    CANCELLED: 'Cancelada',
    DRAFT: 'Borrador'
  }

  return (
    <span className={`text-xs px-2 py-1 rounded-full ${styles[status as keyof typeof styles] || styles.DRAFT}`}>
      {labels[status as keyof typeof labels] || status}
    </span>
  )
}

export default function MisRifasPage() {
  const { data: raffles, isLoading, error } = useUserRaffles()

  if (isLoading) {
    return <Loading size="lg" text="Cargando rifas..." />
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Error al cargar las rifas</h3>
        <p className="text-red-600 dark:text-red-400 mt-1">Por favor intenta de nuevo mas tarde</p>
      </div>
    )
  }

  const rafflesList = raffles as RaffleWithPurchases[]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Mis Rifas</h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">Todas las rifas en las que has participado</p>
        </div>
        <Link
          href="/mi-cuenta"
          className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300"
        >
          Volver al dashboard
        </Link>
      </div>

      {rafflesList.length === 0 ? (
        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No has participado en ninguna rifa</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-4">Explora las rifas disponibles y participa!</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Ver rifas disponibles
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {rafflesList.map((raffle) => {
            const allNumbers = raffle.purchases.flatMap((p) => p.numbers.map((n) => n.number))

            return (
              <Link
                key={raffle.id}
                href={`/rifa/${raffle.id}`}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all"
              >
                <div className="flex">
                  {raffle.prizeImage && (
                    <div className="w-32 h-32 flex-shrink-0 bg-slate-100 dark:bg-slate-700">
                      <img
                        src={raffle.prizeImage}
                        alt={raffle.prize}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-900 dark:text-white">{raffle.name}</h3>
                      {getStatusBadge(raffle.status)}
                    </div>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{raffle.prize}</p>

                    {raffle.status === 'COMPLETED' && (
                      <div className="mt-2 flex items-center gap-1 text-amber-600 dark:text-amber-400">
                        <Trophy className="w-4 h-4" />
                        <span className="text-sm font-medium">Sorteo realizado</span>
                      </div>
                    )}

                    {raffle.drawDate && raffle.status === 'ACTIVE' && (
                      <div className="mt-2 flex items-center gap-1 text-slate-500 dark:text-slate-400 text-sm">
                        <Calendar className="w-4 h-4" />
                        {new Date(raffle.drawDate).toLocaleDateString('es-MX', {
                          month: 'long',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </div>
                    )}

                    <div className="mt-3">
                      <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                        {allNumbers.length} numeros
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-1">
                      {allNumbers.slice(0, 8).map((num) => (
                        <span
                          key={num}
                          className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded"
                        >
                          #{num}
                        </span>
                      ))}
                      {allNumbers.length > 8 && (
                        <span className="text-xs text-slate-400 dark:text-slate-500">
                          +{allNumbers.length - 8} mas
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
