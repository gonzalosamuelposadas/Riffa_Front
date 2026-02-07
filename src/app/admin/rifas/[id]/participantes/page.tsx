'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import { ArrowLeft, Loader2, Users, Hash, Mail, Phone, User, DollarSign } from 'lucide-react'
import { raffleService } from '@raffles'
import { formatPrice } from '@shared'

interface ParticipantsData {
  raffle: {
    id: string
    name: string
    prize: string
  }
  totalParticipants: number
  participants: Array<{
    id: string | null
    name: string
    email: string
    phone: string | null
    numbersCount: number
    totalSpent: number
    numbers: number[]
  }>
}

export default function RaffleParticipantsPage() {
  const params = useParams()
  const id = params.id as string

  const [data, setData] = useState<ParticipantsData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadParticipants = async () => {
      try {
        setLoading(true)
        setError(null)
        const participantsData = await raffleService.getParticipants(id)
        setData(participantsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los participantes')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      loadParticipants()
    }
  }, [id])

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error || !data) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400 mb-4">{error || 'Error al cargar los datos'}</p>
          <Link
            href={`/admin/rifas/${id}`}
            className="bg-amber-500 text-white px-4 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Volver a la rifa
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link
          href={`/admin/rifas/${id}`}
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a la rifa
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Participantes</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">{data.raffle.name}</p>
      </div>

      {/* Stats Card */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5 mb-8 inline-flex items-center gap-3">
        <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
          <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-slate-400">Total Participantes</p>
          <p className="text-xl font-bold text-gray-800 dark:text-white">{data.totalParticipants}</p>
        </div>
      </div>

      {/* Participants List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Lista de Participantes</h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Ordenados por cantidad de numeros comprados
          </p>
        </div>

        {data.participants.length === 0 ? (
          <div className="p-10 text-center text-gray-500 dark:text-slate-400">
            No hay participantes registrados
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {data.participants.map((participant, index) => (
              <div
                key={participant.id || participant.email}
                className="p-5 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-start gap-4">
                    {/* Rank */}
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${
                      index === 0
                        ? 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400'
                        : index === 1
                        ? 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400'
                        : index === 2
                        ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-600 dark:text-orange-400'
                        : 'bg-gray-50 dark:bg-slate-800 text-gray-400 dark:text-slate-500'
                    }`}>
                      {index + 1}
                    </div>

                    {/* User Info */}
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-800 dark:text-white">{participant.name}</p>
                        {participant.id && (
                          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-1.5 py-0.5 rounded">
                            Usuario
                          </span>
                        )}
                      </div>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-slate-400 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail className="w-3.5 h-3.5" />
                          {participant.email}
                        </span>
                        {participant.phone && (
                          <span className="flex items-center gap-1">
                            <Phone className="w-3.5 h-3.5" />
                            {participant.phone}
                          </span>
                        )}
                      </div>

                      {/* Numbers */}
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {participant.numbers.slice(0, 10).sort((a, b) => a - b).map((num) => (
                          <span
                            key={num}
                            className="inline-flex items-center justify-center w-7 h-7 bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 rounded text-xs font-medium"
                          >
                            {num}
                          </span>
                        ))}
                        {participant.numbers.length > 10 && (
                          <span className="inline-flex items-center justify-center px-2 h-7 bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 rounded text-xs">
                            +{participant.numbers.length - 10} mas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <div className="flex items-center gap-1 text-gray-500 dark:text-slate-400 text-sm mb-1">
                      <Hash className="w-4 h-4" />
                      <span className="font-semibold text-gray-800 dark:text-white">{participant.numbersCount}</span>
                      <span>numeros</span>
                    </div>
                    <div className="flex items-center gap-1 text-green-600 dark:text-green-400 text-sm">
                      <DollarSign className="w-4 h-4" />
                      <span className="font-semibold">{formatPrice(participant.totalSpent, 'MXN')}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
