'use client'

import Image from 'next/image'
import { Calendar, Gift, DollarSign } from 'lucide-react'
import { formatPrice, formatDate, type Raffle } from '@shared'

interface RaffleHeaderProps {
  raffle: Raffle
  availableCount: number
  soldCount: number
}

export function RaffleHeader({ raffle, availableCount, soldCount }: RaffleHeaderProps) {
  const progress = (soldCount / raffle.totalNumbers) * 100

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg overflow-hidden">
      {/* Prize Image */}
      {raffle.prizeImage && (
        <div className="relative h-48 sm:h-64 w-full bg-gradient-to-br from-slate-700 to-slate-800">
          <Image
            src={raffle.prizeImage}
            alt={raffle.prize}
            fill
            className="object-cover opacity-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute bottom-4 left-4 right-4">
            <span className="inline-block px-3 py-1 bg-amber-500/80 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-2">
              Premio
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold text-white">{raffle.prize}</h2>
          </div>
        </div>
      )}

      {!raffle.prizeImage && (
        <div className="h-48 sm:h-64 w-full bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center">
          <div className="text-center text-white">
            <Gift className="w-16 h-16 mx-auto mb-4 text-amber-400" />
            <span className="text-sm text-amber-400">Premio</span>
            <h2 className="text-2xl sm:text-3xl font-bold">{raffle.prize}</h2>
          </div>
        </div>
      )}

      {/* Info */}
      <div className="p-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 dark:text-white mb-2">{raffle.name}</h1>

        {raffle.description && (
          <p className="text-gray-600 dark:text-slate-300 mb-4">{raffle.description}</p>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6">
          <div className="bg-amber-50 dark:bg-amber-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-1">
              <DollarSign className="w-4 h-4" />
              <span className="text-sm font-medium">Precio</span>
            </div>
            <p className="text-xl font-bold text-amber-700 dark:text-amber-300">{formatPrice(raffle.price, raffle.currency)}</p>
          </div>

          {raffle.drawDate && (
            <div className="bg-slate-100 dark:bg-slate-700 rounded-xl p-4">
              <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300 mb-1">
                <Calendar className="w-4 h-4" />
                <span className="text-sm font-medium">Sorteo</span>
              </div>
              <p className="text-sm font-bold text-slate-700 dark:text-slate-200">{formatDate(raffle.drawDate)}</p>
            </div>
          )}

          <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-4">
            <div className="flex items-center gap-2 text-green-600 dark:text-green-400 mb-1">
              <Gift className="w-4 h-4" />
              <span className="text-sm font-medium">Disponibles</span>
            </div>
            <p className="text-xl font-bold text-green-700 dark:text-green-300">{availableCount}</p>
          </div>
        </div>

        {/* Progress bar */}
        <div className="mb-2">
          <div className="flex justify-between text-sm text-gray-600 dark:text-slate-400 mb-1">
            <span>Progreso de venta</span>
            <span>{soldCount} de {raffle.totalNumbers} vendidos</span>
          </div>
          <div className="h-3 bg-gray-200 dark:bg-slate-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-amber-400 to-amber-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <p className="text-sm text-gray-500 dark:text-slate-400 text-center">
          Maximo {raffle.maxPerUser} numeros por persona
        </p>
      </div>
    </div>
  )
}
