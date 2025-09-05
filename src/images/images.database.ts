import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
import { generateImage } from "./images.services";
import { RequestBody } from "./images.interface";
const fs = require("fs");
const path = require("path");

const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  const getDir = process.cwd();
  const imagesDir = path.join(getDir, "public/generated");

  try {
    const files = fs.readdirSync(imagesDir);
    res.status(200).json({ message: "Images found" });
  } catch (err) {
    res.status(500).json({ error: "Unable to read images directory" });
  }
});

router.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const { prompt, width, height } = req.body as RequestBody;

      if (typeof prompt !== "string" || !prompt.trim()) {
        res.status(400).json({ error: "prompt (string) is required" });
        return;
      }

      const img = await generateImage({ prompt, width, height });
      console.log("Image generated:", img);
      res.status(200).json({ message: "Image generated", data: img });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
