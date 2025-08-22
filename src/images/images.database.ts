import express, { Request, Response } from "express";

const router = express.Router();

router.get("/", (req, res) => {
  res.json({ message: "Hello Word" });
});

router.post("", (req, res) => {
  const { prompt } = req.body;

  res.json({ message: "Image generated", data: prompt });
});

export default router;
