'use client'

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Package,
  Star,
  ChevronLeft,
  ChevronRight,
  Minus,
  Plus,
  ShoppingBag,
  Loader2,
  Phone,
  AlertCircle,
} from 'lucide-react'
import { api, formatPrice } from '@shared'
import { useAuth } from '@auth'
import toast from 'react-hot-toast'

interface ProductImage {
  id: string
  url: string
  alt: string | null
}

interface ProductVariant {
  id: string
  name: string
  sku: string | null
  price: number | null
  stock: number
  size: string | null
  color: string | null
  colorHex: string | null
}

interface ProductReview {
  id: string
  rating: number
  title: string | null
  comment: string | null
  createdAt: string
  user: { name: string }
}

interface Product {
  id: string
  name: string
  slug: string
  description: string | null
  price: number
  comparePrice: number | null
  isFeatured: boolean
  images: ProductImage[]
  variants: ProductVariant[]
  category: { id: string; name: string; slug: string } | null
  reviews: ProductReview[]
  avgRating: number | null
  store: {
    name: string
    slug: string
    whatsapp: string | null
    phone: string | null
  }
}

export default function ProductDetailPage() {
  const params = useParams()
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()

  const storeSlug = params.slug as string
  const productSlug = params.productSlug as string

  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)

  // Gallery state
  const [currentImageIndex, setCurrentImageIndex] = useState(0)

  // Selection state
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [quantity, setQuantity] = useState(1)

  // Form state
  const [showReservationForm, setShowReservationForm] = useState(false)
  const [buyerName, setBuyerName] = useState('')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [notes, setNotes] = useState('')

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await api.get<Product>(`/stores/${storeSlug}/products/${productSlug}`)
        setProduct(data)

        // Auto-select first variant with stock
        const variantWithStock = data.variants.find((v) => v.stock > 0)
        if (variantWithStock) {
          setSelectedVariant(variantWithStock)
        } else if (data.variants.length > 0) {
          setSelectedVariant(data.variants[0])
        }
      } catch (error) {
        console.error('Error fetching product:', error)
        router.push(`/tienda/${storeSlug}/productos`)
      } finally {
        setLoading(false)
      }
    }

    if (storeSlug && productSlug) {
      fetchProduct()
    }
  }, [storeSlug, productSlug, router])

  // Pre-fill user data if logged in
  useEffect(() => {
    if (user) {
      setBuyerName(user.name || '')
      setBuyerEmail(user.email || '')
    }
  }, [user])

  const handlePrevImage = () => {
    if (!product) return
    setCurrentImageIndex((prev) =>
      prev === 0 ? product.images.length - 1 : prev - 1
    )
  }

  const handleNextImage = () => {
    if (!product) return
    setCurrentImageIndex((prev) =>
      prev === product.images.length - 1 ? 0 : prev + 1
    )
  }

  const handleQuantityChange = (delta: number) => {
    const maxStock = selectedVariant?.stock || 0
    setQuantity((prev) => Math.max(1, Math.min(maxStock, prev + delta)))
  }

  const currentPrice = selectedVariant?.price || product?.price || 0
  const totalPrice = currentPrice * quantity
  const isOutOfStock = !selectedVariant || selectedVariant.stock === 0
  const availableStock = selectedVariant?.stock || 0

  const handleReserve = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!isAuthenticated) {
      toast.error('Debes iniciar sesión para reservar')
      router.push(`/login?callbackUrl=/tienda/${storeSlug}/productos/${productSlug}`)
      return
    }

    if (!product || !selectedVariant) {
      toast.error('Selecciona una variante')
      return
    }

    if (!buyerName.trim()) {
      toast.error('El nombre es requerido')
      return
    }

    if (!buyerPhone.trim()) {
      toast.error('El teléfono es requerido')
      return
    }

    setSubmitting(true)

    try {
      // Re-check stock availability before submitting
      const { data: freshProduct } = await api.get<Product>(
        `/stores/${storeSlug}/products/${productSlug}`
      )

      const freshVariant = freshProduct.variants.find((v) => v.id === selectedVariant.id)

      if (!freshVariant) {
        toast.error('Esta variante ya no está disponible')
        setProduct(freshProduct)
        return
      }

      if (freshVariant.stock < quantity) {
        toast.error(
          freshVariant.stock === 0
            ? 'Este producto se ha agotado'
            : `Solo quedan ${freshVariant.stock} unidades disponibles`
        )
        setProduct(freshProduct)
        setSelectedVariant(freshVariant)
        setQuantity(Math.min(quantity, freshVariant.stock))
        return
      }

      // Create reservation
      await api.post('/reservations', {
        productId: product.id,
        variantId: selectedVariant.id,
        quantity,
        buyerName: buyerName.trim(),
        buyerPhone: buyerPhone.trim(),
        buyerEmail: buyerEmail.trim() || undefined,
        notes: notes.trim() || undefined,
      })

      toast.success('Reserva creada correctamente')

      // Redirect to user's reservations or show success
      router.push('/mi-cuenta/reservas-productos')
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } }
      toast.error(err.response?.data?.message || 'Error al crear la reserva')
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="aspect-square bg-slate-200 dark:bg-slate-700 rounded-xl" />
            <div className="space-y-4">
              <div className="h-8 w-3/4 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-6 w-1/2 bg-slate-200 dark:bg-slate-700 rounded" />
              <div className="h-24 bg-slate-200 dark:bg-slate-700 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return null
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href={`/tienda/${storeSlug}/productos`}
          className="inline-flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400 hover:text-amber-600 dark:hover:text-amber-400"
        >
          <ChevronLeft className="w-4 h-4" />
          Volver a productos
        </Link>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Image gallery */}
        <div className="space-y-4">
          <div className="aspect-square bg-slate-100 dark:bg-slate-800 rounded-xl overflow-hidden relative">
            {product.images.length > 0 ? (
              <>
                <img
                  src={product.images[currentImageIndex].url}
                  alt={product.images[currentImageIndex].alt || product.name}
                  className="w-full h-full object-cover"
                />
                {product.images.length > 1 && (
                  <>
                    <button
                      onClick={handlePrevImage}
                      className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-slate-800/80 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={handleNextImage}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-white/80 dark:bg-slate-800/80 rounded-full hover:bg-white dark:hover:bg-slate-800 transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
              </>
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Package className="w-20 h-20 text-slate-300 dark:text-slate-600" />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-4 left-4 flex flex-col gap-2">
              {product.isFeatured && (
                <span className="px-3 py-1 bg-amber-500 text-white text-sm font-medium rounded-full flex items-center gap-1">
                  <Star className="w-4 h-4 fill-white" />
                  Destacado
                </span>
              )}
              {isOutOfStock && (
                <span className="px-3 py-1 bg-red-500 text-white text-sm font-medium rounded-full">
                  Agotado
                </span>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {product.images.map((image, index) => (
                <button
                  key={image.id}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 border-2 transition-colors ${
                    index === currentImageIndex
                      ? 'border-amber-500'
                      : 'border-transparent hover:border-slate-300 dark:hover:border-slate-600'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.alt || ''}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product info */}
        <div className="space-y-6">
          {product.category && (
            <Link
              href={`/tienda/${storeSlug}/productos?category=${product.category.slug}`}
              className="text-sm text-amber-600 dark:text-amber-400 hover:underline"
            >
              {product.category.name}
            </Link>
          )}

          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white">
            {product.name}
          </h1>

          {/* Rating */}
          {product.reviews.length > 0 && product.avgRating && (
            <div className="flex items-center gap-2">
              <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= Math.round(product.avgRating || 0)
                        ? 'text-amber-400 fill-amber-400'
                        : 'text-slate-300 dark:text-slate-600'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm text-slate-500 dark:text-slate-400">
                ({product.reviews.length} opiniones)
              </span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {formatPrice(currentPrice)}
            </span>
            {product.comparePrice && product.comparePrice > currentPrice && (
              <>
                <span className="text-xl text-slate-400 line-through">
                  {formatPrice(product.comparePrice)}
                </span>
                <span className="px-2 py-0.5 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 text-sm font-medium rounded-full">
                  -{Math.round((1 - currentPrice / product.comparePrice) * 100)}%
                </span>
              </>
            )}
          </div>

          {/* Description */}
          {product.description && (
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Variants */}
          {product.variants.length > 1 && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Variante
              </label>
              <div className="flex flex-wrap gap-2">
                {product.variants.map((variant) => (
                  <button
                    key={variant.id}
                    onClick={() => {
                      setSelectedVariant(variant)
                      setQuantity(1)
                    }}
                    disabled={variant.stock === 0}
                    className={`px-4 py-2 rounded-lg border-2 text-sm font-medium transition-colors ${
                      selectedVariant?.id === variant.id
                        ? 'border-amber-500 bg-amber-50 dark:bg-amber-900/20 text-amber-700 dark:text-amber-300'
                        : variant.stock === 0
                          ? 'border-slate-200 dark:border-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                          : 'border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-amber-300'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      {variant.colorHex && (
                        <span
                          className="w-4 h-4 rounded-full border border-slate-300"
                          style={{ backgroundColor: variant.colorHex }}
                        />
                      )}
                      {variant.name}
                      {variant.stock === 0 && ' (Agotado)'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Quantity */}
          {!isOutOfStock && (
            <div className="space-y-3">
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
                Cantidad
              </label>
              <div className="flex items-center gap-3">
                <div className="flex items-center border border-slate-300 dark:border-slate-600 rounded-lg">
                  <button
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium text-slate-800 dark:text-white">
                    {quantity}
                  </span>
                  <button
                    onClick={() => handleQuantityChange(1)}
                    disabled={quantity >= availableStock}
                    className="p-2 text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white disabled:opacity-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
                <span className="text-sm text-slate-500 dark:text-slate-400">
                  {availableStock} disponibles
                </span>
              </div>
            </div>
          )}

          {/* Total */}
          {!isOutOfStock && quantity > 1 && (
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
              <span className="text-slate-600 dark:text-slate-400">Total:</span>
              <span className="text-xl font-bold text-amber-600 dark:text-amber-400">
                {formatPrice(totalPrice)}
              </span>
            </div>
          )}

          {/* Reserve button */}
          {!isOutOfStock && !showReservationForm && (
            <button
              onClick={() => setShowReservationForm(true)}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              Reservar Producto
            </button>
          )}

          {/* Reservation form */}
          {showReservationForm && !isOutOfStock && (
            <form onSubmit={handleReserve} className="space-y-4 p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
              <div className="flex items-center gap-2 text-amber-600 dark:text-amber-400 mb-4">
                <AlertCircle className="w-5 h-5" />
                <p className="text-sm">
                  Completa tus datos para reservar. El vendedor se contactará contigo.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Nombre completo *
                </label>
                <input
                  type="text"
                  value={buyerName}
                  onChange={(e) => setBuyerName(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  placeholder="Tu nombre"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Teléfono (WhatsApp) *
                </label>
                <input
                  type="tel"
                  value={buyerPhone}
                  onChange={(e) => setBuyerPhone(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  placeholder="+52 123 456 7890"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={buyerEmail}
                  onChange={(e) => setBuyerEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  placeholder="tu@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                  Notas adicionales
                </label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={2}
                  className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-white dark:bg-slate-700 text-slate-800 dark:text-white"
                  placeholder="Cualquier mensaje para el vendedor..."
                />
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowReservationForm(false)}
                  className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Reservando...
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      Confirmar Reserva
                    </>
                  )}
                </button>
              </div>
            </form>
          )}

          {/* Contact info */}
          {product.store.whatsapp && (
            <div className="pt-4 border-t border-slate-200 dark:border-slate-700">
              <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">
                ¿Tienes preguntas?
              </p>
              <a
                href={`https://wa.me/${product.store.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(`Hola, tengo una pregunta sobre el producto "${product.name}"`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-green-600 dark:text-green-400 hover:underline"
              >
                <Phone className="w-4 h-4" />
                Contactar por WhatsApp
              </a>
            </div>
          )}
        </div>
      </div>

      {/* Reviews section */}
      {product.reviews.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">
            Opiniones de compradores
          </h2>

          <div className="space-y-4">
            {product.reviews.map((review) => (
              <div
                key={review.id}
                className="bg-white dark:bg-slate-800 rounded-xl p-4 shadow-sm"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                      <span className="text-sm font-medium text-amber-700 dark:text-amber-300">
                        {review.user.name.charAt(0).toUpperCase()}
                      </span>
                    </div>
                    <span className="font-medium text-slate-800 dark:text-white">
                      {review.user.name}
                    </span>
                  </div>
                  <div className="flex items-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`w-4 h-4 ${
                          star <= review.rating
                            ? 'text-amber-400 fill-amber-400'
                            : 'text-slate-300 dark:text-slate-600'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {review.title && (
                  <h4 className="font-medium text-slate-800 dark:text-white mb-1">
                    {review.title}
                  </h4>
                )}

                {review.comment && (
                  <p className="text-slate-600 dark:text-slate-300 text-sm">
                    {review.comment}
                  </p>
                )}

                <p className="text-xs text-slate-400 dark:text-slate-500 mt-2">
                  {new Date(review.createdAt).toLocaleDateString('es-MX', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
