import { Fragment } from "react";
import type { PredictionRecord } from "../types/ChurnTypes";
import { PieChart } from 'lucide-react'

export default function PredictionHistory({ history, loading, onOpenRiskModal }: { history: PredictionRecord[]; loading: boolean; onOpenRiskModal: () => void }) {
  return (
    <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">Historial de Predicciones</h2>
          <div className="flex items-center gap-2">
          <button onClick={onOpenRiskModal} className="flex items-center gap-2 px-3 py-1 bg-emerald-600 hover:bg-emerald-500 text-white rounded">
            <PieChart size={16} />
            Ver Gráfico de Riesgo
          </button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead className="text-xs text-gray-400 uppercase border-b border-gray-700">
            <tr>
              <th className="px-3 py-2 text-left">Cliente</th>
              <th className="px-3 py-2 text-left">Fecha</th>
              <th className="px-3 py-2 text-left">Resultado</th>
              <th className="px-3 py-2 text-right">Probabilidad</th>
            </tr>
          </thead>
          <tbody className="text-sm text-gray-200">
            {history.map((r, idx) => (
              <Fragment key={r.id}>
                <tr className={`${idx % 2 === 0 ? 'bg-gray-900/40' : 'bg-gray-900/20'}`}>
                  <td className="px-3 py-3">{r.customerId ?? `#${r.id}`}</td>
                  <td className="px-3 py-3 text-gray-400">{new Date(r.createdAt).toLocaleString()}</td>
                  <td className="px-3 py-3">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${r.prediction?.toLowerCase().includes('high') ? 'bg-red-600 text-white' : 'bg-emerald-600 text-white'}`}>
                      {r.prediction}
                    </span>
                  </td>
                  <td className="px-3 py-3 text-right">{(r.probability * 100).toFixed(1)}%</td>
                </tr>
              </Fragment>
            ))}
            {history.length === 0 && !loading && (
              <tr>
                <td colSpan={4} className="px-3 py-6 text-center text-sm text-gray-500">No hay registros</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
