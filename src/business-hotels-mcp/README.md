# BusinessHotels Universal Agentic API (MCP)

This is the official [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) server for **BusinessHotels.com**. It provides autonomous AI agents with real-time access to live hotel inventory, rates, and booking capabilities.

## Connection & Discovery
This server is optimized for autonomous agents and "Bleisure" (business + leisure) travel workflows.

- **MCP Tools Endpoint:** `https://www.businesshotels.com/mcp-server.php?route=tools`
- **OpenAPI Spec:** [openapi.json](https://www.businesshotels.com/openapi.json)
- **Plugin Manifest:** [.well-known/ai-plugin.json](https://www.businesshotels.com/.well-known/ai-plugin.json)
- **Full API Documentation:** [Tool Configuration](https://www.businesshotels.com/tool-config.html)

## Quick Configuration (Claude/Desktop)
To add the Universal Agentic API to your local MCP settings, paste this into your `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "businesshotels-universal-agentic-api": {
      "command": "npx",
      "args": ["-y", "@businesshotels/mcp-server"],
      "env": {
        "BUSINESS_HOTELS_API_KEY": "YOUR_KEY_HERE"
      }
    }
  }
}

🛠 Testing the API
Verify the live hotel rates and agentic matching logic directly from your terminal:

### 1. cURL (Mac / Linux / WSL / Git Bash)
# Bash — Quick terminal test with JSON formatting.

curl -s -X POST "[https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates](https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates)" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: test-live-hotel-rates2025" \
  -d '{
    "hotelName": "Marriott Marquis, San Francisco, US",
    "checkinDate": "2026-07-15",
    "checkoutDate": "2026-07-16",
    "adults": 2,
    "currency": "USD"
  }' | python3 -m json.tool


### 2. Python 3 (Production Ready)
**# Python — Best for backend logic. Includes "Sold Out" and "Confidence Score" guards.**
```python
import requests

url     = "[https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates](https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates)"
headers = {"X-API-KEY": "test-live-hotel-rates2025", "Content-Type": "application/json"}
payload = {
    "hotelName":    "Luxor Las Vegas Las Vegas US",
    "checkinDate":  "2026-07-20",
    "checkoutDate": "2026-07-21",
    "adults": 2, 
    "currency": "USD"
}

try:
    response = requests.post(url, json=payload, headers=headers, timeout=10)
    data = response.json()
    rates = data.get("rates") or {}
    raw_price = rates.get("display_all_in_total", "")

    if not raw_price or str(raw_price).strip() == "":
        print(f"⚪ Sold out — no inventory for these dates / occupancy")
    else:
        # Clean price string (handle commas) and convert to float
        price = float(str(raw_price).replace(",", ""))
        
        print(f"Hotel:    {data.get('hotel_name')}, {data.get('city_name')}")
        print(f"Price:    ${price:.2f} {rates.get('currency','USD')} (taxes & fees included)")
        print(f"Score:    {data.get('best_match_score', 0):.2f} (1.0 = perfect match)")
        print(f"Book Now: {data.get('booking_page_live_rates')}")
        
        if data.get("best_match_score", 1) < 0.85:
            print("⚠️ Low confidence — confirm hotel identity before booking")

except Exception as e:
    print(f"Error: {e}")


### 3. PowerShell (Windows Native)
# PowerShell — For Windows 10/11 terminal environments.

PowerShell
$body = @{
    hotelName = "Marriott Marquis, San Francisco, US"
    checkinDate = "2026-07-15"
    checkoutDate = "2026-07-17"
    adults = 2
    currency = "USD"
} | ConvertTo-Json

Invoke-RestMethod -Method POST `
    -Uri "[https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates](https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates)" `
    -Headers @{ "X-API-KEY" = "test-live-hotel-rates2025" } `
    -ContentType "application/json" `
    -Body $body
### 4. Browser DevTools Console
// JavaScript — Paste directly into F12 Console to test without an IDE.

JavaScript
fetch("[https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates](https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates)", {
    method: "POST",
    headers: {
        "Content-Type": "application/json",
        "X-API-KEY": "test-live-hotel-rates2025"
    },
    body: JSON.stringify({
        hotelName: "Marriott Marquis, San Francisco, US",
        checkinDate: "2026-07-15",
        checkoutDate: "2026-07-17",
        adults: 2,
        currency: "USD"
    })
}).then(r => r.json()).then(data => {
    console.log("✅ Hotel:", data.hotel_name);
    console.log("💰 Price:", `$${data.rates.display_all_in_total} ${data.rates.currency}`);
    console.log("📊 Match Score:", data.best_match_score);
});

