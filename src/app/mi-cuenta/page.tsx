'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import {
  Ticket,
  Hash,
  Trophy,
  Clock,
  Wallet,
  ChevronRight,
  Calendar,
  AlertCircle,
  ShoppingBag
} from 'lucide-react'
import { Loading } from '@shared'
import { useDashboard } from '@/modules/user-auth'

function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount)
}

function CountdownTimer({ targetDate }: { targetDate: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })

  useEffect(() => {
    const calculateTimeLeft = () => {
      const difference = new Date(targetDate).getTime() - new Date().getTime()

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        })
      }
    }

    calculateTimeLeft()
    const timer = setInterval(calculateTimeLeft, 1000)

    return () => clearInterval(timer)
  }, [targetDate])

  return (
    <div className="flex gap-3 justify-center">
      <div className="text-center">
        <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[60px]">
          <span className="text-2xl font-bold text-white">{timeLeft.days}</span>
        </div>
        <span className="text-xs text-slate-300 mt-1 block">dias</span>
      </div>
      <div className="text-center">
        <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[60px]">
          <span className="text-2xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</span>
        </div>
        <span className="text-xs text-slate-300 mt-1 block">horas</span>
      </div>
      <div className="text-center">
        <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[60px]">
          <span className="text-2xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</span>
        </div>
        <span className="text-xs text-slate-300 mt-1 block">min</span>
      </div>
      <div className="text-center">
        <div className="bg-white/20 rounded-lg px-3 py-2 min-w-[60px]">
          <span className="text-2xl font-bold text-white">{String(timeLeft.seconds).padStart(2, '0')}</span>
        </div>
        <span className="text-xs text-slate-300 mt-1 block">seg</span>
      </div>
    </div>
  )
}

function StatCard({
  icon: Icon,
  title,
  value,
  subtitle,
  color = 'slate'
}: {
  icon: React.ElementType
  title: string
  value: string | number
  subtitle?: string
  color?: 'slate' | 'amber' | 'blue' | 'green'
}) {
  const colors = {
    slate: 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300',
    amber: 'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400',
    blue: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400',
    green: 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-6 transition-colors">
      <div className="flex items-center gap-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${colors[color]}`}>
          <Icon className="w-6 h-6" />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {subtitle && <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">{subtitle}</p>}
        </div>
      </div>
    </div>
  )
}

export default function DashboardPage() {
  const { data: dashboard, isLoading, error } = useDashboard()

  if (isLoading) {
    return <Loading size="lg" text="Cargando dashboard..." />
  }

  if (error) {
    return (
      <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-6 text-center">
        <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <h3 className="text-lg font-semibold text-red-800 dark:text-red-300">Error al cargar el dashboard</h3>
        <p className="text-red-600 dark:text-red-400 mt-1">Por favor intenta de nuevo mas tarde</p>
      </div>
    )
  }

  if (!dashboard) {
    return null
  }

  const { stats, activeRaffles, nextDraw, user } = dashboard

  return (
    <div className="space-y-8">
      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Hola, {user.name}!</h1>
        <p className="text-slate-500 dark:text-slate-400 mt-1">Aqui esta el resumen de tus rifas</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={Ticket}
          title="Rifas Activas"
          value={stats.activeRafflesCount}
          subtitle="en las que participas"
          color="slate"
        />
        <StatCard
          icon={Hash}
          title="Numeros Comprados"
          value={stats.totalNumbersBought}
          subtitle="en total"
          color="blue"
        />
        <StatCard
          icon={Trophy}
          title="Rifas Ganadas"
          value={stats.wonRafflesCount}
          subtitle={`${stats.pendingRafflesCount} pendientes`}
          color="amber"
        />
        <StatCard
          icon={Wallet}
          title="Dinero Gastado"
          value={formatCurrency(stats.totalSpent)}
          subtitle={`Saldo: ${formatCurrency(stats.balance)}`}
          color="green"
        />
      </div>

      {/* Next Draw Countdown */}
      {nextDraw && (
        <div className="bg-gradient-to-r from-slate-800 to-slate-900 rounded-2xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="w-6 h-6 text-amber-400" />
              <h2 className="text-lg font-semibold">Proximo Sorteo</h2>
            </div>
            <Link
              href={`/rifa/${nextDraw.id}`}
              className="text-sm bg-amber-500 hover:bg-amber-600 px-3 py-1 rounded-full transition-colors"
            >
              Ver rifa
            </Link>
          </div>
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold">{nextDraw.name}</h3>
            <p className="text-slate-300">Premio: {nextDraw.prize}</p>
          </div>
          <CountdownTimer targetDate={nextDraw.drawDate} />
          <p className="text-center text-sm text-slate-400 mt-4">
            <Calendar className="w-4 h-4 inline mr-1" />
            {new Date(nextDraw.drawDate).toLocaleDateString('es-MX', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}
          </p>
        </div>
      )}

      {!nextDraw && stats.activeRafflesCount === 0 && (
        <div className="bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-8 text-center">
          <Ticket className="w-12 h-12 text-slate-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-700 dark:text-slate-200">No tienes rifas activas</h3>
          <p className="text-slate-500 dark:text-slate-400 mt-1 mb-4">Explora las rifas disponibles y participa!</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition-colors"
          >
            Ver rifas disponibles
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      )}

      {/* Quick Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Link
          href="/mi-cuenta/rifas"
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
            <Ticket className="w-6 h-6 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Mis Rifas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Ver todas tus participaciones</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
        </Link>

        <Link
          href="/mi-cuenta/reservas-productos"
          className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 p-4 hover:shadow-md transition-all flex items-center gap-4"
        >
          <div className="w-12 h-12 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
            <ShoppingBag className="w-6 h-6 text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900 dark:text-white">Mis Reservas</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Productos que has reservado</p>
          </div>
          <ChevronRight className="w-5 h-5 text-slate-400 ml-auto" />
        </Link>
      </div>

      {/* Active Raffles */}
      {activeRaffles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tus Rifas Activas</h2>
            <Link
              href="/mi-cuenta/rifas"
              className="text-sm text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 flex items-center gap-1"
            >
              Ver todas <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {activeRaffles.slice(0, 3).map((raffle) => (
              <Link
                key={raffle.id}
                href={`/rifa/${raffle.id}`}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-100 dark:border-slate-700 overflow-hidden hover:shadow-md transition-all"
              >
                {raffle.prizeImage && (
                  <div className="h-32 bg-slate-100 dark:bg-slate-700">
                    <img
                      src={raffle.prizeImage}
                      alt={raffle.prize}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="p-4">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{raffle.name}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{raffle.prize}</p>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-2 py-1 rounded-full">
                      {raffle.numbersOwned.length} numeros
                    </span>
                    {raffle.drawDate && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        {new Date(raffle.drawDate).toLocaleDateString('es-MX', {
                          month: 'short',
                          day: 'numeric'
                        })}
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {raffle.numbersOwned.slice(0, 5).map((num) => (
                      <span
                        key={num}
                        className="text-xs bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 px-2 py-0.5 rounded"
                      >
                        #{num}
                      </span>
                    ))}
                    {raffle.numbersOwned.length > 5 && (
                      <span className="text-xs text-slate-400 dark:text-slate-500">
                        +{raffle.numbersOwned.length - 5} mas
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
