import { createPortal } from 'react-dom'
import type { PredictionRecord } from '../types/ChurnTypes'
import { Pie } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

export default function RiskModal({ open, onClose, history }: { open: boolean; onClose: () => void; history: PredictionRecord[] }) {
  if (!open) return null

  const high = history.filter(h => h.prediction?.toLowerCase().includes('high')).length
  const low = history.length - high

  const data = {
    labels: ['Low Risk', 'High Risk'],
    datasets: [
      {
        data: [low, high],
        backgroundColor: ['#10B981', '#EF4444'],
        hoverBackgroundColor: ['#059669', '#DC2626'],
      },
    ],
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => { onClose(); }} />
      <div className="relative w-full max-w-2xl mx-4 bg-gray-900 rounded-lg border border-gray-700 p-6 z-10">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Análisis de Riesgo</h3>
          <button onClick={() => { onClose(); }} className="text-gray-300 hover:text-white">Cerrar</button>
        </div>
        <div className="bg-gray-800 p-4 rounded">
          <Pie data={data} />
        </div>
      </div>
    </div>, document.body
  )
}
