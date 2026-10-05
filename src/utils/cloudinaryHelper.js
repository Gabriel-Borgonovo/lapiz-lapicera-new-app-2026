// src/utils/cloudinaryHelper.js

const CLOUD_NAME = "pqomyq0t" // Tu Cloud Name obtenido del panel
const UPLOAD_PRESET = "catalogo_preset" // El nombre exacto que le pusiste al Upload Preset

/**
 * Suba un archivo de imagen a Cloudinary y retorna la URL pública.
 * @param {File} file Archivo seleccionado desde el input de HTML
 * @returns {Promise<string|null>} URL de la imagen subida o null si falla
 */
export const uploadToCloudinary = async (file) => {
  if (!file) return null

  const formData = new FormData()
  formData.append('file', file)
  formData.append('upload_preset', UPLOAD_PRESET)

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Error en la respuesta de Cloudinary')
    }

    const data = await response.json()
    return data.secure_url // URL https ligera para guardar en el producto
  } catch (error) {
    console.error('Error al subir la imagen a Cloudinary:', error)
    return null
  }
}