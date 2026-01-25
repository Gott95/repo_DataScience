import type { PredictionRecord } from "../types/ChurnTypes";
import { PieChart, Plus, Mail } from 'lucide-react'

interface PredictionHistoryProps {
    history: PredictionRecord[];
    loading: boolean;
    onOpenRiskModal: () => void;
    onOpenDrawer: () => void;
}

// Función para manejar el envío del correo con datos dinámicos
const sendOfferEmail = (record: PredictionRecord) => {
    const randomEmail = `cliente.${Math.floor(Math.random() * 10000)}@empresa.com`;
    
    const subject = encodeURIComponent("Propuesta exclusiva: Plan de Fidelización");
    
    const riskPercentage = (record.probability * 100).toFixed(1);
    const customerRef = record.customerId || `#${record.id}`;
    
    const body = encodeURIComponent(`Hola,

Hemos detectado una oportunidad de retención para el cliente ${customerRef}.

Datos del Análisis:
- Nivel de Riesgo Detectado: ${riskPercentage}%
- Fecha de Análisis: ${new Date(record.createdAt).toLocaleDateString()}

Propuesta Sugerida:
Ofrecer un descuento del 20% en la renovación anual o una actualización gratuita al plan Premium por 3 meses.

Quedo a la espera de su confirmación para proceder.

Saludos,
Equipo de Customer Success`);


    window.location.href = `mailto:${randomEmail}?subject=${subject}&body=${body}`;
};

const getActionBadge = (record: PredictionRecord) => {
  const { probability } = record;

  if (probability < 0.5) {
    return (
      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-gray-800 text-gray-400 border border-gray-700 opacity-70 cursor-default">
         No necesaria
      </span>
    );
  } 
  
  if (probability >= 0.5 && probability < 0.6) {
    return (
      <button className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-medium bg-orange-900/30 text-orange-400 border border-orange-700/50 hover:bg-orange-900/50 transition-colors cursor-pointer">
         Evaluar
      </button>
    );
  } 
  
  return (
    <button 
        onClick={() => sendOfferEmail(record)}
        className="group/btn inline-flex items-center gap-2 px-3 py-1 rounded-md text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-900/20 transition-all cursor-pointer animate-in zoom-in duration-300 hover:scale-105 active:scale-95"
        title="Enviar propuesta por correo"
    >
        <Mail size={12} className="group-hover/btn:animate-bounce" />
        Crear Oferta
    </button>
  );
};

export default function PredictionHistory({ history, loading, onOpenRiskModal, onOpenDrawer }: PredictionHistoryProps) {
  return (
    <div className="flex flex-col h-full bg-gray-800/40 border border-gray-700 rounded-xl backdrop-blur-sm overflow-hidden">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-6 border-b border-gray-700 gap-4">
        <div>
            <h2 className="text-xl font-bold text-white">Historial de Predicciones</h2>
            <p className="text-sm text-gray-400 mt-1">Monitoreo de todos los análisis realizados</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={onOpenRiskModal} 
            className="flex items-center gap-2 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-gray-200 rounded-lg transition-colors border border-gray-600 text-sm font-medium"
          >
            <PieChart size={18} />
            Ver Métricas
          </button>
          
          <button 
            onClick={onOpenDrawer} 
            className="flex items-center gap-2 px-4 py-2 bg-cyan-600 hover:bg-cyan-500 text-white rounded-lg transition-colors shadow-lg shadow-cyan-900/20 text-sm font-bold"
          >
            <Plus size={18} />
            Nueva Predicción
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-auto max-h-[600px] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-transparent">
        <table className="min-w-full table-auto">
          <thead className="sticky top-0 bg-gray-800 z-10 text-xs text-gray-400 uppercase shadow-md">
            <tr>
              <th className="px-6 py-4 text-left font-semibold tracking-wider">Cliente ID</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wider">Fecha de Análisis</th>
              <th className="px-6 py-4 text-left font-semibold tracking-wider">Resultado</th>
              <th className="px-6 py-4 text-right font-semibold tracking-wider">Probabilidad</th>
              <th className="px-6 py-4 text-center font-semibold tracking-wider">Acción Recomendada</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-700/50">
            {history.map((r) => (
              <tr key={r.id} className="hover:bg-gray-700/30 transition-colors group">
                <td className="px-6 py-4 text-sm font-medium text-white">
                    {r.customerId ? r.customerId : <span className="text-gray-500 italic">#{r.id}</span>}
                </td>
                <td className="px-6 py-4 text-sm text-gray-400 whitespace-nowrap">
                    {new Date(r.createdAt).toLocaleString()}
                </td>
                <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${
                        r.prediction?.toLowerCase().includes('high') 
                        ? 'bg-red-900/30 text-red-400 border-red-800' 
                        : 'bg-emerald-900/30 text-emerald-400 border-emerald-800'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full mr-1.5 ${
                          r.prediction?.toLowerCase().includes('high') ? 'bg-red-500' : 'bg-emerald-500'
                      }`}></span>
                      {r.prediction}
                    </span>
                </td>
                <td className="px-6 py-4 text-sm text-right text-gray-300 font-mono">
                    {(r.probability * 100).toFixed(1)}%
                </td>
                <td className="px-6 py-4 text-center">
                    {getActionBadge(r)}
                </td>
              </tr>
            ))}
            
            {history.length === 0 && !loading && (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-gray-500 flex flex-col items-center justify-center">
                    <div className="bg-gray-800/50 p-4 rounded-full mb-3">
                        <PieChart size={32} className="opacity-20" />
                    </div>
                    <p>No hay predicciones registradas aún.</p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}