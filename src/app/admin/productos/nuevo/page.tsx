'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Plus, Trash2, Loader2, ImagePlus } from 'lucide-react'
import { api } from '@shared'
import toast from 'react-hot-toast'

interface Category {
  id: string
  name: string
}

interface ProductImage {
  url: string
  alt?: string
}

interface ProductVariant {
  name: string
  sku?: string
  price?: number
  stock: number
  size?: string
  color?: string
  colorHex?: string
}

export default function NuevoProductoPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState<Category[]>([])

  // Form state
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState('')
  const [comparePrice, setComparePrice] = useState('')
  const [categoryId, setCategoryId] = useState('')
  const [isActive, setIsActive] = useState(true)
  const [isFeatured, setIsFeatured] = useState(false)
  const [images, setImages] = useState<ProductImage[]>([{ url: '', alt: '' }])
  const [variants, setVariants] = useState<ProductVariant[]>([
    { name: 'Único', stock: 0 },
  ])

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get<Category[]>('/categories')
        setCategories(data)
      } catch (error) {
        console.error('Error fetching categories:', error)
      }
    }
    fetchCategories()
  }, [])

  const handleAddImage = () => {
    setImages([...images, { url: '', alt: '' }])
  }

  const handleRemoveImage = (index: number) => {
    if (images.length > 1) {
      setImages(images.filter((_, i) => i !== index))
    }
  }

  const handleImageChange = (index: number, field: 'url' | 'alt', value: string) => {
    const newImages = [...images]
    newImages[index] = { ...newImages[index], [field]: value }
    setImages(newImages)
  }

  const handleAddVariant = () => {
    setVariants([...variants, { name: '', stock: 0 }])
  }

  const handleRemoveVariant = (index: number) => {
    if (variants.length > 1) {
      setVariants(variants.filter((_, i) => i !== index))
    }
  }

  const handleVariantChange = (index: number, field: keyof ProductVariant, value: string | number) => {
    const newVariants = [...variants]
    newVariants[index] = { ...newVariants[index], [field]: value }
    setVariants(newVariants)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!name.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    if (!price || parseFloat(price) <= 0) {
      toast.error('El precio debe ser mayor a 0')
      return
    }

    const validImages = images.filter((img) => img.url.trim())
    const validVariants = variants.filter((v) => v.name.trim())

    if (validVariants.length === 0) {
      toast.error('Debe haber al menos una variante')
      return
    }

    setLoading(true)
    try {
      await api.post('/products', {
        name: name.trim(),
        description: description.trim() || undefined,
        price: parseFloat(price),
        comparePrice: comparePrice ? parseFloat(comparePrice) : undefined,
        categoryId: categoryId || undefined,
        isActive,
        isFeatured,
        images: validImages.length > 0 ? validImages : undefined,
        variants: validVariants.map((v) => ({
          ...v,
          price: v.price ? parseFloat(String(v.price)) : undefined,
          stock: parseInt(String(v.stock)) || 0,
        })),
      })

      toast.success('Producto creado correctamente')
      router.push('/admin/productos')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al crear producto')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <Link
          href="/admin/productos"
          className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver a productos
        </Link>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-6">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">
          Nuevo Producto
        </h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información básica */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
              Información básica
            </h2>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Nombre *
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                placeholder="Ej: Camiseta deportiva"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Descripción
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                placeholder="Describe tu producto..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Precio (MXN) *
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Precio anterior (tachado)
                </label>
                <input
                  type="number"
                  value={comparePrice}
                  onChange={(e) => setComparePrice(e.target.value)}
                  min="0"
                  step="0.01"
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Categoría
              </label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
              >
                <option value="">Sin categoría</option>
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Producto activo
                </span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">
                  Destacado
                </span>
              </label>
            </div>
          </div>

          {/* Imágenes */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Imágenes
              </h2>
              <button
                type="button"
                onClick={handleAddImage}
                className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
              >
                <ImagePlus className="w-4 h-4" />
                Agregar imagen
              </button>
            </div>

            {images.map((image, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="flex-1 space-y-2">
                  <input
                    type="url"
                    value={image.url}
                    onChange={(e) => handleImageChange(index, 'url', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    placeholder="URL de la imagen"
                  />
                  <input
                    type="text"
                    value={image.alt || ''}
                    onChange={(e) => handleImageChange(index, 'alt', e.target.value)}
                    className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    placeholder="Texto alternativo (opcional)"
                  />
                </div>
                {images.length > 1 && (
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="p-2 text-red-500 hover:text-red-600"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            ))}
          </div>

          {/* Variantes */}
          <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200">
                Variantes
              </h2>
              <button
                type="button"
                onClick={handleAddVariant}
                className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700"
              >
                <Plus className="w-4 h-4" />
                Agregar variante
              </button>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400">
              Si tu producto tiene una sola versión, déjalo como "Único". Si tiene tallas o colores, agrega variantes.
            </p>

            {variants.map((variant, index) => (
              <div
                key={index}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Variante {index + 1}
                  </span>
                  {variants.length > 1 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveVariant(index)}
                      className="p-1 text-red-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Nombre *
                    </label>
                    <input
                      type="text"
                      value={variant.name}
                      onChange={(e) => handleVariantChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      placeholder="Ej: Talla M, Color Rojo"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      SKU
                    </label>
                    <input
                      type="text"
                      value={variant.sku || ''}
                      onChange={(e) => handleVariantChange(index, 'sku', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      placeholder="Código único"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Precio (si difiere)
                    </label>
                    <input
                      type="number"
                      value={variant.price || ''}
                      onChange={(e) => handleVariantChange(index, 'price', e.target.value)}
                      min="0"
                      step="0.01"
                      className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      placeholder="Precio de la variante"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Stock *
                    </label>
                    <input
                      type="number"
                      value={variant.stock}
                      onChange={(e) => handleVariantChange(index, 'stock', parseInt(e.target.value) || 0)}
                      min="0"
                      className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Talla
                    </label>
                    <input
                      type="text"
                      value={variant.size || ''}
                      onChange={(e) => handleVariantChange(index, 'size', e.target.value)}
                      className="w-full px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                      placeholder="Ej: S, M, L, XL"
                    />
                  </div>

                  <div>
                    <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1">
                      Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={variant.color || ''}
                        onChange={(e) => handleVariantChange(index, 'color', e.target.value)}
                        className="flex-1 px-3 py-2 text-sm border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                        placeholder="Ej: Rojo, Azul"
                      />
                      <input
                        type="color"
                        value={variant.colorHex || '#000000'}
                        onChange={(e) => handleVariantChange(index, 'colorHex', e.target.value)}
                        className="w-10 h-10 border border-slate-300 dark:border-slate-600 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit */}
          <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-200 dark:border-slate-700">
            <Link
              href="/admin/productos"
              className="px-4 py-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex items-center gap-2 px-6 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              Crear Producto
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
