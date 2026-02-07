import Link from 'next/link'
import { Gift, Ticket } from 'lucide-react'
import { UserNavMenu } from '@/modules/user-auth/components/UserNavMenu'
import { formatPrice, Header } from '@shared'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api'

interface RaffleNumber {
  status: 'AVAILABLE' | 'RESERVED' | 'SOLD'
}

interface Raffle {
  id: string
  name: string
  prize: string
  price: number
  currency: string
  status: string
  numbers: RaffleNumber[]
}

async function getActiveRaffles(): Promise<Raffle[]> {
  try {
    const res = await fetch(`${API_URL}/raffles`, {
      cache: 'no-store'
    })
    if (!res.ok) return []
    const raffles = await res.json()
    return raffles.filter((r: { status: string }) => r.status === 'ACTIVE')
  } catch {
    return []
  }
}

export default async function Home() {
  const raffles = await getActiveRaffles()

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-900 transition-colors">
      <Header>
        <UserNavMenu />
      </Header>

      {/* Hero */}
      <section className="bg-gradient-to-br from-slate-800 to-slate-900 dark:from-slate-900 dark:to-black text-white">
        <div className="max-w-7xl mx-auto px-4 py-16 sm:py-24 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">
            Participa y <span className="text-amber-400">Gana</span>
          </h1>
          <p className="text-lg text-slate-300 max-w-2xl mx-auto">
            Selecciona tus numeros de la suerte y participa en nuestras rifas.
            Proceso simple y rapido.
          </p>
        </div>
      </section>

      {/* Raffles Grid */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white mb-8">Rifas Activas</h2>

        {raffles.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-800 rounded-2xl shadow-sm">
            <Gift className="w-16 h-16 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-slate-400 mb-2">
              No hay rifas activas
            </h3>
            <p className="text-slate-500 dark:text-slate-400">
              Vuelve pronto para ver las nuevas rifas disponibles.
            </p>
          </div>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {raffles.map((raffle) => {
              const available = raffle.numbers.filter(n => n.status === 'AVAILABLE').length
              const sold = raffle.numbers.filter(n => n.status === 'SOLD').length
              const progress = raffle.numbers.length > 0
                ? (sold / raffle.numbers.length) * 100
                : 0

              return (
                <Link
                  key={raffle.id}
                  href={`/rifa/${raffle.id}`}
                  className="group bg-white dark:bg-slate-800 rounded-2xl shadow-sm overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-slate-100 dark:border-slate-700"
                >
                  {/* Image placeholder */}
                  <div className="h-48 bg-gradient-to-br from-slate-700 to-slate-800 flex items-center justify-center relative">
                    <Gift className="w-20 h-20 text-amber-400/80 group-hover:scale-110 transition-transform" />
                    <div className="absolute top-4 right-4 bg-amber-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                      {formatPrice(raffle.price, raffle.currency)} c/u
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
                      {raffle.name}
                    </h3>
                    <p className="text-amber-600 dark:text-amber-400 font-semibold mb-4">
                      {raffle.prize}
                    </p>

                    <div className="flex justify-between text-sm text-slate-500 dark:text-slate-400 mb-2">
                      <span>{available} disponibles</span>
                      <span>{Math.round(progress)}% vendido</span>
                    </div>

                    {/* Progress */}
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-amber-400 to-amber-500"
                        style={{ width: `${progress}%` }}
                      />
                    </div>

                    <button className="mt-4 w-full bg-slate-800 dark:bg-amber-600 text-white py-2.5 rounded-lg font-medium group-hover:bg-slate-700 dark:group-hover:bg-amber-500 transition-colors">
                      Participar
                    </button>
                  </div>
                </Link>
              )
            })}
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-slate-800 dark:bg-black text-white mt-12">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Ticket className="w-5 h-5 text-amber-400" />
            <span className="font-bold">RifaApp</span>
          </div>
          <p className="text-slate-400 text-sm text-center mb-6">
            Plataforma tecnológica que facilita la conexión entre organizadores y participantes
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/legal/terminos"
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              Términos y Condiciones
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/legal/privacidad"
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              Privacidad
            </Link>
            <span className="text-slate-600">|</span>
            <Link
              href="/legal/antifraude"
              className="text-slate-400 hover:text-amber-400 transition-colors"
            >
              Anti-fraude
            </Link>
          </div>
          <p className="text-slate-500 text-xs text-center mt-6">
            RifaApp no organiza rifas ni sorteos. Cada tienda es responsable de sus propias actividades.
          </p>
        </div>
      </footer>
    </main>
  )
}
