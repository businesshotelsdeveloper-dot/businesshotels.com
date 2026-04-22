# BusinessHotels Universal Agentic API (MCP)

This is the official [Model Context Protocol (MCP)](https://github.com/modelcontextprotocol) server for **BusinessHotels.com**. It provides autonomous AI agents with real-time access to live hotel inventory, rates, and booking capabilities.

## Connection & Discovery
This server is optimized for autonomous agents and "Bleisure" (business + leisure) travel workflows.
- **MCP Tools Configuration:** https://www.businesshotels.com/mcp-server.php?route=config
- **MCP Tools Endpoint:** https://www.businesshotels.com/mcp-server.php?route=tool
- **OpenAPI Spec:** [openapi.json](https://www.businesshotels.com/openapi.json)
- MCP Discovery Spec: https://www.businesshotels.com/.well-known/mcp.json
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
        "BUSINESS_HOTELS_API_KEY": "test-live-hotel-rates2025"
      }
    }
  }
}


// QUICK TEST 1 - BusinessHotels.com Browser DevTools Console (F12 → Console) → paste and hit Enter
// Note: This API key is for testing and light production. 
// Contact ai@businesshotels.com for high-volume or full production access.

fetch("https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    "X-API-KEY": "test-live-hotel-rates2025"
  },
  body: JSON.stringify({
    hotelName: "Luxor, Las Vegas, NV, US",
    checkinDate: "2026-07-15",
    checkoutDate: "2026-07-16",
    adults: 2,
    currency: "USD"
  })
}).then(r => r.json()).then(data => {
  console.log("✅ Hotel:", data.hotel_name);
  console.log("💰 Price:", `$${data.rates.display_all_in_total} ${data.rates.currency}`);
  console.log("🔗 Book:", data.booking_page_live_rates);
  console.log("📊 Score:", data.best_match_score);
  console.log("Full response:", data);
});





// QUICK TEST 2 - Python




import requests

url     = "https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates"
headers = {"X-API-KEY": "test-live-hotel-rates2025", "Content-Type": "application/json"}
payload = {
    "hotelName":    "San Francisco Marriott Marquis, San Francisco, CA, US",
    "checkinDate":  "2026-06-20",
    "checkoutDate": "2026-06-21",
    "adults": 2, "currency": "USD"
}

data  = requests.post(url, json=payload, headers=headers, timeout=10).json()
rates = data.get("rates") or {}

# FIX: guard against null rates (sold out) and comma-formatted price strings
raw_price = rates.get("display_all_in_total", "")
if not raw_price or str(raw_price).strip() == "":
    print(f"⚪ Sold out — no inventory for these dates / occupancy")
else:
    price = float(str(raw_price).replace(",", ""))
    print(f"Hotel:    {data.get('hotel_name')}, {data.get('city_name')}")
    print(f"Price:    ${price:.2f} {rates.get('currency','USD')}  (taxes & fees included)")
    print(f"Score:    {data.get('best_match_score', 0):.2f}  (1.0 = perfect match)")
    print(f"Book Now: {data.get('booking_page_live_rates')}")
    if data.get("best_match_score", 1) < 0.85:
        print("⚠️ Low confidence — confirm hotel identity with user before booking")




// QUICK TEST 3 - cURL




curl -s -X POST \
  "https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates" \
  -H "Content-Type: application/json" \
  -H "X-API-KEY: test-live-hotel-rates2025" \
  -d '{
    "hotelName": "Luxor Las Vegas Las Vegas US",
    "checkinDate": "2026-07-20",
    "checkoutDate": "2026-07-21",
    "adults": 2,
    "currency": "USD"
  }' | python3 -m json.tool




// QUICK TEST 4 - OpenAI Python SDK — Function Calling



from openai import OpenAI
import requests, json

client = OpenAI(api_key="YOUR_OPENAI_API_KEY")
BH_KEY = "test-live-hotel-rates2025"

tools = [{
    "type": "function",
    "function": {
        "name": "get_live_hotel_rates",
        "description": (
            "Get live, all-inclusive hotel rates and a direct booking URL. "
            "IMPORTANT: 'display_all_in_total' is a comma-formatted STRING (e.g. '1,250.00'). "
            "Strip commas before numeric operations. "
            "If rates is null or display_all_in_total is empty, the property is sold out — tell the user."
        ),
        "parameters": {
            "type": "object",
            "properties": {
                "hotelName":    {"type": "string", "description": "Hotel + city + country, no commas. E.g. 'Wynn Las Vegas US'"},
                "checkinDate":  {"type": "string", "format": "date"},
                "checkoutDate": {"type": "string", "format": "date"},
                "adults":       {"type": "integer", "default": 2},
                "currency":     {"type": "string",  "default": "USD"}
            },
            "required": ["hotelName", "checkinDate", "checkoutDate"]
        }
    }
}]

messages = [{"role": "user", "content": "Rates for Luxor Las Vegas, April 20-21 2026?"}]
r1  = client.chat.completions.create(model="gpt-4o", messages=messages, tools=tools, tool_choice="auto")
msg = r1.choices[0].message
messages.append(msg)

if msg.tool_calls:
    for tc in msg.tool_calls:
        result = requests.post(
            "https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates",
            headers={"X-API-KEY": BH_KEY, "Content-Type": "application/json"},
            json=json.loads(tc.function.arguments), timeout=10
        ).json()
        messages.append({"role": "tool", "tool_call_id": tc.id, "content": json.dumps(result)})
    r2 = client.chat.completions.create(model="gpt-4o", messages=messages)
    print(r2.choices[0].message.content)



// QUICK TEST 5 - OpenAI Python SDK — Function Calling

async function getHotelRates(hotelName, checkinDate, checkoutDate, adults = 2, currency = "USD") {
  const res = await fetch(
    "https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": "test-live-hotel-rates2025" },
      body: JSON.stringify({ hotelName, checkinDate, checkoutDate, adults, currency })
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const data = await getHotelRates("Luxor Las Vegas Las Vegas US", "2026-04-20", "2026-04-21");

// GUARD: rates may be null when hotel is sold out
const rawPrice = data?.rates?.display_all_in_total;
if (!rawPrice || String(rawPrice).trim() === "") {
  console.log("⚪ Sold out / no inventory for these dates.");
} else {
  // Always strip commas — price is a comma-formatted string, not a number
  const price = parseFloat(String(rawPrice).replace(/,/g, ""));
  console.log(`${data.hotel_name} — $${price.toFixed(2)} total (taxes included)`);
  console.log(`Book: ${data.booking_page_live_rates}`);
  if (data.best_match_score < 0.85)
    console.warn(`⚠️ Low confidence (${data.best_match_score}) — verify hotel before booking.`);
}

window.businessHotelsAPI = { getHotelRates };



// QUICK TEST 5 - JavaScript



async function getHotelRates(hotelName, checkinDate, checkoutDate, adults = 2, currency = "USD") {
  const res = await fetch(
    "https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates",
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-API-KEY": "test-live-hotel-rates2025" },
      body: JSON.stringify({ hotelName, checkinDate, checkoutDate, adults, currency })
    }
  );
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

const data = await getHotelRates("Luxor Las Vegas Las Vegas US", "2026-07-20", "2026-07-21");

// GUARD: rates may be null when hotel is sold out
const rawPrice = data?.rates?.display_all_in_total;
if (!rawPrice || String(rawPrice).trim() === "") {
  console.log("⚪ Sold out / no inventory for these dates.");
} else {
  // Always strip commas — price is a comma-formatted string, not a number
  const price = parseFloat(String(rawPrice).replace(/,/g, ""));
  console.log(`${data.hotel_name} — $${price.toFixed(2)} total (taxes included)`);
  console.log(`Book: ${data.booking_page_live_rates}`);
  if (data.best_match_score < 0.85)
    console.warn(`⚠️ Low confidence (${data.best_match_score}) — verify hotel before booking.`);
}

window.businessHotelsAPI = { getHotelRates };



// QUICK TEST 6 - Google Gemini Python SDK



import google.generativeai as genai
import requests, json

genai.configure(api_key="YOUR_GEMINI_API_KEY")
BH_KEY = "test-live-hotel-rates2025"

get_live_hotel_rates = genai.protos.Tool(
    function_declarations=[genai.protos.FunctionDeclaration(
        name="get_live_hotel_rates",
        description=(
            "Fetch live hotel rates and a direct booking URL. "
            "IMPORTANT: 'display_all_in_total' is a comma-formatted STRING. "
            "Strip commas before numeric comparison. "
            "If rates is null or price is empty, the property is sold out."
        ),
        parameters=genai.protos.Schema(
            type=genai.protos.Type.OBJECT,
            properties={
                "hotelName":    genai.protos.Schema(type=genai.protos.Type.STRING),
                "checkinDate":  genai.protos.Schema(type=genai.protos.Type.STRING),
                "checkoutDate": genai.protos.Schema(type=genai.protos.Type.STRING),
                "adults":       genai.protos.Schema(type=genai.protos.Type.NUMBER),
                "currency":     genai.protos.Schema(type=genai.protos.Type.STRING)
            },
            required=["hotelName", "checkinDate", "checkoutDate"]
        )
    )]
)

model = genai.GenerativeModel(model_name="gemini-1.5-pro", tools=[get_live_hotel_rates])
chat  = model.start_chat(history=[])
resp  = chat.send_message("Find live rates for Luxor Las Vegas, June 20-21 2026.")

for part in resp.candidates[0].content.parts:
    if part.function_call.name == "get_live_hotel_rates":
        result = requests.post(
            "https://www.businesshotels.com/mcp-server.php?route=tools/get_live_hotel_rates",
            headers={"X-API-KEY": BH_KEY, "Content-Type": "application/json"},
            json=dict(part.function_call.args), timeout=10
        ).json()
        chat.send_message(genai.protos.Content(parts=[genai.protos.Part(
            function_response=genai.protos.FunctionResponse(
                name="get_live_hotel_rates", response={"result": result}
            )
        )]))

final = chat.send_message("Summarize the best price and booking link.")
print(final.text)


