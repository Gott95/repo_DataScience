import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ChurnRequest, ChurnResponse } from "../types/ChurnTypes";
import { predictChurn } from "../services/apiService";
import { Loader2, CheckCircle, AlertCircle } from "lucide-react";

export default function ChurnForm({ onSuccess }: { onSuccess?: () => void } = {}) {
  const [form, setForm] = useState<ChurnRequest>({
    tenure: 12,
    usageTime: 0,
    loginFrequency: 0,
    totalSpend: 0,
    contractType: "month-to-month",
    subscriptionType: "basic",
    paymentRecord: "good",
  });

  const [result, setResult] = useState<ChurnResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: ["tenure", "usageTime", "loginFrequency", "totalSpend"].includes(name) ? Number(value) : value } as any));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await predictChurn(form);
      setResult(res);
      // Retrasamos un poco el cierre para que el usuario vea el resultado
      setTimeout(() => {
        if (res) onSuccess?.();
      }, 1500); 
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  // Clases comunes para inputs
  const inputClass = "w-full mt-1 p-2.5 rounded-lg bg-gray-900 border border-gray-700 text-gray-100 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 transition-colors";
  const labelClass = "block text-sm font-medium text-gray-400";

  return (
    <div className="space-y-6">
      {/* Mensaje de Resultado (aparece arriba si existe) */}
      {result && (
        <div className={`p-4 rounded-lg border ${result.prediction.toLowerCase().includes('high') ? 'bg-red-900/20 border-red-700 text-red-200' : 'bg-emerald-900/20 border-emerald-700 text-emerald-200'} animate-in fade-in zoom-in duration-300`}>
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle size={20} />
            <h3 className="font-bold text-lg">Predicción Completada</h3>
          </div>
          <div className="space-y-1 text-sm">
            <p>Resultado: <strong className="uppercase">{result.prediction}</strong></p>
            <p>Probabilidad: <strong>{(result.probability * 100).toFixed(1)}%</strong></p>
          </div>
        </div>
      )}

      {error && (
        <div className="p-3 rounded bg-red-900/50 border border-red-700 text-red-200 flex items-center gap-2">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
            <div className="col-span-1">
                <label className={labelClass}>Antigüedad (meses)</label>
                <input name="tenure" type="number" min="0" value={form.tenure} onChange={handleChange} className={inputClass} />
            </div>
            <div className="col-span-1">
                <label className={labelClass}>Uso (horas)</label>
                <input name="usageTime" type="number" min="0" value={form.usageTime} onChange={handleChange} className={inputClass} />
            </div>
        </div>

        <div>
          <label className={labelClass}>Frecuencia de Acceso (mensual)</label>
          <input name="loginFrequency" type="number" min="0" value={form.loginFrequency} onChange={handleChange} className={inputClass} />
        </div>

        <div>
          <label className={labelClass}>Facturación Total ($)</label>
          <input name="totalSpend" type="number" min="0" value={form.totalSpend} onChange={handleChange} className={inputClass} />
        </div>

        <div className="pt-2 border-t border-gray-700">
            <label className={labelClass + " mb-2"}>Detalles del Contrato</label>
            <div className="space-y-3">
                <select name="contractType" value={form.contractType} onChange={handleChange} className={inputClass}>
                    <option value="month-to-month">Mensual (Month-to-month)</option>
                    <option value="one-year">Un Año (One year)</option>
                    <option value="two-year">Dos Años (Two year)</option>
                </select>

                <select name="subscriptionType" value={form.subscriptionType} onChange={handleChange} className={inputClass}>
                    <option value="basic">Básico</option>
                    <option value="standard">Estándar</option>
                    <option value="premium">Premium</option>
                </select>
                
                <select name="paymentRecord" value={form.paymentRecord} onChange={handleChange} className={inputClass}>
                    <option value="good">Excelente (Al día)</option>
                    <option value="late">Con Retrasos</option>
                    <option value="missing">Mora (Falta de Pago)</option>
                </select>
            </div>
        </div>

        <div className="pt-4">
          <button 
            type="submit" 
            disabled={loading} 
            className="w-full py-3 px-4 rounded-lg bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold shadow-lg shadow-cyan-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {loading ? (
                <>
                    <Loader2 className="animate-spin" size={20} /> Procesando...
                </>
            ) : (
                "Calcular Riesgo de Churn"
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
