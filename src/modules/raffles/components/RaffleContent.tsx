'use client'

import { useEffect } from 'react'
import { AlertTriangle, Loader2, Trophy, Hash, User } from 'lucide-react'
import { RaffleHeader } from './RaffleHeader'
import { NumberGrid } from './NumberGrid'
import { CartSidebar, useCartStore } from '@purchases'
import { useRaffle } from '../hooks/useRaffles'

const statusMessages: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'Esta rifa aun no esta disponible para compra', color: 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-400' },
  COMPLETED: { label: 'Esta rifa ya ha finalizado', color: 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-400' },
  CANCELLED: { label: 'Esta rifa ha sido cancelada', color: 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-400' }
}

interface RaffleContentProps {
  raffleId: string
}

export function RaffleContent({ raffleId }: RaffleContentProps) {
  const { data: raffle, isLoading, error } = useRaffle(raffleId)
  const { raffleId: cartRaffleId, clearCart } = useCartStore()

  // Clear cart when navigating to a different raffle
  useEffect(() => {
    if (cartRaffleId && cartRaffleId !== raffleId) {
      clearCart()
    }
  }, [raffleId, cartRaffleId, clearCart])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error || !raffle) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-8 text-center">
          <AlertTriangle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-700 dark:text-red-400 mb-2">Error al cargar la rifa</h2>
          <p className="text-red-600 dark:text-red-300">No se pudo cargar la informacion de la rifa.</p>
        </div>
      </div>
    )
  }

  const availableCount = raffle.numbers?.filter(n => n.status === 'AVAILABLE').length || 0
  const soldCount = raffle.numbers?.filter(n => n.status === 'SOLD').length || 0
  const isActive = raffle.status === 'ACTIVE'
  const statusMessage = statusMessages[raffle.status]

  return (
    <>
      {/* Status Banner */}
      {!isActive && statusMessage && (
        <div className={`border-b ${statusMessage.color}`}>
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-medium">{statusMessage.label}</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="lg:grid lg:grid-cols-3 lg:gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            <RaffleHeader
              raffle={raffle}
              availableCount={availableCount}
              soldCount={soldCount}
            />

            {/* Winner Section - Only show for completed raffles with a winner */}
            {raffle.status === 'COMPLETED' && raffle.winningNumber && (
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl shadow-lg p-6 text-white">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
                    <Trophy className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold">Sorteo Realizado</h2>
                    <p className="text-amber-100 text-sm">Esta rifa ya tiene un ganador</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 mt-6">
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-100 text-sm mb-2">
                      <Hash className="w-4 h-4" />
                      <span>Numero Ganador</span>
                    </div>
                    <p className="text-4xl font-bold">#{raffle.winningNumber}</p>
                  </div>
                  <div className="bg-white/10 rounded-xl p-4 text-center">
                    <div className="flex items-center justify-center gap-2 text-amber-100 text-sm mb-2">
                      <User className="w-4 h-4" />
                      <span>Ganador</span>
                    </div>
                    <p className="text-xl font-bold truncate">
                      {raffle.winner?.name || 'Comprador externo'}
                    </p>
                  </div>
                </div>

                {raffle.completedAt && (
                  <p className="text-amber-100 text-sm text-center mt-4">
                    Sorteo realizado el {new Date(raffle.completedAt).toLocaleDateString('es-MX', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                )}
              </div>
            )}

            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg p-6">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-4">
                Selecciona tus numeros
              </h2>
              <NumberGrid
                numbers={raffle.numbers || []}
                raffleId={raffle.id}
                maxPerUser={raffle.maxPerUser}
                disabled={!isActive}
              />
            </div>
          </div>

          {/* Sidebar - Cart */}
          <div className="hidden lg:block">
            <div className="sticky top-24">
              <CartSidebar
                pricePerNumber={raffle.price}
                currency={raffle.currency}
                raffleName={raffle.name}
                raffleId={raffle.id}
                disabled={!isActive}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Mobile cart */}
      <div className="lg:hidden">
        <CartSidebar
          pricePerNumber={raffle.price}
          currency={raffle.currency}
          raffleName={raffle.name}
          raffleId={raffle.id}
          disabled={!isActive}
        />
      </div>
    </>
  )
}
