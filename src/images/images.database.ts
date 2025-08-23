import express, {
  type Request,
  type Response,
  type NextFunction,
} from "express";
// import { generateImage } from "./images.services";
import { RequestBody } from "./images.interface";
const router = express.Router();

router.get("/", (_req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World" });
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

      // const img = await generateImage({ prompt, width, height });
      // ^ ensure this returns a serializable object

      res.status(200).json({ message: "Image generated" });
    } catch (err) {
      next(err);
    }
  },
);

export default router;
