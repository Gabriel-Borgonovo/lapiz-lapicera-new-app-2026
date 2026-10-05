import React from 'react'
import { ProductCard } from './ProductCard'

export const ProductGrid = ({ products, loading, onEditProduct }) => {
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
        <p className="mt-4 text-slate-400 text-sm">Cargando catálogo de productos...</p>
      </div>
    )
  }

  if (!products || products.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center">
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-8 max-w-md mx-auto shadow-xl">
          <span className="text-4xl block mb-3">🔍</span>
          <h3 className="text-base font-semibold text-white mb-1">No se encontraron productos</h3>
          <p className="text-xs text-slate-400">
            Intenta ajustando el término de búsqueda o cambiando el filtro de categoría.
          </p>
        </div>
      </div>
    )
  }

  return (
    <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            onEdit={onEditProduct}
          />
        ))}
      </div>
    </main>
  )
}