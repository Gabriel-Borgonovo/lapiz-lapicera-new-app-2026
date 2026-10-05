/**
 * Helper para exportar e importar la base de datos de productos en formato JSON.
 */

export const backupHelper = {
  /**
   * Genera un archivo .json con los productos actuales y dispara su descarga.
   * @param {Array} products - Lista completa de productos combinados.
   */
  exportToJSON: (products) => {
    try {
      const dataStr = JSON.stringify(products, null, 2)
      const blob = new Blob([dataStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)

      // Generar nombre de archivo con fecha actual (YYYY-MM-DD)
      const dateStr = new Date().toISOString().split('T')[0]
      const fileName = `catalogo_productos_${dateStr}.json`

      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Error al exportar el respaldo JSON:', error)
      alert('Ocurrió un error al intentar exportar el catálogo.')
    }
  },

  /**
   * Lee un archivo JSON seleccionado por el usuario y retorna la lista parseada.
   * @param {File} file - Archivo .json subido por la clienta.
   * @returns {Promise<Array>} Promesa que resuelve la lista de productos.
   */
  importFromJSON: (file) => {
    return new Promise((resolve, reject) => {
      if (!file) {
        reject(new Error('No se seleccionó ningún archivo.'))
        return
      }

      if (file.type !== 'application/json' && !file.name.endsWith('.json')) {
        reject(new Error('El archivo debe tener formato .json.'))
        return
      }

      const reader = new FileReader()

      reader.onload = (event) => {
        try {
          const parsedData = JSON.parse(event.target.result)
          if (!Array.isArray(parsedData)) {
            throw new Error('El archivo JSON no contiene un arreglo válido de productos.')
          }
          resolve(parsedData)
        } catch (error) {
          reject(new Error('El archivo JSON está corrupto o tiene un formato inválido.'))
        }
      }

      reader.onerror = () => {
        reject(new Error('Error al leer el archivo desde el dispositivo.'))
      }

      reader.readAsText(file)
    })
  }
}