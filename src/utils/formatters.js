/**
 * Formatea un número como moneda argentina (ej: $ 1.250,00 o $ 1.250).
 * @param {number|string} amount 
 * @returns {string}
 */
export const formatCurrency = (amount) => {
  const numericAmount = Number(amount) || 0
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    maximumFractionDigits: 2,
    minimumFractionDigits: 0
  }).format(numericAmount)
}

/**
 * Normaliza una cadena de texto eliminando tildes y convirtiéndola a minúsculas.
 * @param {string} text 
 * @returns {string}
 */
export const normalizeText = (text) => {
  if (!text) return ''
  return text
    .toString()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Elimina signos diacríticos (tildes)
    .trim()
}