'use client'

import { useCallback } from 'react'
import { NumberCell } from './NumberCell'
import { useCartStore } from '@purchases'
import type { RaffleNumber } from '@shared'

interface NumberGridProps {
  numbers: RaffleNumber[]
  raffleId: string
  maxPerUser: number
  disabled?: boolean
}

export function NumberGrid({ numbers, raffleId, maxPerUser, disabled = false }: NumberGridProps) {
  const { selectedNumbers, addNumber, removeNumber, canAddMore } = useCartStore()

  const handleNumberClick = useCallback((number: number, status: string) => {
    if (disabled || status !== 'AVAILABLE') return

    if (selectedNumbers.includes(number)) {
      removeNumber(number)
    } else {
      addNumber(number, raffleId, maxPerUser)
    }
  }, [disabled, selectedNumbers, addNumber, removeNumber, raffleId, maxPerUser])

  // Sort numbers by number value
  const sortedNumbers = [...numbers].sort((a, b) => a.number - b.number)

  return (
    <div className="w-full">
      {/* Legend */}
      <div className="flex flex-wrap gap-4 mb-6 text-sm">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600" />
          <span className="text-gray-600 dark:text-slate-400">Disponible</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-500" />
          <span className="text-gray-600 dark:text-slate-400">Seleccionado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700" />
          <span className="text-gray-600 dark:text-slate-400">Reservado</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded bg-gray-100 dark:bg-slate-600 border-2 border-gray-300 dark:border-slate-500" />
          <span className="text-gray-600 dark:text-slate-400">Vendido</span>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 gap-2 sm:gap-3">
        {sortedNumbers.map((num) => (
          <NumberCell
            key={num.id}
            number={num.number}
            status={num.status}
            isSelected={selectedNumbers.includes(num.number)}
            disabled={disabled || (!canAddMore() && !selectedNumbers.includes(num.number))}
            onClick={() => handleNumberClick(num.number, num.status)}
          />
        ))}
      </div>
    </div>
  )
}
