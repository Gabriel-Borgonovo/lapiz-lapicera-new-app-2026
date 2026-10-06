import React, { useState, useEffect } from 'react'
import { uploadToCloudinary } from '../utils/cloudinaryHelper'

export const ProductFormModal = ({ isOpen, onClose, onSave, productToEdit, categories }) => {
  const [formData, setFormData] = useState({
    id: null,
    name: '',
    barcode: '',
    purchase_price: '',
    profit_margin: '',
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
        purchase_price: productToEdit.purchase_price || '',
        profit_margin: productToEdit.profit_margin || '',
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
        purchase_price: '',
        profit_margin: '',
        sale_price: '',
        category: categories[0] || 'comercial y oficina',
        image: '',
        unit_type: 'unit'
      })
    }
  }, [productToEdit, categories, isOpen])

  if (!isOpen) return null

  // Handlers con cálculo automático
  const handlePurchasePriceChange = (e) => {
    const cost = parseFloat(e.target.value) || 0
    const margin = parseFloat(formData.profit_margin) || 0

    let calculatedSalePrice = formData.sale_price
    if (cost > 0 && margin >= 0) {
      calculatedSalePrice = (cost * (1 + margin / 100)).toFixed(2)
    }

    setFormData((prev) => ({
      ...prev,
      purchase_price: e.target.value,
      sale_price: calculatedSalePrice
    }))
  }

  const handleProfitMarginChange = (e) => {
    const margin = parseFloat(e.target.value) || 0
    const cost = parseFloat(formData.purchase_price) || 0

    let calculatedSalePrice = formData.sale_price
    if (cost > 0) {
      calculatedSalePrice = (cost * (1 + margin / 100)).toFixed(2)
    }

    setFormData((prev) => ({
      ...prev,
      profit_margin: e.target.value,
      sale_price: calculatedSalePrice
    }))
  }

  const handleSalePriceChange = (e) => {
    const sale = parseFloat(e.target.value) || 0
    const cost = parseFloat(formData.purchase_price) || 0

    let calculatedMargin = formData.profit_margin
    if (cost > 0 && sale > 0) {
      calculatedMargin = (((sale - cost) / cost) * 100).toFixed(2)
    }

    setFormData((prev) => ({
      ...prev,
      sale_price: e.target.value,
      profit_margin: calculatedMargin
    }))
  }

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
      purchase_price: formData.purchase_price ? parseFloat(formData.purchase_price).toFixed(2) : '0.00',
      profit_margin: formData.profit_margin ? parseFloat(formData.profit_margin).toFixed(2) : '0.00',
      sale_price: parseFloat(formData.sale_price).toFixed(2)
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
              placeholder="Ej: Tijera Sabonis TI-001"
              className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />
          </div>

          {/* Bloque de Cálculos de Precio */}
          <div className="p-3 bg-slate-800/40 border border-slate-800 rounded-xl space-y-3">
            <span className="text-[11px] font-semibold text-indigo-400 tracking-wider uppercase block">
              Estructura de Precios
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Precio de Compra */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Precio Compra ($)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.purchase_price}
                  onChange={handlePurchasePriceChange}
                  placeholder="1300.00"
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                />
              </div>

              {/* Porcentaje de Ganancia */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Ganancia (%)</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.profit_margin}
                  onChange={handleProfitMarginChange}
                  placeholder="90.00"
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-amber-400 font-bold placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                />
              </div>

              {/* Precio de Venta */}
              <div>
                <label className="block text-[11px] font-semibold text-slate-300 mb-1">Precio Venta ($) *</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.sale_price}
                  onChange={handleSalePriceChange}
                  placeholder="2470.00"
                  className="w-full px-2.5 py-1.5 bg-slate-800 border border-slate-700 rounded-xl text-emerald-400 font-bold placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-xs"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Código de barras */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Código de Barras</label>
              <input
                type="text"
                value={formData.barcode}
                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                placeholder="7502277852786"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white font-mono placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
              />
            </div>

            {/* Categoría */}
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">Categoría</label>
              <input
                type="text"
                list="category-suggestions"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="artistica"
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:ring-2 focus:ring-indigo-500 focus:outline-none capitalize"
              />
              <datalist id="category-suggestions">
                {categories.map((cat) => (
                  <option key={cat} value={cat} />
                ))}
              </datalist>
            </div>
          </div>

          <div>
            {/* Tipo de Unidad */}
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

          {/* Sección de Imagen */}
          <div className="space-y-2">
            <label className="block text-xs font-semibold text-slate-300">Imagen del Producto</label>
            
            <div className="flex items-center gap-2">
              <input
                type="file"
                accept="image/*"
                disabled={isUploading}
                onChange={handleFileChange}
                className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-600 file:text-white hover:file:bg-indigo-500 cursor-pointer disabled:opacity-50"
              />
            </div>

            {isUploading && (
              <p className="text-xs text-indigo-400 animate-pulse font-medium">
                ⏳ Subiendo imagen a Cloudinary...
              </p>
            )}

            <input
              type="text"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
              placeholder="https://..."
              className="w-full px-3 py-1.5 bg-slate-800/60 border border-slate-700/80 rounded-xl text-slate-300 placeholder-slate-500 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            />

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