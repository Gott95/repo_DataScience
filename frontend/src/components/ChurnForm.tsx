import { useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import type { ChurnRequest, ChurnResponse } from "../types/ChurnTypes";
import { predictChurn } from "../services/apiService";

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
    setForm(prev => ({ ...prev, [name]: name === "tenure" || name === "usageTime" || name === "loginFrequency" || name === "totalSpend" ? Number(value) : value } as any));
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await predictChurn(form);
      setResult(res);
      if (res) onSuccess?.();
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Churn Prediction</h2>
      <form onSubmit={handleSubmit} className="space-y-3">
        <div>
          <label className="block text-sm text-gray-300">Antigüedad (meses)</label>
          <input name="tenure" type="number" value={form.tenure} onChange={handleChange} className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Tiempo de Uso (horas)</label>
          <input name="usageTime" type="number" value={form.usageTime} onChange={handleChange} className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Frecuencia de Acceso</label>
          <input name="loginFrequency" type="number" value={form.loginFrequency} onChange={handleChange} className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Facturación Total</label>
          <input name="totalSpend" type="number" value={form.totalSpend} onChange={handleChange} className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400" />
        </div>
        <div>
          <label className="block text-sm text-gray-300">Tipo de Contrato</label>
          <select name="contractType" value={form.contractType} onChange={handleChange} className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="month-to-month">Mensual</option>
            <option value="one-year">Anual</option>
            <option value="two-year">Dos Años</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300">Nivel de Suscripción</label>
          <select name="subscriptionType" value={form.subscriptionType} onChange={handleChange} className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="basic">Básico</option>
            <option value="standard">Estándar</option>
            <option value="premium">Premium</option>
          </select>
        </div>
        <div>
          <label className="block text-sm text-gray-300">Historial de Pagos</label>
          <select name="paymentRecord" value={form.paymentRecord} onChange={handleChange} className="w-full mt-1 p-2 rounded-lg bg-gray-900 border border-gray-700 focus:outline-none focus:ring-2 focus:ring-emerald-400">
            <option value="good">Excelente (Al día)</option>
            <option value="late">Con Retrasos (Pago Tardío)</option>
            <option value="missing">Mora (Falta de Pago)</option>
          </select>
        </div>
        <div className="mt-2">
          <button type="submit" disabled={loading} className="w-full py-2 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-semibold">{loading ? "Predicting..." : "Predecir"}</button>
        </div>
      </form>

      {error && <div className="mt-3 p-3 rounded bg-red-700 text-white">{error}</div>}

      {result && (
        <div className="mt-4 p-3 rounded-lg bg-gradient-to-r from-red-600 to-orange-500 text-white">
          <h3 className="font-bold">Resultado</h3>
          <div className="mt-2">Predicción: <strong>{result.prediction}</strong></div>
          <div>Probabilidad: <strong>{(result.probability * 100).toFixed(1)}%</strong></div>
          <div>Estado: <strong>{result.status}</strong></div>
        </div>
      )}
    </div>
  );
}
