import React, { useState, useEffect } from 'react'
import { uploadToCloudinary } from '../utils/cloudinaryHelper'

export const ProductFormModal = ({ isOpen, onClose, onSave, productToEdit, categories }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    barcode: '',
    sale_price: '',
    category: '',
    image: '',
    unit_type: 'unit'
  })

  const [isUploading, setIsUploading] = useState(false)

  useEffect(() => {
    if (productToEdit) {
      setFormData({
        id: productToEdit.id || null,
        name: productToEdit.name || '',
        barcode: productToEdit.barcode || '',
        sale_price: productToEdit.sale_price || '',
        category: productToEdit.category || '',
        image: productToEdit.image || '',
        unit_type: productToEdit.unit_type || 'unit'
      })
    } else {
      setFormData({
        id: null,
        name: '',
        barcode: '',
        sale_price: '',
        category: categories[0] || 'comercial y oficina',
        image: '',
        unit_type: 'unit'
      })
    }
  }, [productToEdit, categories, isOpen])

  if (!isOpen) return null

  // Manejo de la subida de imagen a Cloudinary
  const handleFileChange = async (e) => {
    const file = e.target.files[0]
    if (!file) return

    setIsUploading(true)
    const uploadedUrl = await uploadToCloudinary(file)

    if (uploadedUrl) {
      setFormData((prev) => ({ ...prev, image: uploadedUrl }))
    } else {
      alert('Ocurrió un error al subir la imagen. Por favor, intenta de nuevo.')
    }

    setIsUploading(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (isUploading) return

    if (!formData.name || !formData.sale_price) {
      alert('Por favor completa el nombre y el precio de venta.')
      return
    }

    onSave({
      ...formData,
      sale_price: parseFloat(formData.sale_price) || 0
    })
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        
        {/* Cabecera */}
        <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-slate-900/50">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>{formData.id ? '✏ Editar Producto' : '➕ Nuevo Producto'}</span>
          </h2>
          <button
            onClick={onClose}
            type="button"
            className="text-slate-400 hover:text-white transition-colors cursor-pointer text-lg"
          >
            ✕
          </button>
        </div>

        {/* Formulario con Scroll */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 text-sm">
          
          {/* Nombre */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">Nombre del Producto *</label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="Ej: Tinta P/Sello Sta x50cc"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Precio de venta */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Precio de Venta ($) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.sale_price}
                onChange={(e) => setFormData({ ...formData, sale_price: e.target.value })}
                placeholder="4140.00"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400 font-bold placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Código de barras */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Código de Barras</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="7798112020056"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Categoría */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
              <input
                type="text"
                list="category-suggestions"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="comercial y oficina"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
              />
              <datalist id="category-suggestions">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>

            {/* Tipo de Unidad */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Tipo de Unidad</label>
              <select
                value={formData.unit_type}
                onChange={(e) => setFormData({ ...formData, unit_type: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white focus:ring-2 focus:ring-indigo-500 focus:outline-none cursor-pointer"
              >
                <option value="unit">Unidad</option>
                <option value="package">Paquete</option>
                <option value="box">Caja</option>
              </select>
            </div>
          </div>

          {/* Sección de Imagen (Subida o URL manual) */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Imagen del Producto</label>
            
            {/* Subida de archivo a Cloudinary */}
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer disabled:opacity-50"
              />
            </div>

            {/* Indicador de carga */}
            {isUploading && (
              <p className="text-xs text-indigo-400 animate-pulse font-medium">
                ⏳ Subiendo imagen a Cloudinary...
              </p>
            )}

            {/* Campo de texto secundario / URL result e/ manual */}
            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="/imgs/products/... o https://..."
              className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-slate-300 placeholder-slate-500 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

            {/* Preview de la imagen */}
            {formData.image && !isUploading && (
              <div className="mt-2 flex items-center gap-3 p-2 bg-slate-800/50 border border-slate-800 rounded-xl">
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-12 h-12 object-contain rounded-lg bg-slate-900 p-1"
                  onError={(e) => (e.target.style.display = 'none')}
                />
                <span className="text-[11px] text-emerald-400 font-medium">
                  ✓ Imagen asignada correctamente
                </span>
              </div>
            )}
          </div>

          {/* Botones */}
          <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isUploading}
              className="px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium rounded-xl transition-colors cursor-pointer shadow-lg shadow-indigo-600/20 disabled:opacity-50"
            >
              {isUploading ? 'Subiendo...' : 'Guardar Cambios'}
            </button>
          </div>

        </form>

      </div>
    </div>
  )
}