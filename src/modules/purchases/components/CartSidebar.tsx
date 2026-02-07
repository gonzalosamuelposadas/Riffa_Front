'use client'

import { useState } from 'react'
import { X, ShoppingCart, Trash2, CheckCircle } from 'lucide-react'
import { useCartStore } from '../store/cart'
import { formatPrice, cn } from '@shared'
import { CheckoutModal } from './CheckoutModal'

interface CartSidebarProps {
  pricePerNumber: number
  currency: string
  raffleName: string
  raffleId: string
  disabled?: boolean
}

export function CartSidebar({ pricePerNumber, currency, raffleName, raffleId, disabled = false }: CartSidebarProps) {
  const { selectedNumbers, removeNumber, clearCart } = useCartStore()
  const [isOpen, setIsOpen] = useState(false)
  const [showCheckout, setShowCheckout] = useState(false)

  const total = selectedNumbers.length * pricePerNumber

  if (selectedNumbers.length === 0) {
    return null
  }

  return (
    <>
      {/* Floating cart button (mobile) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-40 lg:hidden bg-amber-500 text-white p-4 rounded-full shadow-lg hover:bg-amber-600 transition-colors"
      >
        <ShoppingCart className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
          {selectedNumbers.length}
        </span>
      </button>

      {/* Sidebar (desktop always visible, mobile slide-in) */}
      <div
        className={cn(
          'fixed top-0 right-0 h-full w-80 bg-white dark:bg-slate-800 shadow-2xl z-50 transform transition-transform duration-300',
          'lg:translate-x-0 lg:relative lg:h-auto lg:shadow-lg lg:rounded-xl',
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        )}
      >
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-800 dark:bg-slate-900 text-white lg:rounded-t-xl">
          <div className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold">Tu Seleccion</h3>
          </div>
          <button onClick={() => setIsOpen(false)} className="lg:hidden hover:text-amber-400 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          <p className="text-sm text-gray-500 dark:text-slate-400 mb-3">{raffleName}</p>

          <div className="space-y-2">
            {selectedNumbers.map((num) => (
              <div
                key={num}
                className="flex items-center justify-between py-2 px-3 bg-gray-50 dark:bg-slate-700 rounded-lg"
              >
                <span className="font-mono font-bold text-lg dark:text-white">
                  #{num.toString().padStart(2, '0')}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-gray-600 dark:text-slate-300">{formatPrice(pricePerNumber, currency)}</span>
                  <button
                    onClick={() => removeNumber(num)}
                    className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700 bg-gray-50 dark:bg-slate-900 lg:rounded-b-xl">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 dark:text-slate-400">Total ({selectedNumbers.length} numeros)</span>
            <span className="text-2xl font-bold text-amber-600 dark:text-amber-400">{formatPrice(total, currency)}</span>
          </div>

          <button
            onClick={() => setShowCheckout(true)}
            disabled={disabled}
            className="w-full bg-amber-500 text-white py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-amber-500"
          >
            <CheckCircle className="w-5 h-5" />
            <span>{disabled ? 'Reserva no disponible' : 'Reservar numeros'}</span>
          </button>

          <button
            onClick={clearCart}
            className="w-full mt-2 text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 py-2 text-sm"
          >
            Limpiar seleccion
          </button>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Checkout Modal */}
      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        selectedNumbers={selectedNumbers}
        pricePerNumber={pricePerNumber}
        currency={currency}
        raffleName={raffleName}
        raffleId={raffleId}
      />
    </>
  )
}
