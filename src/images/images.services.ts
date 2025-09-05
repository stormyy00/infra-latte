import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import { GenParams } from "./images.interface";
import { InferenceClient } from "@huggingface/inference";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
const client = new InferenceClient(process.env.HF_TOKEN);

function svgFallback(prompt: string, w = 1024, h = 1024) {
  const safe = prompt.replace(
    /[&<>]/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c]!,
  );
  return `
<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#334155"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <foreignObject x="48" y="48" width="${w - 96}" height="${h - 96}">
    <div xmlns="http://www.w3.org/1999/xhtml"
         style="font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif;
                color: white; font-size: 36px; line-height:1.25;">
      <div style="opacity:.8; font-size:16px; margin-bottom:8px;">Demo (SVG fallback)</div>
      <div>${safe}</div>
    </div>
  </foreignObject>
</svg>`.trim();
}

export async function generateImage({
  prompt,
  width = 1024,
  height = 1024,
}: {
  prompt: string;
  width?: number;
  height?: number;
}) {
  const outDir = path.join(process.cwd(), "public/generated");
  await fs.mkdir(outDir, { recursive: true });

  if (!process.env.HF_TOKEN) {
    throw new Error(
      "HF_TOKEN missing – create one at https://hf.co/settings/tokens (enable Inference Providers).",
    );
  }

  // Returns a Blob in Node (arrayBuffer() -> Buffer)
  // const image = await client.textToImage({
  //   provider: "fal-ai",
  //   model: "Qwen/Qwen-Image",
  //   inputs: prompt,
  //   parameters: {
  //     width,
  //     height,
  //     num_inference_steps: 25, // tweak as you like
  //     // guidance_scale: 4.5,
  //     // seed: 0,
  //     // negative_prompt: "blurry, low quality"
  //   },
  // }) as unknown as Blob;

  const image = await fetch(
    `${process.env.IMAGE_SERVER_URL}/api/generateimage`,
    {
      method: "POST",
      body: JSON.stringify({ prompt, width, height }),
      headers: { "Content-Type": "application/json" },
    },
  );

  console.log("Generated image from HF Inference API", image);
  if (!image) throw new Error("No image generated");
  const mime = "image/png";
  const ab = await image.arrayBuffer();
  const buf = Buffer.from(ab);

  const ext = mime.includes("jpeg") ? "jpg" : "png";
  const file = path.join(outDir, `img-${Date.now()}.${ext}`);
  await fs.writeFile(file, buf);

  return {
    message: "Image generated",
    data: {
      filePath: file,
      uri: `file://${file}`,
      mimeType: mime,
      provider: "hf:fal-ai/Qwen-Image",
      // include base64 for REST clients that want inline bytes:
      b64: buf.toString("base64"),
    },
  };
}

// export async function generateImage({
//   prompt,
//   width = 1024,
//   height = 1024,
// }: GenParams) {
//   const outDir = path.join(process.cwd(), "public/generated");
//   await fs.mkdir(outDir, { recursive: true });
//   console.log("Generating image with prompt:", prompt);
//   const key = process.env.GOOGLE_GEMINI_API_KEY;

//   if (!key) {
//     const file = path.join(outDir, `img-${Date.now()}.svg`);
//     await fs.writeFile(file, svgFallback(prompt, width, height), "utf8");
//     return {
//       filePath: file,
//       uri: `file://${file}`,
//       mimeType: "image/svg+xml" as const,
//       provider: "svg-fallback",
//     };
//   }
//   const genAI = new GoogleGenAI({ apiKey: key });

//   //  const genprompt = `You are an expert photo editor AI. Your task is to perform a natural, localized edit on the provided image based on the user's request.
//   // User Request: "${userPrompt}"
//   // Edit Location: Focus on the area around pixel coordinates (x: ${hotspot.x}, y: ${hotspot.y}).

//   // Editing Guidelines:
//   // - The edit must be realistic and blend seamlessly with the surrounding area.
//   // - The rest of the image (outside the immediate edit area) must remain identical to the original.

//   // Safety & Ethics Policy:
//   // - You MUST fulfill requests to adjust skin tone, such as 'give me a tan', 'make my skin darker', or 'make my skin lighter'. These are considered standard photo enhancements.
//   // - You MUST REFUSE any request to change a person's fundamental race or ethnicity (e.g., 'make me look Asian', 'change this person to be Black'). Do not perform these edits. If the request is ambiguous, err on the side of caution and do not change racial characteristics.

//   // Output: Return ONLY the final edited image. Do not return text.`;

//   //   const result = await genAI.models.generateContent({
//   //     model: "gemini-2.5-flash-image-preview",
//   //     contents: [{ parts: [{ text: prompt }] }],
//   //   });

//   const result = await genAI.models.generateImages({
//     model: "imagen-4.0-generate-001",
//     prompt: prompt,
//     config: {
//       numberOfImages: 1,
//     },
//   });

//   console.log("Received response from model for filter.", result);
//   //   const parts = result.candidates?.[0]?.content?.parts ?? [];
//   //   const imgPart = parts.find((p: any) => p?.inlineData?.data);
//   const imgPart = result.generatedImages?.[0];

//   if (!imgPart) {
//     throw new Error("No image returned from Gemini");
//   }

//   const img = result.generatedImages?.[0];
//   const b64 = img?.image?.imageBytes;

//   if (!b64) throw new Error("No image returned from Imagen");

//   const buf = Buffer.from(b64, "base64");
//   const file = path.join(outDir, `img-${Date.now()}.png`);
//   await fs.writeFile(file, buf);

//   return {
//     filePath: file,
//     uri: `file://${file}`,
//     mimeType: "image/png",
//     provider: "gemini-image",
//   };
// }
