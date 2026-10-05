// Claves únicas de almacenamiento en localStorage
const STORAGE_KEYS = {
  MODIFIED_PRODUCTS: 'cat_modified_products', // Cambios/nuevos guardados por el usuario
  CUSTOM_BACKUP: 'cat_custom_backup',         // Respaldo completo importado manualmente
}

/**
 * Obtiene los datos guardados en localStorage según una clave dada.
 * @param {string} key 
 * @returns {Array|Object|null}
 */
const getStorageItem = (key) => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : null
  } catch (error) {
    console.error(`Error al leer '${key}' desde localStorage:`, error)
    return null
  }
}

/**
 * Guarda datos en localStorage asegurando el formato JSON y capturando errores de cuota.
 * @param {string} key 
 * @param {any} value 
 * @returns {boolean} True si se guardó con éxito, False si falló.
 */
const setStorageItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (error) {
    console.error(`Error al guardar '${key}' en localStorage:`, error)
    if (error.name === 'QuotaExceededError' || error.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
      alert('¡Atención! Se ha alcanzado el límite de almacenamiento del navegador. Exporta un respaldo y limpia memoria.')
    }
    return false
  }
}

export const storageHelper = {
  /**
   * Obtiene la lista de modificaciones/productos nuevos locales.
   * @returns {Array} Lista de productos modificados o agregados por el usuario.
   */
  getLocalChanges: () => {
    return getStorageItem(STORAGE_KEYS.MODIFIED_PRODUCTS) || []
  },

  /**
   * Guarda o actualiza un producto individual en el almacenamiento local.
   * @param {Object} product - Objeto del producto a modificar o agregar.
   */
  saveProductChange: (product) => {
    const currentChanges = getStorageItem(STORAGE_KEYS.MODIFIED_PRODUCTS) || []
    const existingIndex = currentChanges.findIndex((p) => Number(p.id) === Number(product.id))

    let updatedChanges = []
    if (existingIndex >= 0) {
      // Reemplazar el producto modificado si ya existía en la lista local
      updatedChanges = [...currentChanges]
      updatedChanges[existingIndex] = { ...updatedChanges[existingIndex], ...product }
    } else {
      // Si es un producto nuevo o primera vez que se edita este id
      updatedChanges = [...currentChanges, product]
    }

    setStorageItem(STORAGE_KEYS.MODIFIED_PRODUCTS, updatedChanges)
  },

  /**
   * Guarda un respaldo completo (usado cuando el usuario importa un archivo JSON).
   * @param {Array} fullCatalog - Lista completa de productos importada.
   */
  saveFullBackup: (fullCatalog) => {
    setStorageItem(STORAGE_KEYS.CUSTOM_BACKUP, fullCatalog)
  },

  /**
   * Obtiene el respaldo completo previamente importado, si existe.
   * @returns {Array|null}
   */
  getFullBackup: () => {
    return getStorageItem(STORAGE_KEYS.CUSTOM_BACKUP)
  },

  /**
   * Limpia todos los datos locales para restaurar la aplicación al estado base original.
   */
  clearAll: () => {
    try {
      localStorage.removeItem(STORAGE_KEYS.MODIFIED_PRODUCTS)
      localStorage.removeItem(STORAGE_KEYS.CUSTOM_BACKUP)
    } catch (error) {
      console.error('Error al limpiar localStorage:', error)
    }
  }
}