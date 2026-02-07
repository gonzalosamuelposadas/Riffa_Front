'use client'

import { useEffect, useState } from 'react'
import { Plus, Edit, Trash2, Loader2, FolderOpen } from 'lucide-react'
import { api } from '@shared'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
  slug: string
  description: string | null
  _count: { products: number }
}

export default function CategoriasPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState<string | null>(null)

  // Form state
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')

  const fetchCategories = async () => {
    try {
      const { data } = await api.get<Category[]>('/categories')
      setCategories(data)
    } catch (error) {
      console.error('Error fetching categories:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [])

  const resetForm = () => {
    setShowForm(false)
    setEditingId(null)
    setName('')
    setDescription('')
  }

  const handleEdit = (category: Category) => {
    setEditingId(category.id)
    setName(category.name)
    setDescription(category.description || '')
    setShowForm(true)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    setSaving(true)
    try {
      if (editingId) {
        await api.patch(`/categories/${editingId}`, {
          name: name.trim(),
          description: description.trim() || null,
        })
        toast.success('Categoría actualizada')
      } else {
        await api.post('/categories', {
          name: name.trim(),
          description: description.trim() || undefined,
        })
        toast.success('Categoría creada')
      }

      resetForm()
      fetchCategories()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar esta categoría? Los productos quedarán sin categoría.')) {
      return
    }

    setDeleting(id)
    try {
      await api.delete(`/categories/${id}`)
      toast.success('Categoría eliminada')
      fetchCategories()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al eliminar')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) {
    return (
      <div className="p-6 flex items-center justify-center min-h-[400px]">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
            Categorías
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Organiza tus productos en categorías
          </p>
        </div>
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Nueva Categoría
          </button>
        )}
      </div>

      {/* Form */}
      {showForm && (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            {editingId ? 'Editar Categoría' : 'Nueva Categoría'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                placeholder="Ej: Electrónicos, Ropa, Accesorios"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={2}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                placeholder="Descripción opcional..."
              />
            </div>

            <div className="flex items-center gap-3">
              <button
                type="submit"
                disabled={saving}
                className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50"
              >
                {saving && <Loader2 className="w-4 h-4 animate-spin" />}
                {editingId ? 'Guardar Cambios' : 'Crear Categoría'}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* List */}
      {categories.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <FolderOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            No hay categorías
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Crea tu primera categoría para organizar tus productos
          </p>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5" />
              Crear Categoría
            </button>
          )}
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <table className="w-full">
            <thead className="bg-slate-50 dark:bg-slate-700/50">
              <tr>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Nombre
                </th>
                <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Descripción
                </th>
                <th className="text-center px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Productos
                </th>
                <th className="text-right px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
              {categories.map((category) => (
                <tr key={category.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                  <td className="px-6 py-4">
                    <p className="font-medium text-slate-800 dark:text-white">
                      {category.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      /{category.slug}
                    </p>
                  </td>
                  <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                    {category.description || '-'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                      {category._count.products}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        disabled={deleting === category.id}
                        className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
