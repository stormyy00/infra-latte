
import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
// import { z } from "zod";
// import { generateImage } from "./images/images.services";

const server = new McpServer({ name: "infra-mcp", version: "0.1.0" });

// server.tool(
//   "generate_image",
//   {
//     description: "Generate an image (Gemini/Imagen if KEY set, else SVG fallback).",
//     inputSchema: z.object({
//       prompt: z.string().min(1),
//       width: z.number().int().min(128).max(2048).optional(),
//       height: z.number().int().min(128).max(2048).optional(),
//     }),
//   },
//   async ({ prompt, width, height }) => {
//     const img = await generateImage({ prompt, width, height });
//     return {
//       content: [
//         { type: "image", mimeType: img.mimeType, uri: img.uri },
//         { type: "text", text: `provider: ${img.provider}` }
//       ],
//     };
//   }
// );

// IMPORTANT: do not console.log here; MCP uses stdio.
const transport = new StdioServerTransport();
// await server.connect(transport);
