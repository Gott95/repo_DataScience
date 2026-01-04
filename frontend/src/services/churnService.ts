import type { PredictionRecord } from "../types/ChurnTypes";

export async function getHistory(): Promise<PredictionRecord[]> {
  const res = await fetch("http://localhost:8080/api/churn/history", {
    method: "GET",
    headers: { "Content-Type": "application/json" },
  });
  if (!res.ok) throw new Error(`Failed to fetch history: ${res.status}`);
  return (await res.json()) as PredictionRecord[];
}
