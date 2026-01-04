import { useEffect, useState } from 'react'
import './index.css'
import ChurnForm from './components/ChurnForm'
import PredictionHistory from './components/PredictionHistory'
import RiskModal from './components/RiskModal'
import { getHistory } from './services/churnService'
import type { PredictionRecord } from './types/ChurnTypes'

function StatsCard({ title, value, accentClass }: { title: string; value: string | number; accentClass?: string }) {
  return (
    <div className="p-4 rounded-lg bg-gray-800/60 border border-gray-700 backdrop-blur-sm">
      <div className="text-sm text-gray-300">{title}</div>
      <div className={`mt-2 text-2xl font-bold ${accentClass ?? 'text-white'}`}>{value}</div>
    </div>
  )
}

function App() {
  const [history, setHistory] = useState<PredictionRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  const [modalOpen, setModalOpen] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await getHistory()
      setHistory(data)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => { load() }, [refreshKey])

  const handlePredicted = () => {
    setRefreshKey(s => s + 1)
  }

  const total = history.length
  const today = new Date().toISOString().slice(0,10)
  const predictionsToday = history.filter(h => h.createdAt.slice(0,10) === today).length
  const highRisk = history.filter(h => h.prediction?.toLowerCase().includes('high')).length
  const riskRate = total === 0 ? 0 : Math.round((highRisk / total) * 100)

  return (
    <div className="min-h-screen bg-[#121212] text-white p-6 w-full">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-6">ChurnInsight Dashboard</h1>
        <h1 className="text-xl font-bold mb-6">Predicción de cancelación de clientes</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <StatsCard title="Total Análisis" value={total} />
          <StatsCard title="Predicciones Hoy" value={predictionsToday} />
          <StatsCard title="Tasa de Riesgo" value={`${riskRate}%`} accentClass="text-emerald-400" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-1">
            <div className="p-4 rounded-lg bg-gray-800/50 border border-gray-700">
              <ChurnForm onSuccess={handlePredicted} />
            </div>
          </div>
          <div className="md:col-span-2">
            <PredictionHistory history={history} loading={loading} onOpenRiskModal={() => setModalOpen(true)} />
          </div>
        </div>
      </div>

      <RiskModal open={modalOpen} onClose={() => setModalOpen(false)} history={history} />
      <h1 className="text-xl font-bold mb-6 text-right">Creado por Grupo-H12-25-L-Equipo-11-Data Science</h1>
    </div>
  )
}

export default App
