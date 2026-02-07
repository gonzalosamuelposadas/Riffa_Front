import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { RaffleForm } from '@raffles'

export default function NewRafflePage() {
  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <Link
          href="/admin/rifas"
          className="inline-flex items-center gap-2 text-gray-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors mb-4"
        >
          <ArrowLeft className="w-5 h-5" />
          Volver a rifas
        </Link>
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Nueva Rifa</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">Crea una nueva rifa para tus usuarios</p>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6 lg:p-8 max-w-3xl">
        <RaffleForm />
      </div>
    </div>
  )
}
