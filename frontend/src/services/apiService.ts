import type { ChurnRequest, ChurnResponse } from "../types/ChurnTypes";
import { API_BASE_URL } from "../config";


export async function predictChurn(request: ChurnRequest): Promise<ChurnResponse> {
  const body = JSON.stringify({
    tenure: request.tenure,
    usage_time: request.usageTime,
    login_frequency: request.loginFrequency,
    total_spend: request.totalSpend,
    contract_type: request.contractType,
    subscription_type: request.subscriptionType,
    payment_record: request.paymentRecord,
  });

  const res = await fetch(`${API_BASE_URL}/api/churn/predict`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed: ${res.status} ${text}`);
  }

  const data = await res.json();
  return data as ChurnResponse;
}
