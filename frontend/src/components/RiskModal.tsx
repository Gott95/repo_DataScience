import { createPortal } from 'react-dom'
import type { PredictionRecord } from '../types/ChurnTypes'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'
import { X, PieChart } from 'lucide-react' // Usamos iconos consistentes

ChartJS.register(ArcElement, Tooltip, Legend)

interface RiskModalProps {
  open: boolean
  onClose: () => void
  history: PredictionRecord[]
}

export default function RiskModal({ open, onClose, history }: RiskModalProps) {
  if (!open) return null

  // Cálculos
  const high = history.filter(h => h.prediction?.toLowerCase().includes('high')).length
  const low = history.length - high

  // Configuración del gráfico
  const data = {
    labels: ['Bajo Riesgo', 'Alto Riesgo'],
    datasets: [
      {
        data: [low, high],
        backgroundColor: ['#10B981', '#EF4444'], // Emerald-500, Red-500
        hoverBackgroundColor: ['#059669', '#DC2626'],
        borderColor: '#1f2937', // Gray-800 (para que combine con el fondo)
        borderWidth: 2,
      },
    ],
  }

  const options = {
    plugins: {
      legend: {
        labels: { color: '#e5e7eb' } // Texto blanco para modo oscuro
      }
    }
  }

  return createPortal(
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      {/* Backdrop (Fondo oscuro) */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity" 
        onClick={onClose} 
      />
      
      {/* Contenido del Modal */}
      <div className="relative w-full max-w-lg bg-[#1a1a1a] rounded-xl border border-gray-700 shadow-2xl animate-in fade-in zoom-in duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-700">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gray-800 rounded-lg text-cyan-400">
                <PieChart size={20} />
            </div>
            <h3 className="text-xl font-bold text-white">Análisis de Riesgo</h3>
          </div>
          <button 
            onClick={onClose} 
            className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
            <div className="bg-gray-800/50 p-4 rounded-lg flex justify-center">
                <div className="w-64 h-64">
                    <Pie data={data} options={options} />
                </div>
            </div>
            
            <div className="mt-6 grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-emerald-900/20 border border-emerald-800 rounded-lg">
                    <div className="text-sm text-gray-400">Bajo Riesgo</div>
                    <div className="text-2xl font-bold text-emerald-400">{low}</div>
                </div>
                <div className="p-3 bg-red-900/20 border border-red-800 rounded-lg">
                    <div className="text-sm text-gray-400">Alto Riesgo</div>
                    <div className="text-2xl font-bold text-red-400">{high}</div>
                </div>
            </div>
        </div>
      </div>
    </div>, 
    document.body
  )
}
