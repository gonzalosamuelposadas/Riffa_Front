'use client'

import { useEffect, useState } from 'react'
import { Store, Save, ExternalLink, Copy, Check } from 'lucide-react'
import { api } from '@shared'
import { useAuth } from '@/modules/auth'
import toast from 'react-hot-toast'

interface StoreData {
  id: string
  name: string
  slug: string
  description: string | null
  logo: string | null
  isActive: boolean
  createdAt: string
}

export default function MiTiendaPage() {
  const { storeSlug } = useAuth()
  const [store, setStore] = useState<StoreData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [copied, setCopied] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    logo: '',
  })

  useEffect(() => {
    const fetchStore = async () => {
      try {
        const { data } = await api.get<StoreData>('/stores/my-store')
        setStore(data)
        setFormData({
          name: data.name,
          description: data.description || '',
          logo: data.logo || '',
        })
      } catch (error) {
        console.error('Error fetching store:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchStore()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const { data } = await api.patch<StoreData>('/stores/my-store', formData)
      setStore(data)
      toast.success('Tienda actualizada')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al actualizar')
    } finally {
      setSaving(false)
    }
  }

  const copyStoreUrl = () => {
    if (store) {
      const url = `${window.location.origin}/tienda/${store.slug}`
      navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('URL copiada')
      setTimeout(() => setCopied(false), 2000)
    }
  }

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-6">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded" />
          <div className="h-64 bg-slate-200 dark:bg-slate-700 rounded-xl" />
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div className="p-6">
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <Store className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            No tienes una tienda asignada
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            Contacta al administrador para que te asigne una tienda
          </p>
        </div>
      </div>
    )
  }

  const storeUrl = `${typeof window !== 'undefined' ? window.location.origin : ''}/tienda/${store.slug}`

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Mi Tienda
        </h1>
        <p className="text-slate-500 dark:text-slate-400">
          Configura la información de tu tienda
        </p>
      </div>

      {/* Store URL Card */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-amber-700 dark:text-amber-300 mb-1">
              URL de tu tienda
            </p>
            <p className="font-mono text-amber-800 dark:text-amber-200">
              {storeUrl}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={copyStoreUrl}
              className="p-2 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
              title="Copiar URL"
            >
              {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
            </button>
            <a
              href={`/tienda/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 text-amber-600 hover:text-amber-700 dark:text-amber-400 dark:hover:text-amber-300 transition-colors"
              title="Abrir tienda"
            >
              <ExternalLink className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* Status */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`w-3 h-3 rounded-full ${
              store.isActive ? 'bg-green-500' : 'bg-red-500'
            }`}
          />
          <span className="text-slate-800 dark:text-white">
            Estado de la tienda
          </span>
        </div>
        <span
          className={`px-3 py-1 rounded-full text-sm font-medium ${
            store.isActive
              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              : 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300'
          }`}
        >
          {store.isActive ? 'Activa' : 'Inactiva'}
        </span>
      </div>

      {/* Edit Form */}
      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-6">
          Información de la tienda
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Nombre de la tienda
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Slug (URL)
            </label>
            <div className="flex items-center gap-2">
              <span className="text-slate-500 dark:text-slate-400">/tienda/</span>
              <input
                type="text"
                disabled
                value={store.slug}
                className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-100 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
              />
            </div>
            <p className="text-xs text-slate-500 mt-1">
              El slug no se puede cambiar
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              Descripción
            </label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe tu tienda de rifas..."
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              URL del logo
            </label>
            <input
              type="url"
              value={formData.logo}
              onChange={(e) => setFormData({ ...formData, logo: e.target.value })}
              placeholder="https://ejemplo.com/logo.png"
              className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-800 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-transparent"
            />
            {formData.logo && (
              <div className="mt-2">
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className="w-16 h-16 rounded-lg object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none'
                  }}
                />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 disabled:bg-amber-400 text-white rounded-lg transition-colors"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Guardando...' : 'Guardar cambios'}
          </button>
        </div>
      </form>

      {/* Stats preview */}
      <div className="bg-white dark:bg-slate-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
          Información adicional
        </h2>
        <div className="text-sm text-slate-500 dark:text-slate-400">
          <p>
            Tienda creada el{' '}
            {new Date(store.createdAt).toLocaleDateString('es-MX', {
              day: 'numeric',
              month: 'long',
              year: 'numeric',
            })}
          </p>
        </div>
      </div>
    </div>
  )
}
