import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

const server = new Server(
  {
    name: "business-hotels-mcp",
    version: "1.0.0",
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

/**
 * List available tools.
 */
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: "search_hotels",
        description: "Search for business hotels with real-time price verification",
        inputSchema: {
          type: "object",
          properties: {
            destination: { type: "string", description: "City or Airport code" },
            checkIn: { type: "string", description: "YYYY-MM-DD" },
            checkOut: { type: "string", description: "YYYY-MM-DD" },
          },
          required: ["destination", "checkIn", "checkOut"],
        },
      },
    ],
  };
});

/**
 * Handle tool execution.
 */
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  if (request.params.name === "search_hotels") {
    const { destination } = request.params.arguments as any;
    
    // Placeholder for your Priceline/PPS API logic
    return {
      content: [
        {
          type: "text",
          text: `Searching for premium business hotels in ${destination}... Connection to BusinessHotels.com API established.`,
        },
      ],
    };
  }
  throw new Error("Tool not found");
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error("BusinessHotels MCP server running on stdio");
}

main().catch((error) => {
  console.error("Server error:", error);
  process.exit(1);
});
