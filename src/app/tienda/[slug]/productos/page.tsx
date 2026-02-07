'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useSearchParams } from 'next/navigation'
import { Package, Star, Filter } from 'lucide-react'
import { api, formatPrice } from '@shared'

interface ProductImage {
  url: string
}

interface ProductVariant {
  id: string
  stock: number
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
  _count: { reviews: number }
  avgRating: number | null
}

interface Category {
  id: string
  name: string
  slug: string
  _count: { products: number }
}

export default function ProductosPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const slug = params.slug as string
  const categoryFilter = searchParams.get('category')

  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const categoryParam = categoryFilter ? `?category=${categoryFilter}` : ''
        const [productsRes, categoriesRes] = await Promise.all([
          api.get<Product[]>(`/stores/${slug}/products${categoryParam}`),
          api.get<Category[]>(`/stores/${slug}/categories`),
        ])
        setProducts(productsRes.data)
        setCategories(categoriesRes.data)
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    if (slug) {
      fetchData()
    }
  }, [slug, categoryFilter])

  const getTotalStock = (variants: ProductVariant[]) => {
    return variants.reduce((sum, v) => sum + v.stock, 0)
  }

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="animate-pulse">
          <div className="h-8 w-48 bg-slate-200 dark:bg-slate-700 rounded mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-72 bg-slate-200 dark:bg-slate-700 rounded-xl" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  const featuredProducts = products.filter((p) => p.isFeatured)
  const regularProducts = products.filter((p) => !p.isFeatured)

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">
          Productos
        </h1>

        {/* Categories filter */}
        {categories.length > 0 && (
          <div className="flex items-center gap-2 overflow-x-auto pb-2">
            <Filter className="w-4 h-4 text-slate-400 flex-shrink-0" />
            <Link
              href={`/tienda/${slug}/productos`}
              className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                !categoryFilter
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
              }`}
            >
              Todos
            </Link>
            {categories.map((cat) => (
              <Link
                key={cat.id}
                href={`/tienda/${slug}/productos?category=${cat.slug}`}
                className={`px-3 py-1.5 text-sm rounded-full whitespace-nowrap transition-colors ${
                  categoryFilter === cat.slug
                    ? 'bg-amber-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                {cat.name} ({cat._count.products})
              </Link>
            ))}
          </div>
        )}
      </div>

      {products.length === 0 ? (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
          <Package className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-slate-800 dark:text-white mb-2">
            No hay productos disponibles
          </h3>
          <p className="text-slate-500 dark:text-slate-400">
            {categoryFilter
              ? 'No hay productos en esta categoría'
              : 'Pronto habrá productos disponibles'}
          </p>
        </div>
      ) : (
        <>
          {/* Featured products */}
          {featuredProducts.length > 0 && !categoryFilter && (
            <section className="mb-10">
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4 flex items-center gap-2">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                Destacados
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {featuredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} slug={slug} getTotalStock={getTotalStock} />
                ))}
              </div>
            </section>
          )}

          {/* All products */}
          <section>
            {featuredProducts.length > 0 && !categoryFilter && (
              <h2 className="text-lg font-semibold text-slate-700 dark:text-slate-200 mb-4">
                Todos los productos
              </h2>
            )}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {(categoryFilter ? products : regularProducts).map((product) => (
                <ProductCard key={product.id} product={product} slug={slug} getTotalStock={getTotalStock} />
              ))}
            </div>
          </section>
        </>
      )}
    </div>
  )
}

function ProductCard({
  product,
  slug,
  getTotalStock,
}: {
  product: Product
  slug: string
  getTotalStock: (variants: ProductVariant[]) => number
}) {
  const totalStock = getTotalStock(product.variants)
  const isOutOfStock = totalStock === 0

  return (
    <Link
      href={`/tienda/${slug}/productos/${product.slug}`}
      className={`bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow group ${
        isOutOfStock ? 'opacity-60' : ''
      }`}
    >
      {/* Image */}
      <div className="aspect-square bg-slate-100 dark:bg-slate-700 relative overflow-hidden">
        {product.images[0] ? (
          <img
            src={product.images[0].url}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Package className="w-10 h-10 text-slate-300 dark:text-slate-600" />
          </div>
        )}

        {/* Badges */}
        <div className="absolute top-2 left-2 flex flex-col gap-1">
          {product.isFeatured && (
            <span className="px-2 py-0.5 bg-amber-500 text-white text-xs font-medium rounded-full flex items-center gap-1">
              <Star className="w-3 h-3 fill-white" />
              Destacado
            </span>
          )}
          {isOutOfStock && (
            <span className="px-2 py-0.5 bg-red-500 text-white text-xs font-medium rounded-full">
              Agotado
            </span>
          )}
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="px-2 py-0.5 bg-green-500 text-white text-xs font-medium rounded-full">
              -{Math.round((1 - product.price / product.comparePrice) * 100)}%
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-3">
        {product.category && (
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-1">
            {product.category.name}
          </p>
        )}
        <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-1 line-clamp-2 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
          {product.name}
        </h3>

        {/* Rating */}
        {product._count.reviews > 0 && product.avgRating && (
          <div className="flex items-center gap-1 mb-2">
            <div className="flex items-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-3 h-3 ${
                    star <= Math.round(product.avgRating || 0)
                      ? 'text-amber-400 fill-amber-400'
                      : 'text-slate-300 dark:text-slate-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              ({product._count.reviews})
            </span>
          </div>
        )}

        {/* Price */}
        <div className="flex items-center gap-2">
          <span className="font-bold text-amber-600 dark:text-amber-400">
            {formatPrice(product.price)}
          </span>
          {product.comparePrice && product.comparePrice > product.price && (
            <span className="text-xs text-slate-400 line-through">
              {formatPrice(product.comparePrice)}
            </span>
          )}
        </div>
      </div>
    </Link>
  )
}
