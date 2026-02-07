'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Package, Edit, Trash2, Eye, EyeOff, Star } from 'lucide-react'
import { api } from '@shared'
import toast from 'react-hot-toast'

interface Product {
  id: string
  name: string
  slug: string
  price: number
  comparePrice: number | null
  isActive: boolean
  isFeatured: boolean
  images: { url: string }[]
  variants: { id: string; stock: number }[]
  category: { id: string; name: string } | null
  _count: { reservations: number; reviews: number }
}

export default function ProductosPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState<string | null>(null)

  const fetchProducts = async () => {
    try {
      const { data } = await api.get<Product[]>('/products/admin')
      setProducts(data)
    } catch (error) {
      console.error('Error fetching products:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [])

  const handleDelete = async (id: string) => {
    if (!confirm('¿Eliminar este producto? Esta acción no se puede deshacer.')) {
      return
    }

    setDeleting(id)
    try {
      await api.delete(`/products/${id}`)
      toast.success('Producto eliminado')
      fetchProducts()
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al eliminar')
    } finally {
      setDeleting(null)
    }
  }

  const handleToggleActive = async (product: Product) => {
    try {
      await api.patch(`/products/${product.id}`, { isActive: !product.isActive })
      toast.success(product.isActive ? 'Producto desactivado' : 'Producto activado')
      fetchProducts()
    } catch {
      toast.error('Error al actualizar')
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('es-MX', {
      style: 'currency',
      currency: 'MXN',
    }).format(amount)
  }

  const getTotalStock = (variants: { stock: number }[]) => {
    return variants.reduce((sum, v) => sum + v.stock, 0)
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
            Productos
          </h1>
          <p className="text-slate-500 dark:text-slate-400">
            Gestiona tu catálogo de productos
          </p>
        </div>
        <Link
          href="/admin/productos/nuevo"
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
        >
          <Plus className="w-5 h-5" />
          Nuevo Producto
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            No hay productos
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4">
            Crea tu primer producto para comenzar a vender
          </p>
          <Link
            href="/admin/productos/nuevo"
            className="inline-flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors"
          >
            <Plus className="w-5 h-5" />
            Crear Producto
          </Link>
        </div>
      ) : (
        <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-700/50">
                <tr>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Producto
                  </th>
                  <th className="text-left px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Categoría
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Precio
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Stock
                  </th>
                  <th className="text-center px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Estado
                  </th>
                  <th className="text-right px-6 py-4 text-sm font-medium text-slate-500 dark:text-slate-400">
                    Acciones
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {products.map((product) => {
                  const totalStock = getTotalStock(product.variants)
                  return (
                    <tr key={product.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg overflow-hidden bg-slate-100 dark:bg-slate-700 flex-shrink-0">
                            {product.images[0] ? (
                              <img
                                src={product.images[0].url}
                                alt={product.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center">
                                <Package className="w-6 h-6 text-slate-400" />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-slate-800 dark:text-white flex items-center gap-1">
                              {product.name}
                              {product.isFeatured && (
                                <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                              )}
                            </p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">
                              {product._count.reservations} reservas
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                        {product.category?.name || '-'}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div>
                          <p className="font-medium text-slate-800 dark:text-white">
                            {formatCurrency(product.price)}
                          </p>
                          {product.comparePrice && (
                            <p className="text-sm text-slate-400 line-through">
                              {formatCurrency(product.comparePrice)}
                            </p>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <span
                          className={`font-medium ${
                            totalStock > 0
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400'
                          }`}
                        >
                          {totalStock}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleToggleActive(product)}
                          className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${
                            product.isActive
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                              : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-400'
                          }`}
                        >
                          {product.isActive ? (
                            <>
                              <Eye className="w-3 h-3" /> Activo
                            </>
                          ) : (
                            <>
                              <EyeOff className="w-3 h-3" /> Oculto
                            </>
                          )}
                        </button>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/admin/productos/${product.id}`}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400 transition-colors"
                          >
                            <Edit className="w-4 h-4" />
                          </Link>
                          <button
                            onClick={() => handleDelete(product.id)}
                            disabled={deleting === product.id}
                            className="p-2 text-slate-600 dark:text-slate-400 hover:text-red-600 dark:hover:text-red-400 transition-colors disabled:opacity-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
