import React, { useState } from 'react'
import { formatCurrency } from '../utils/formatters'

export const ProductCard = ({ product, onEdit }) => {
  const [imgError, setImgError] = useState(false)

  const { name, barcode, sale_price, category, image, unit_type } = product

  return (
    <div className="bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-2xl overflow-hidden shadow-lg transition-all duration-200 flex flex-col justify-between group">
      
      {/* Cabecera / Imagen */}
      <div className="relative aspect-square w-full bg-slate-800 overflow-hidden flex items-center justify-center p-4">
        {!imgError && image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            onError={() => setImgError(true)}
            className="object-contain w-full h-full group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="flex flex-col items-center justify-center text-slate-500">
            <span className="text-3xl mb-1">📦</span>
            <span className="text-xs">Sin imagen</span>
          </div>
        )}

        {/* Badge Categoría */}
        {category && (
          <span className="absolute top-2 left-2 bg-slate-950/80 backdrop-blur-md text-slate-300 text-[10px] font-semibold px-2 py-0.5 rounded-md capitalize border border-slate-800">
            {category}
          </span>
        )}
      </div>

      {/* Contenido / Detalles */}
      <div className="p-4 flex flex-col flex-grow justify-between gap-3">
        <div>
          {/* Código de barras / Tipo de unidad */}
          <div className="flex items-center justify-between text-[11px] text-slate-400 mb-1">
            <span className="font-mono bg-slate-800/80 px-1.5 py-0.5 rounded text-slate-300">
              🏷️ {barcode || 'Sin código'}
            </span>
            {unit_type && (
              <span className="uppercase tracking-wider font-semibold text-[10px] text-indigo-400">
                {unit_type === 'unit' ? 'Unidad' : unit_type === 'package' ? 'Paquete' : unit_type}
              </span>
            )}
          </div>

          {/* Nombre del Producto */}
          <h3 className="text-sm font-semibold text-slate-100 line-clamp-2 leading-snug group-hover:text-indigo-400 transition-colors" title={name}>
            {name}
          </h3>
        </div>

        {/* Precio y Botón de Edición */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between">
          <div>
            <span className="text-[10px] text-slate-400 block uppercase tracking-wider">Precio Final</span>
            <span className="text-lg font-bold text-emerald-400">
              {formatCurrency(sale_price)}
            </span>
          </div>

          <button
            onClick={() => onEdit(product)}
            className="bg-slate-800 hover:bg-indigo-600 text-slate-300 hover:text-white text-xs font-medium px-3 py-1.5 rounded-lg transition-colors duration-200 cursor-pointer flex items-center gap-1 border border-slate-700 hover:border-indigo-500"
            title="Modificar precio o datos"
          >
            <span>✏️</span>
            <span>Editar</span>
          </button>
        </div>
      </div>

    </div>
  )
}