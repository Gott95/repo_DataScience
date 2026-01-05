$json = @"
{
  "tenure": 12,
  "usage_time": 450.5,
  "login_frequency": 15,
  "total_spend": 60.0,
  "contract_type": "Month-to-Month",
  "subscription_type": "Basic",
  "payment_record": "Delayed"
}
"@

$response = Invoke-WebRequest -Uri 'http://localhost:8080/api/churn/predict' -Method Post -ContentType 'application/json' -Body $json

Write-Output "Status Code: $($response.StatusCode)"
Write-Output "Response Body:"
Write-Output ($response.Content | ConvertFrom-Json | ConvertTo-Json -Depth 5)
