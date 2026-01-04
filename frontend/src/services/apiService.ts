import type { ChurnRequest, ChurnResponse } from "../types/ChurnTypes";

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

  const res = await fetch("http://localhost:8080/api/churn/predict", {
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
