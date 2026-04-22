## Connection & Discovery
This server supports the **Model Context Protocol (MCP)** and is optimized for autonomous agents.

* **MCP Tools Endpoint:** `https://www.businesshotels.com/mcp-server.php?route=tools`
* **OpenAPI Spec:** [openapi.json](https://www.businesshotels.com/openapi.json)
* **Plugin Manifest:** [.well-known/ai-plugin.json](https://www.businesshotels.com/.well-known/ai-plugin.json)
* **Full API Documentation:** [Tool Configuration](https://www.businesshotels.com/tool-config.html)

## Quick Configuration (Claude/Desktop)
To add the Universal Agentic API to your local MCP settings:

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


## 🛠 Testing the API
You can test the BusinessHotels logic directly from your terminal to verify the live hotel rates:

### cURL (Linux/Mac/WSL)
```bash
curl -s -X POST "[https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates](https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates)" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: test-live-hotel-rates2025" \
  -d '{
    "hotelName": "Marriott Marquis, San Francisco, US",
    "checkinDate": "2026-07-15",
    "checkoutDate": "2026-07-16"
  }' | python3 -m json.tool

(Python)


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
