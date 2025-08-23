import { Router } from "express";
import { httpDuration, httpErrors } from "../metrics/metrics.database";
import type { ProbeTarget } from "./probe.interface";

const targets: ProbeTarget[] = [
  { name: "home", url: process.env.TARGET_URL! },
  { name: "api-health", url: `${process.env.TARGET_URL!}/api/health` },
];

export async function runProbe() {
  for (const t of targets) {
    const method = t.method ?? "GET";
    const start = process.hrtime.bigint();
    try {
      const res = await fetch(t.url, { method });
      const dur = Number(process.hrtime.bigint() - start) / 1e9;
      httpDuration.labels(t.name, method, String(res.status)).observe(dur);
      if (res.status >= 400)
        httpErrors.labels(t.name, String(res.status)).inc();
    } catch (e: any) {
      const dur = Number(process.hrtime.bigint() - start) / 1e9;
      const status = e?.response?.status ?? "ERR";
      httpDuration.labels(t.name, method, String(status)).observe(dur);
      httpErrors.labels(t.name, String(status)).inc();
    }
  }
}

const router = Router();
router.get("/", async (_req, res) => {
  await runProbe();
  res.json({ ok: true });
});
export default router;
