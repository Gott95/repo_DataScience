import { useEffect, useState } from 'react'
import './index.css'
import ChurnForm from './components/ChurnForm'
import PredictionHistory from './components/PredictionHistory'
import RiskModal from './components/RiskModal'
import ChurnDrawer from './components/ChurnDrawer' 
import { getHistory } from './services/churnService'
import type { PredictionRecord } from './types/ChurnTypes'
import { Activity, Users, TrendingUp } from 'lucide-react' 

// Componente pequeño para las cards
function StatsCard({ title, value, accentClass, icon: Icon }: { title: string; value: string | number; accentClass?: string, icon?: any }) {
  return (
    <div className="p-6 rounded-xl bg-gray-800/40 border border-gray-700 backdrop-blur-sm flex items-start justify-between hover:bg-gray-800/60 transition-colors">
      <div>
        <div className="text-sm font-medium text-gray-400 mb-1">{title}</div>
        <div className={`text-3xl font-bold ${accentClass ?? 'text-white'}`}>{value}</div>
      </div>
      {Icon && <div className="p-3 bg-gray-700/30 rounded-lg text-gray-400"><Icon size={24} /></div>}
    </div>
  )
}

function App() {
  const [history, setHistory] = useState<PredictionRecord[]>([])
  const [loading, setLoading] = useState(false)
  const [refreshKey, setRefreshKey] = useState(0)
  
  
  const [modalOpen, setModalOpen] = useState(false)
  const [drawerOpen, setDrawerOpen] = useState(false)

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
    setTimeout(() => setDrawerOpen(false), 1600);
  }

  const total = history.length
  const today = new Date().toISOString().slice(0,10)
  const predictionsToday = history.filter(h => h.createdAt.slice(0,10) === today).length
  const highRisk = history.filter(h => h.prediction?.toLowerCase().includes('high')).length
  const riskRate = total === 0 ? 0 : Math.round((highRisk / total) * 100)

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white font-sans selection:bg-cyan-500/30">
      
      
      <nav className="w-full border-b border-gray-800 bg-[#0f0f0f]/80 backdrop-blur sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
            <div className="flex items-center gap-3">
    
                <img 
                    src="/logo.png"
                    alt="ChurnInsight Logo" 
                    className="h-8 w-auto" 
                />

                
                <div className="leading-none"> 
                    <span className="font-bold text-xl tracking-tight text-white">Churn</span>
                    <span className="font-bold text-xl tracking-tight text-gray-400">Insight</span>
                </div>

            </div>
            <div className="text-xs text-gray-500 hidden sm:block">
                v1.0.0 • Data Science Equipo 11
            </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto p-6 space-y-8">
        
        
        <header className="py-4">
            <h1 className="text-3xl font-bold mb-2 bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                Dashboard de Retención
            </h1>
            <p className="text-gray-400">Visualiza el riesgo de tus clientes y genera nuevas predicciones con IA.</p>
        </header>

        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatsCard title="Total Análisis" value={total} icon={Users} />
          <StatsCard title="Predicciones Hoy" value={predictionsToday} icon={Activity} />
          <StatsCard title="Tasa de Riesgo Global" value={`${riskRate}%`} accentClass={riskRate > 50 ? "text-red-500" : "text-cyan-500"} icon={TrendingUp} />
        </div>

        
        <div className="w-full">
            <PredictionHistory 
                history={history} 
                loading={loading} 
                onOpenRiskModal={() => setModalOpen(true)}
                onOpenDrawer={() => setDrawerOpen(true)} 
            />
        </div>
      </main>

      
      <footer className="max-w-7xl mx-auto px-6 py-8 text-center border-t border-gray-800 mt-8">
        <p className="text-gray-600 text-sm">
            Creado por <strong>Grupo-H12-25-L-Equipo-11-Data Science</strong>
        </p>
      </footer>

      
      <RiskModal open={modalOpen} onClose={() => setModalOpen(false)} history={history} />
      
      <ChurnDrawer open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <ChurnForm onSuccess={handlePredicted} />
      </ChurnDrawer>

    </div>
  )
}

export default App
