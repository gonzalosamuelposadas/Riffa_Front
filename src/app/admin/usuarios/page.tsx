'use client'

import { useEffect, useState } from 'react'
import { Users, UserCheck, UserX, UserPlus, Loader2, Mail, Phone, Hash, DollarSign, Trophy, Calendar, Search } from 'lucide-react'
import { adminUsersService, type AdminUser, type UsersStats } from '@/modules/admin'
import { formatPrice } from '@shared'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [stats, setStats] = useState<UsersStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        setError(null)
        const [usersData, statsData] = await Promise.all([
          adminUsersService.getAll(),
          adminUsersService.getStats()
        ])
        setUsers(usersData)
        setStats(statsData)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar los usuarios')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredUsers = users.filter((user) => {
    // Filter by active/inactive
    if (filter === 'active' && !user.isActive) return false
    if (filter === 'inactive' && user.isActive) return false

    // Filter by search term
    if (searchTerm) {
      const search = searchTerm.toLowerCase()
      return (
        user.name.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        (user.phone && user.phone.includes(search))
      )
    }

    return true
  })

  if (loading) {
    return (
      <div className="p-6 lg:p-8 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="p-6 lg:p-8">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-6 text-center">
          <p className="text-red-600 dark:text-red-400">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 dark:text-white">Usuarios</h1>
        <p className="text-gray-600 dark:text-slate-400 mt-1">
          Administra y visualiza los usuarios de la plataforma
        </p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Total Usuarios</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Usuarios Activos</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.activeUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-100 dark:bg-slate-700 rounded-lg flex items-center justify-center">
                <UserX className="w-5 h-5 text-gray-600 dark:text-slate-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Usuarios Inactivos</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.inactiveUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-lg flex items-center justify-center">
                <UserPlus className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-sm text-gray-500 dark:text-slate-400">Nuevos (30 dias)</p>
                <p className="text-xl font-bold text-gray-800 dark:text-white">{stats.newUsersThisMonth}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre, email o telefono..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-900 text-gray-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          {/* Filter buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => setFilter('all')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'all'
                  ? 'bg-amber-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              Todos
            </button>
            <button
              onClick={() => setFilter('active')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'active'
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              Activos
            </button>
            <button
              onClick={() => setFilter('inactive')}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filter === 'inactive'
                  ? 'bg-gray-500 text-white'
                  : 'bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-300 hover:bg-gray-200 dark:hover:bg-slate-600'
              }`}
            >
              Inactivos
            </button>
          </div>
        </div>
      </div>

      {/* Users List */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 dark:border-slate-700">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Lista de Usuarios ({filteredUsers.length})
          </h2>
          <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
            Usuarios activos = compraron en los ultimos 30 dias
          </p>
        </div>

        {filteredUsers.length === 0 ? (
          <div className="p-10 text-center text-gray-500 dark:text-slate-400">
            No se encontraron usuarios
          </div>
        ) : (
          <div className="divide-y divide-gray-100 dark:divide-slate-700">
            {filteredUsers.map((user) => (
              <div
                key={user.id}
                className="p-5 hover:bg-gray-50 dark:hover:bg-slate-700/30 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-amber-600 dark:text-amber-400 font-bold text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-gray-800 dark:text-white truncate">{user.name}</p>
                          {user.isActive ? (
                            <span className="flex-shrink-0 text-xs bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400 px-2 py-0.5 rounded-full">
                              Activo
                            </span>
                          ) : (
                            <span className="flex-shrink-0 text-xs bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-slate-400 px-2 py-0.5 rounded-full">
                              Inactivo
                            </span>
                          )}
                          {user.wonRafflesCount > 0 && (
                            <span className="flex-shrink-0 flex items-center gap-1 text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-400 px-2 py-0.5 rounded-full">
                              <Trophy className="w-3 h-3" />
                              {user.wonRafflesCount} ganada{user.wonRafflesCount > 1 ? 's' : ''}
                            </span>
                          )}
                        </div>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-slate-400 mt-1">
                          <span className="flex items-center gap-1">
                            <Mail className="w-3.5 h-3.5" />
                            {user.email}
                          </span>
                          {user.phone && (
                            <span className="flex items-center gap-1">
                              <Phone className="w-3.5 h-3.5" />
                              {user.phone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="flex flex-wrap gap-4 lg:gap-6 text-sm">
                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                      <Hash className="w-4 h-4 text-blue-500" />
                      <span className="font-semibold text-gray-800 dark:text-white">{user.totalNumbers}</span>
                      <span>numeros</span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                      <DollarSign className="w-4 h-4 text-green-500" />
                      <span className="font-semibold text-green-600 dark:text-green-400">
                        {formatPrice(user.totalSpent, 'MXN')}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-gray-600 dark:text-slate-400">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span>
                        {user.lastPurchaseAt
                          ? new Date(user.lastPurchaseAt).toLocaleDateString('es-MX', {
                              year: 'numeric',
                              month: 'short',
                              day: 'numeric'
                            })
                          : 'Sin compras'}
                      </span>
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
