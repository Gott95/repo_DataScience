import { X } from 'lucide-react'
import { useEffect } from 'react'

interface ChurnDrawerProps {
  open: boolean
  onClose: () => void
  children: React.ReactNode
}

export default function ChurnDrawer({ open, onClose, children }: ChurnDrawerProps) {
  // Cierra el drawer si se presiona la tecla ESC
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Fondo oscuro con desenfoque (Backdrop) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Panel lateral (Drawer) */}
      <div className="relative w-full max-w-md h-full bg-[#1a1a1a] border-l border-gray-700 shadow-2xl flex flex-col animate-in slide-in-from-right duration-300">
        
        {/* Cabecera del Drawer */}
        <div className="flex items-center justify-between p-6 border-b border-gray-700 bg-gray-800/50">
          <h2 className="text-xl font-bold text-white">Nueva Predicción</h2>
          <button 
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Contenido del formulario (con scroll propio) */}
        <div className="flex-1 overflow-y-auto p-6">
          {children}
        </div>
      </div>
    </div>
  )
}