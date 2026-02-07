'use client'

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircle, Ticket, Home, Loader2 } from 'lucide-react'

interface PurchaseDetails {
  buyerName: string
  buyerEmail: string
  totalAmount: number
  numbers: number[]
  raffleName: string
}

export default function SuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [purchase, setPurchase] = useState<PurchaseDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (sessionId) {
      fetch(`/api/purchase/verify?session_id=${sessionId}`)
        .then(res => res.json())
        .then(data => {
          if (data.error) {
            setError(data.error)
          } else {
            setPurchase(data)
          }
        })
        .catch(() => setError('Error al verificar la compra'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [sessionId])

  return (
    <main className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        {loading ? (
          <div className="py-12">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
            <p className="text-gray-600">Verificando tu compra...</p>
          </div>
        ) : error ? (
          <div className="py-12">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">!</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">Error</h1>
            <p className="text-gray-600 mb-6">{error}</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Volver al inicio
            </Link>
          </div>
        ) : (
          <>
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-12 h-12 text-green-600" />
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              Compra Exitosa!
            </h1>

            <p className="text-gray-600 mb-8">
              Gracias por tu compra. Tus numeros han sido registrados.
            </p>

            {purchase && (
              <div className="bg-gray-50 rounded-xl p-6 mb-8 text-left">
                <h2 className="font-bold text-gray-800 mb-4">{purchase.raffleName}</h2>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Comprador:</span>
                    <span className="font-medium">{purchase.buyerName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Email:</span>
                    <span className="font-medium">{purchase.buyerEmail}</span>
                  </div>
                </div>

                <div className="border-t pt-4">
                  <p className="text-gray-600 mb-2">Tus numeros:</p>
                  <div className="flex flex-wrap gap-2">
                    {purchase.numbers.map((num) => (
                      <span
                        key={num}
                        className="inline-flex items-center gap-1 bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-mono font-bold"
                      >
                        <Ticket className="w-4 h-4" />
                        {num.toString().padStart(2, '0')}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="border-t pt-4 mt-4">
                  <div className="flex justify-between text-lg">
                    <span className="font-bold">Total pagado:</span>
                    <span className="font-bold text-green-600">
                      ${purchase.totalAmount.toFixed(2)} MXN
                    </span>
                  </div>
                </div>
              </div>
            )}

            <p className="text-sm text-gray-500 mb-6">
              Recibiras un correo de confirmacion con los detalles de tu compra.
            </p>

            <Link
              href="/"
              className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Home className="w-5 h-5" />
              Volver al inicio
            </Link>
          </>
        )}
      </div>
    </main>
  )
}
