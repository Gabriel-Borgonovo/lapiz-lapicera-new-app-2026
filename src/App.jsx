import React, { useState, useMemo } from 'react'
import { useProducts } from './hooks/useProducts'
import { Navbar } from './components/Navbar'
import { ProductSearch } from './components/ProductSearch'
import { ProductGrid } from './components/ProductGrid'
import { ProductFormModal } from './components/ProductFormModal'
import { BackupManagerModal } from './components/BackupManagerModal'

export default function App() {
  const {
    products,
    loading,
    categories,
    saveProduct,
    exportBackup,
    importBackup,
    resetToBase,
  } = useProducts()

  // Estados para Búsqueda y Filtros
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')

  // Estados para Modales
  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [isBackupModalOpen, setIsBackupModalOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)

  // Filtrado de Productos en Tiempo Real (Nombre, Código de Barras y Categoría)
  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Normalización de texto sin tildes para búsqueda flexible
      const term = searchTerm.toLowerCase().trim().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const productName = (p.name || '').toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      const barcode = (p.barcode || '').toLowerCase()

      const matchesSearch = !term || productName.includes(term) || barcode.includes(term)
      const matchesCategory = !selectedCategory || p.category === selectedCategory

      return matchesSearch && matchesCategory
    })
  }, [products, searchTerm, selectedCategory])

  // Handlers
  const handleOpenAddModal = () => {
    setEditingProduct(null)
    setIsFormModalOpen(true)
  }

  const handleOpenEditModal = (product) => {
    setEditingProduct(product)
    setIsFormModalOpen(true)
  }

  const handleSaveProduct = (formData) => {
    saveProduct(formData)
    setIsFormModalOpen(false) // Cierra el modal al guardar
  }

  const handleClearFilters = () => {
    setSearchTerm('')
    setSelectedCategory('')
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans antialiased">
      
      {/* 1. Header / Navbar */}
      <Navbar
        totalProducts={products.length}
        onOpenBackup={() => setIsBackupModalOpen(true)}
        onOpenAddModal={handleOpenAddModal}
        loading={loading}
      />

      {/* 2. Barra de Búsqueda y Filtros */}
      <ProductSearch
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
        categories={categories}
        resultsCount={filteredProducts.length}
        onClearFilters={handleClearFilters}
      />

      {/* 3. Grilla de Productos */}
      <div className="flex-grow">
        <ProductGrid
          products={filteredProducts}
          loading={loading}
          onEditProduct={handleOpenEditModal}
        />
      </div>

      {/* 4. Modales */}
      <ProductFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
        productToEdit={editingProduct}
        categories={categories}
      />

      <BackupManagerModal
        isOpen={isBackupModalOpen}
        onClose={() => setIsBackupModalOpen(false)}
        onExportJSON={exportBackup}
        onImportJSON={importBackup}
        onResetOriginal={resetToBase}
        totalProducts={products.length}
      />

    </div>
  )
}
