'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { X, CheckCircle, User, Mail, Phone, AlertCircle } from 'lucide-react'
import toast from 'react-hot-toast'
import { checkoutSchema, type CheckoutFormData, Input, Loading, formatPrice } from '@shared'
import { useCartStore } from '../store/cart'
import { useCreatePurchase } from '../hooks/usePurchases'
import { useAuth } from '@auth'

interface CheckoutModalProps {
  isOpen: boolean
  onClose: () => void
  selectedNumbers: number[]
  pricePerNumber: number
  currency: string
  raffleName: string
  raffleId: string
}

export function CheckoutModal({
  isOpen,
  onClose,
  selectedNumbers,
  pricePerNumber,
  currency,
  raffleName,
  raffleId
}: CheckoutModalProps) {
  const [serverError, setServerError] = useState('')
  const [isSuccess, setIsSuccess] = useState(false)
  const [reservedNumbers, setReservedNumbers] = useState<number[]>([])
  const { clearCart } = useCartStore()
  const createPurchase = useCreatePurchase()
  const { user, isAuthenticated } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    setValue
  } = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      buyerName: '',
      buyerEmail: '',
      buyerPhone: ''
    }
  })

  // Pre-fill form with user data if authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      setValue('buyerName', user.name)
      setValue('buyerEmail', user.email)
      if (user.phone) {
        setValue('buyerPhone', user.phone)
      }
    }
  }, [isAuthenticated, user, setValue])

  const total = selectedNumbers.length * pricePerNumber

  const onSubmit = async (data: CheckoutFormData) => {
    setServerError('')
    toast.loading('Procesando reserva...', { id: 'purchase' })

    createPurchase.mutate(
      {
        raffleId,
        numbers: selectedNumbers,
        buyerInfo: data,
        userId: isAuthenticated && user ? user.id : undefined
      },
      {
        onSuccess: () => {
          toast.dismiss('purchase')
          toast.success('Reserva realizada exitosamente')
          setReservedNumbers([...selectedNumbers])
          clearCart()
          setIsSuccess(true)
        },
        onError: (error: Error) => {
          toast.dismiss('purchase')
          setServerError(error.message)
          toast.error(error.message)
        },
      }
    )
  }

  const handleClose = () => {
    reset()
    setServerError('')
    setIsSuccess(false)
    onClose()
  }

  if (!isOpen) return null

  // Success state
  if (isSuccess) {
    return (
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
        <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full overflow-hidden z-[101]">
          <div className="p-8 text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
              Reserva Exitosa!
            </h2>
            <p className="text-gray-600 dark:text-slate-300 mb-6">
              Tus numeros han sido reservados correctamente.
              Nos pondremos en contacto contigo para coordinar el pago.
            </p>
            <div className="bg-gray-50 dark:bg-slate-700 rounded-xl p-4 mb-6">
              <p className="text-sm text-gray-500 dark:text-slate-400 mb-2">{raffleName}</p>
              <div className="flex flex-wrap gap-2 justify-center">
                {reservedNumbers.map(num => (
                  <span
                    key={num}
                    className="bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300 px-3 py-1 rounded-full font-mono font-bold text-sm"
                  >
                    #{num.toString().padStart(2, '0')}
                  </span>
                ))}
              </div>
            </div>
            <button
              onClick={handleClose}
              className="w-full bg-slate-800 dark:bg-amber-600 text-white py-3 rounded-lg font-bold hover:bg-slate-700 dark:hover:bg-amber-500 transition-colors"
            >
              Cerrar
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={handleClose}
      />

      {/* Modal */}
      <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-xl max-w-md w-full max-h-[90vh] flex flex-col z-[101]">
        {/* Fixed Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-100 dark:border-slate-700 flex-shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white">Reservar Numeros</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors text-slate-600 dark:text-slate-400"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Order summary */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-xl p-4 mb-6">
            <h3 className="font-medium text-slate-800 dark:text-white mb-3">{raffleName}</h3>
            <div className="flex flex-wrap gap-2 mb-4 max-h-32 overflow-y-auto">
              {selectedNumbers.map(num => (
                <span
                  key={num}
                  className="bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-300 px-3 py-1 rounded-full font-mono font-bold text-sm"
                >
                  #{num.toString().padStart(2, '0')}
                </span>
              ))}
            </div>
            <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-600">
              <span className="text-slate-600 dark:text-slate-300">Total ({selectedNumbers.length} numeros)</span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {formatPrice(total, currency)}
              </span>
            </div>
          </div>

          {/* Form */}
          <form id="checkout-form" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            {serverError && (
              <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3 text-red-700 dark:text-red-300">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                <p className="text-sm">{serverError}</p>
              </div>
            )}

            <Input
              label="Nombre completo"
              placeholder="Tu nombre"
              required
              icon={<User className="w-5 h-5" />}
              error={errors.buyerName?.message}
              {...register('buyerName')}
            />

            <Input
              label="Email"
              type="email"
              placeholder="tu@email.com"
              required
              icon={<Mail className="w-5 h-5" />}
              error={errors.buyerEmail?.message}
              {...register('buyerEmail')}
            />

            <Input
              label="Telefono"
              type="tel"
              placeholder="55 1234 5678"
              required
              icon={<Phone className="w-5 h-5" />}
              error={errors.buyerPhone?.message}
              {...register('buyerPhone')}
            />
          </form>
        </div>

        {/* Fixed Footer */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-700 flex-shrink-0 bg-white dark:bg-slate-800">
          <button
            type="submit"
            form="checkout-form"
            disabled={createPurchase.isPending}
            className="w-full flex items-center justify-center gap-2 bg-amber-500 text-white py-3 rounded-lg font-bold hover:bg-amber-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {createPurchase.isPending ? (
              <Loading size="sm" />
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                Confirmar Reserva
              </>
            )}
          </button>
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center mt-3">
            Al confirmar, tus numeros quedaran reservados y nos pondremos en contacto contigo para el pago.
          </p>
        </div>
      </div>
    </div>
  )
}
