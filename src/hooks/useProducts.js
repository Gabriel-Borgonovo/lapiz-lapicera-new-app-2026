import { useState, useEffect, useCallback } from 'react'
import { storageHelper } from '../utils/storageHelper'
import { backupHelper } from '../utils/backupHelper'

export const useProducts = () => {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  /**
   * Combina el catálogo estático con las modificaciones locales
   */
  const mergeCatalogs = (baseProducts, localChanges, customBackup) => {
  const sourceProducts = customBackup && customBackup.length > 0 ? customBackup : baseProducts

  if (!localChanges || localChanges.length === 0) {
    return sourceProducts
  }

  const productsMap = new Map()
  sourceProducts.forEach((p) => productsMap.set(String(p.id), { ...p }))

  localChanges.forEach((localProduct) => {
    const pId = String(localProduct.id)
    if (productsMap.has(pId)) {
      productsMap.set(pId, { ...productsMap.get(pId), ...localProduct })
    } else {
      productsMap.set(pId, { ...localProduct })
    }
  })

  return Array.from(productsMap.values())
}

  /**
   * Carga los datos de los productos combinando la fuente remota y local
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

      const mergedList = mergeCatalogs(baseProducts, localChanges, customBackup)
      setProducts(mergedList)
    } catch (err) {
      console.error('Error al inicializar productos:', err)
      setError(err.message)
      // Si falla la petición HTTP, intentar cargar al menos lo guardado en localStorage
      const localChanges = storageHelper.getLocalChanges()
      const customBackup = storageHelper.getFullBackup()
      if (customBackup || localChanges.length > 0) {
        setProducts(mergeCatalogs([], localChanges, customBackup))
      }
    } finally {
      setLoading(false)
    }
  }, [])

  // Carga inicial al montar el hook
  useEffect(() => {
    loadProducts()
  }, [loadProducts])

  // Escuchar sincronización multi-pestaña
  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'cat_modified_products' || e.key === 'cat_custom_backup') {
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
   * Exporta todo el catálogo actual formateado en un archivo .json
   */

  const exportBackup = () => {
    try {
      if (!products || products.length === 0) {
        console.warn("No hay productos para exportar")
        return
      }

      // Convertir el objeto/array a JSON
      const jsonString = JSON.stringify(products, null, 2)
      
      // Crear un Blob de tipo application/json
      const blob = new Blob([jsonString], { type: 'application/json' })
      
      // Crear URL del Blob
      const url = URL.createObjectURL(blob)
      
      // Crear elemento <a> temporal
      const downloadAnchor = document.createElement('a')
      downloadAnchor.href = url
      downloadAnchor.download = `backup_productos_${new Date().toISOString().slice(0, 10)}.json`
      
      // Trigger de clic y limpieza
      document.body.appendChild(downloadAnchor)
      downloadAnchor.click()
      
      // Limpieza de memoria
      document.body.removeChild(downloadAnchor)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error("Error al exportar el backup:", error)
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
   * Resetea todas las modificaciones locales y vuelve a los datos iniciales
   */
  const resetToBase = () => {
    if (confirm('¿Estás seguro de resetear los cambios? Se perderán las ediciones locales no exportadas.')) {
      storageHelper.clearAll()
      loadProducts()
    }
  }


  // Extraer la lista de categorías únicas de forma dinámica a partir de los productos
  const categories = Array.from(
    new Set(
      products
        .map((p) => p.category)
        .filter(Boolean) // descarta nulos o vacíos
    )
  ).sort();

  return {
    products,
    loading,
    error,
    categories,
    saveProduct,
    exportBackup,
    importBackup,
    resetToBase,
    reload: loadProducts,
  }
}