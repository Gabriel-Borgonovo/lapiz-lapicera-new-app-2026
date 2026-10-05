import React from 'react'

export const ProductSearch = ({
  searchTerm,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  categories,
  resultsCount,
  onClearFilters
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 py-4 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-3 items-center justify-between">
        
        {/* Campo de Búsqueda por Texto / Código de Barras */}
        <div className="relative w-full md:w-1/2">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            🔍
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar por nombre o código de barras..."
            className="w-full pl-10 pr-10 py-2.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filtro por Categoría y Limpieza */}
        <div className="flex w-full md:w-auto items-center gap-3">
          <div className="relative w-full md:w-64">
            <select
              value={selectedCategory}
              onChange={(e) => onCategoryChange(e.target.value)}
              className="w-full py-2.5 px-3 bg-slate-800 border border-slate-700 rounded-xl text-white text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all cursor-pointer capitalize"
            >
              <option value="">Todas las categorías</option>
              {categories.map((cat) => (
                <option key={cat} value={cat} className="capitalize">
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {(searchTerm || selectedCategory) && (
            <button
              onClick={onClearFilters}
              className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-300 text-xs py-2.5 px-3 rounded-xl transition-colors whitespace-nowrap cursor-pointer"
            >
              Limpiar
            </button>
          )}
        </div>

      </div>

      {/* Indicador de Resultados */}
      <div className="max-w-7xl mx-auto mt-2 px-1 text-xs text-slate-400 flex items-center justify-between">
        <span>
          Mostrando <strong className="text-white">{resultsCount}</strong> productos encontrados
        </span>
      </div>
    </div>
  )
}