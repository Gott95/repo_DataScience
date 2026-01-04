export interface ChurnRequest {
  tenure: number;
  usageTime: number;
  loginFrequency: number;
  totalSpend: number;
  contractType: string;
  subscriptionType: string;
  paymentRecord: string;
}

export interface ChurnResponse {
  prediction: string;
  probability: number;
  status: string;
}

export interface PredictionRecord {
  id: number;
  customerId?: string | null;
  tenure?: number | null;
  totalSpend?: number | null;
  prediction: string;
  probability: number;
  createdAt: string;
}
