import React from 'react'

export const Navbar = ({ totalProducts, onOpenBackup, onOpenAddModal, loading }) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 sticky top-0 z-30 shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Identidad / Logotipo */}
        <div className="flex items-center space-x-3">
          <div className="bg-indigo-600 text-white p-2 rounded-xl font-bold text-xl shadow-lg shadow-indigo-500/20">
            ✏️
          </div>
          <div>
            <h1 className="text-lg font-bold text-white leading-none">
              Lápiz y Lapicera
            </h1>
            <p className="text-xs text-slate-400 mt-1 flex items-center gap-1.5">
              <span>Catálogo de Productos</span>
              <span className="text-slate-600">•</span>
              <span className="bg-slate-800 text-indigo-400 font-medium px-2 py-0.5 rounded-full text-[10px]">
                {loading ? 'Cargando...' : `${totalProducts} items`}
              </span>
            </p>
          </div>
        </div>

        {/* Botones de acción principal */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            onClick={onOpenAddModal}
            className="bg-indigo-600 hover:bg-indigo-500 text-white text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <span className="text-base font-bold">+</span>
            <span className="hidden sm:inline">Nuevo Producto</span>
          </button>

          <button
            onClick={onOpenBackup}
            className="bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 text-xs sm:text-sm font-medium px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Gestión de Respaldo y Base de Datos"
          >
            <span>⚙️</span>
            <span className="hidden sm:inline">Respaldos</span>
          </button>
        </div>

      </div>
    </header>
  )
}