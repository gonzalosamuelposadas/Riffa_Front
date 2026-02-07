'use client'

import Link from 'next/link'
import { Trophy, Gift, Hash, User, Calendar, Loader2 } from 'lucide-react'
import { Header, formatPrice } from '@shared'
import { UserNavMenu } from '@/modules/user-auth/components/UserNavMenu'
import { useWinners } from '@raffles'

export default function GanadoresPage() {
  const { data: winners, isLoading, error } = useWinners()

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Header>
        <UserNavMenu />
      </Header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-amber-500 to-amber-600 text-white">
        <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 text-center">
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Trophy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Historial de Ganadores
          </h1>
          <p className="text-amber-100 max-w-xl mx-auto">
            Conoce a los afortunados ganadores de nuestras rifas
          </p>
        </div>
      </section>

      {/* Winners List */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
          </div>
        ) : error ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
            <p className="text-red-500">Error al cargar los ganadores</p>
          </div>
        ) : !winners || winners.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
            <Trophy className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-400 dark:text-slate-500 mb-2">
              Aun no hay ganadores
            </h3>
            <p className="text-slate-500 dark:text-slate-400 mb-6">
              Se el primero en ganar participando en nuestras rifas
            </p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-3 rounded-lg font-medium hover:bg-amber-600 transition-colors"
            >
              Ver rifas activas
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {winners.map((winner) => (
              <div
                key={winner.id}
                className="bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden border border-slate-100 dark:border-slate-700"
              >
                {/* Prize Image / Placeholder */}
                <div className="h-40 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative">
                  {winner.prizeImage ? (
                    <img
                      src={winner.prizeImage}
                      alt={winner.prize}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Gift className="w-16 h-16 text-amber-400/80" />
                  )}
                  <div className="absolute top-3 right-3 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full flex items-center gap-1">
                    <Trophy className="w-3 h-3" />
                    Ganador
                  </div>
                </div>

                <div className="p-5">
                  {/* Raffle Name */}
                  <h3 className="text-lg font-bold text-slate-800 dark:text-white mb-1">
                    {winner.raffleName}
                  </h3>

                  {/* Prize */}
                  <p className="text-amber-600 dark:text-amber-400 font-semibold text-sm mb-4">
                    {winner.prize}
                  </p>

                  {/* Winner Info */}
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Hash className="w-4 h-4 text-amber-500" />
                      <span>Numero ganador:</span>
                      <span className="font-bold text-slate-800 dark:text-white">#{winner.winningNumber}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <User className="w-4 h-4 text-amber-500" />
                      <span>Ganador:</span>
                      <span className="font-bold text-slate-800 dark:text-white">{winner.winnerName}</span>
                    </div>

                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4 text-amber-500" />
                      <span>Fecha:</span>
                      <span className="font-medium text-slate-700 dark:text-slate-300">
                        {new Date(winner.completedAt).toLocaleDateString('es-MX', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </main>
  )
}
