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

1. cURL (Mac / Linux / WSL / Git Bash)
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

