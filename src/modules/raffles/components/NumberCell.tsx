'use client'

import { cn, type NumberStatus } from '@shared'

interface NumberCellProps {
  number: number
  status: NumberStatus
  isSelected: boolean
  disabled: boolean
  onClick: () => void
}

export function NumberCell({ number, status, isSelected, disabled, onClick }: NumberCellProps) {
  const baseClasses = 'w-12 h-12 sm:w-14 sm:h-14 rounded-lg font-bold text-sm sm:text-base transition-all duration-200 flex items-center justify-center cursor-pointer'

  const statusClasses: Record<string, string> = {
    AVAILABLE: isSelected
      ? 'bg-amber-500 text-white shadow-lg scale-105 ring-2 ring-amber-300 dark:ring-amber-600'
      : 'bg-white dark:bg-slate-700 border-2 border-gray-200 dark:border-slate-600 hover:border-amber-400 dark:hover:border-amber-500 hover:shadow-md text-gray-700 dark:text-slate-200',
    RESERVED: 'bg-amber-100 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-700 text-amber-700 dark:text-amber-400 cursor-not-allowed',
    SOLD: 'bg-gray-100 dark:bg-slate-600 border-2 border-gray-300 dark:border-slate-500 text-gray-400 dark:text-slate-500 cursor-not-allowed line-through'
  }

  return (
    <button
      onClick={onClick}
      disabled={disabled || status !== 'AVAILABLE'}
      className={cn(
        baseClasses,
        statusClasses[status],
        disabled && status === 'AVAILABLE' && !isSelected && 'opacity-50 cursor-not-allowed'
      )}
      title={
        status === 'SOLD'
          ? 'Vendido'
          : status === 'RESERVED'
          ? 'Reservado'
          : isSelected
          ? 'Haz clic para deseleccionar'
          : 'Haz clic para seleccionar'
      }
    >
      {number.toString().padStart(2, '0')}
    </button>
  )
}
