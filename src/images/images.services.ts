// import { GoogleGenerativeAI } from "@google/generative-ai";
// import * as fs from "node:fs/promises";
// import * as path from "node:path";
// import { GenParams } from "./images.interface";

// function svgFallback(prompt: string, w = 1024, h = 1024) {
//   const safe = prompt.replace(/[&<>]/g, (c) => ({ "&":"&amp;","<":"&lt;",">":"&gt;" }[c]!));
//   return `
// <svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
//   <defs>
//     <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
//       <stop offset="0%" stop-color="#1e293b"/>
//       <stop offset="100%" stop-color="#334155"/>
//     </linearGradient>
//   </defs>
//   <rect width="100%" height="100%" fill="url(#g)"/>
//   <foreignObject x="48" y="48" width="${w-96}" height="${h-96}">
//     <div xmlns="http://www.w3.org/1999/xhtml"
//          style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
//                 color: white; font-size: 36px; line-height:1.25;">
//       <div style="opacity:.8; font-size:16px; margin-bottom:8px;">Demo (SVG fallback)</div>
//       <div>${safe}</div>
//     </div>
//   </foreignObject>
// </svg>`.trim();
// }

// export async function generateImage({ prompt, width = 1024, height = 1024 }: GenParams) {
//   const outDir = path.join(process.cwd(), "out");
//   await fs.mkdir(outDir, { recursive: true });

//   const key = process.env.GOOGLE_API_KEY;
//   if (!key) {
//     // fallback: SVG
//     const file = path.join(outDir, `img-${Date.now()}.svg`);
//     await fs.writeFile(file, svgFallback(prompt, width, height), "utf8");
//     return { filePath: file, uri: `file://${file}`, mimeType: "image/svg+xml" as const, provider: "svg-fallback" };
//   }

//   // Gemini / Imagen via AI Studio SDK
//   const genAI = new GoogleGenerativeAI(key);
//   const model = genAI.getGenerativeModel({ model: "imagen-3.0" });

//   const result = await model.generateImages({ prompt, width, height });
//   const b64 = result?.images?.[0]?.b64Json;
//   if (!b64) throw new Error("No image returned from Gemini/Imagen");

//   const buf = Buffer.from(b64, "base64");
//   const file = path.join(outDir, `img-${Date.now()}.png`);
//   await fs.writeFile(file, buf);
//   return { filePath: file, uri: `file://${file}`, mimeType: "image/png" as const, provider: "gemini-imagen" };
// }
