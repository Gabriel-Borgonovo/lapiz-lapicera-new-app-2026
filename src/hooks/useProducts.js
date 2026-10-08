import { useState, useEffect, useCallback } from 'react'
import { storageHelper } from '../utils/storageHelper'
import { backupHelper } from '../utils/backupHelper'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Combina el catálogo estático con las modificaciones locales y descarta los eliminados
   */
  const mergeCatalogs = (baseProducts, localChanges, customBackup, deletedIds = []) => {
    const sourceProducts = customBackup && customBackup.length > 0 ? customBackup : baseProducts

    const productsMap = new Map()
    sourceProducts.forEach((p) => productsMap.set(String(p.id), { ...p }))

    // Aplicar modificaciones y nuevos productos locales
    if (localChanges && localChanges.length > 0) {
      localChanges.forEach((localProduct) => {
        const pId = String(localProduct.id)
        if (productsMap.has(pId)) {
          productsMap.set(pId, { ...productsMap.get(pId), ...localProduct })
        } else {
          productsMap.set(pId, { ...localProduct })
        }
      })
    }

    // Filtrar los productos marcados como eliminados
    const deletedSet = new Set(deletedIds.map(String))
    return Array.from(productsMap.values()).filter((p) => !deletedSet.has(String(p.id)))
  }

  /**
   * Carga los datos de los productos combinando la fuente remota, local y eliminados
   */
  const loadProducts = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const response = await fetch('/data/products.json')
      if (!response.ok) {
        throw new Error('No se pudo cargar el archivo estático /data/products.json')
      }
      const baseProducts = await response.json()

      const localChanges = storageHelper.getLocalChanges()
      const customBackup = storageHelper.getFullBackup()
      const deletedIds = storageHelper.getDeletedIds()

      const mergedList = mergeCatalogs(baseProducts, localChanges, customBackup, deletedIds)
      setProducts(mergedList)
    } catch (err) {
      console.error('Error al inicializar productos:', err)
      setError(err.message)
      // Si falla la petición HTTP, cargar al menos lo presente en localStorage
      const localChanges = storageHelper.getLocalChanges()
      const customBackup = storageHelper.getFullBackup()
      const deletedIds = storageHelper.getDeletedIds()

      if (customBackup || localChanges.length > 0) {
        setProducts(mergeCatalogs([], localChanges, customBackup, deletedIds))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Carga inicial al montar el hook
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Escuchar sincronización multi-pestaña (incluyendo eliminación de productos)
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (
        e.key === 'cat_modified_products' ||
        e.key === 'cat_custom_backup' ||
        e.key === 'cat_deleted_products'
      ) {
        loadProducts()
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [loadProducts])

  /**
   * Agrega un nuevo producto o actualiza uno existente
   */
  const saveProduct = (productData) => {
    let newProduct = { ...productData }

    if (!newProduct.id) {
      // Asignar ID único basado en el timestamp actual
      newProduct.id = Date.now()
    }

    // Asegurar que el precio sea numérico
    newProduct.sale_price = Number(newProduct.sale_price) || 0

    // Guardar cambio local en localStorage
    storageHelper.saveProductChange(newProduct)

    // Actualizar estado en React al instante
    setProducts((prevProducts) => {
      const index = prevProducts.findIndex((p) => String(p.id) === String(newProduct.id))
      if (index >= 0) {
        const updated = [...prevProducts]
        updated[index] = { ...updated[index], ...newProduct }
        return updated
      }
      return [newProduct, ...prevProducts]
    })
  }

  /**
   * Elimina un producto por su ID
   */
  const deleteProduct = (productId) => {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      storageHelper.saveDeletedId(productId)
      setProducts((prevProducts) =>
        prevProducts.filter((p) => String(p.id) !== String(productId))
      )
    }
  }

  /**
   * Exporta todo el catálogo actual formateado en un archivo .json
   */
  const exportBackup = () => {
    try {
      if (!products || products.length === 0) {
        console.warn('No hay productos para exportar')
        return
      }

      const jsonString = JSON.stringify(products, null, 2)
      const blob = new Blob([jsonString], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      const downloadAnchor = document.createElement('a')
      downloadAnchor.href = url
      downloadAnchor.download = `backup_productos_${new Date().toISOString().slice(0, 10)}.json`

      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()

      document.body.removeChild(downloadAnchor)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al exportar el backup:', error)
    }
  }

  /**
   * Importa una lista desde un archivo JSON subido
   */
  const importBackup = async (file) => {
    try {
      const importedProducts = await backupHelper.importFromJSON(file)
      storageHelper.saveFullBackup(importedProducts)
      setProducts(importedProducts)
      return { success: true, count: importedProducts.length }
    } catch (err) {
      console.error('Error durante la importación:', err)
      alert(err.message || 'Error al importar el archivo JSON')
      return { success: false, error: err.message }
    }
  }

  /**
   * Resetea todas las modificaciones y eliminaciones locales
   */
  const resetToBase = () => {
    if (confirm('¿Estás seguro de resetear los cambios? Se perderán las ediciones y eliminaciones locales no exportadas.')) {
      storageHelper.clearAll()
      loadProducts()
    }
  }

  // Extraer la lista de categorías únicas de forma dinámica a partir de los productos
  const categories = Array.from(
    new Set(
      products
        .map((p) => p.category)
        .filter(Boolean)
    )
  ).sort()

  return {
    products,
    loading,
    error,
    categories,
    saveProduct,
    deleteProduct, // <--- Nueva función expuesta
    exportBackup,
    importBackup,
    resetToBase,
    reload: loadProducts,
  }
}