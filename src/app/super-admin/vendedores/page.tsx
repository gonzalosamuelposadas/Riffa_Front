'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Store, ExternalLink } from 'lucide-react'
import { api } from '@shared'

interface AdminWithStats {
  id: string
  email: string
  name: string
  phone: string | null
  createdAt: string
  ownedStores: {
    id: string
    name: string
    slug: string
    isActive: boolean
  }[]
  stats: {
    totalRaffles: number
    totalSales: number
    pendingCommission: number
  } | null
}

export default function VendedoresPage() {
  const [admins, setAdmins] = useState<AdminWithStats[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchAdmins = async () => {
      try {
        const { data } = await api.get<AdminWithStats[]>('/super-admin/admins')
        setAdmins(data)
      } catch (error) {
        console.error('Error fetching admins:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAdmins()
  }, [])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Vendedores
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Gestiona los administradores y sus tiendas
          </p>
        </div>
        <Link
          href="/super-admin/vendedores/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Vendedor
        </Link>
      </div>

      {admins.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <Store className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            No hay vendedores
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Crea el primer vendedor para comenzar
          </p>
          <Link
            href="/super-admin/vendedores/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Crear Vendedor
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Vendedor
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Tienda
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Rifas
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Ventas
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Comisión Pendiente
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {admins.map((admin) => {
                const store = admin.ownedStores[0]
                return (
                  <tr key={admin.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-slate-800 dark:text-white">
                          {admin.name}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400">
                          {admin.email}
                        </p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {store ? (
                        <div className="flex items-center gap-2">
                          <span
                            className={`w-2 h-2 rounded-full ${
                              store.isActive ? 'bg-green-500' : 'bg-red-500'
                            }`}
                          />
                          <span className="text-slate-800 dark:text-white">{store.name}</span>
                          <Link
                            href={`/tienda/${store.slug}`}
                            target="_blank"
                            className="text-slate-400 hover:text-amber-600"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      ) : (
                        <span className="text-slate-400">Sin tienda</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-800 dark:text-white">
                      {admin.stats?.totalRaffles || 0}
                    </td>
                    <td className="px-6 py-4 text-right text-slate-800 dark:text-white">
                      {formatCurrency(admin.stats?.totalSales || 0)}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span
                        className={`font-medium ${
                          (admin.stats?.pendingCommission || 0) > 0
                            ? 'text-amber-600 dark:text-amber-400'
                            : 'text-slate-400'
                        }`}
                      >
                        {formatCurrency(admin.stats?.pendingCommission || 0)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Link
                        href={`/super-admin/vendedores/${admin.id}`}
                        className="text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 text-sm font-medium"
                      >
                        Ver detalle
                      </Link>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
