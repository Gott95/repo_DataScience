import { API_BASE_URL } from "../config";
import type { PredictionRecord } from "../types/ChurnTypes";

export async function getHistory(): Promise<PredictionRecord[]> {
  const res = await fetch(`${API_BASE_URL}/api/churn/history`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
  return (await res.json()) as PredictionRecord[];
}
