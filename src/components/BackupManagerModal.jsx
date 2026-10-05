import React from 'react'

export function BackupManagerModal({
  isOpen,
  onClose,
  onExportJSON,
  onImportJSON,
  onResetOriginal,
  totalProducts
}) {
  if (!isOpen) return null

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      onImportJSON(file)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl relative text-slate-100">
        
        {/* Botón cerrar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-1 flex items-center gap-2">
          ⚙️️ Gestor de Respaldo
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Actualmente tienes <strong className="text-indigo-400">{totalProducts}</strong> productos en catálogo. Puedes respaldar los cambios guardados o restablecer a los datos iniciales.
        </p>

        <div className="space-y-6">
          {/* Opción 1: Exportar */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-1 text-slate-200">1. Guardar copia de seguridad</h3>
            <p className="text-xs text-slate-400 mb-3">
              Descarga un archivo JSON actualizado con todos los precios modificados.
            </p>
            <button
              type="button"
              onClick={onExportJSON}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 font-medium text-xs rounded-xl transition-all shadow-lg shadow-indigo-600/20 active:scale-95"
            >
              📥 Descargar Backup JSON
            </button>
          </div>

          {/* Opción 2: Importar */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h3 className="text-sm font-semibold mb-1 text-slate-200">2. Cargar archivo JSON</h3>
            <p className="text-xs text-slate-400 mb-3">
              Restaura una copia previa o carga una nueva versión del archivo.
            </p>
            <label className="block w-full py-2.5 px-4 bg-slate-700 hover:bg-slate-650 text-center font-medium text-xs rounded-xl cursor-pointer transition-colors border border-slate-600">
              💻 Seleccionar Archivo JSON
              <input
                type="file"
                accept=".json"
                onChange={handleFileChange}
                className="hidden"
              />
            </label>
          </div>

          {/* Restablecer */}
          <div className="text-center pt-2">
            <button
              type="button"
              onClick={onResetOriginal}
              className="text-xs text-amber-400 hover:text-amber-300 font-medium hover:underline transition-colors"
            >
              ⚠️️ Restablecer datos originales del servidor
            </button>
          </div>
        </div>

      </div>
    </div>
  )
}