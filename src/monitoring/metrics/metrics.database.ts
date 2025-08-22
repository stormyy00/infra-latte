import { Router } from "express";
import client from "prom-client";
import type { LatencyLabels, ErrorLabels } from "./metrics.interface";

export const register = new client.Registry();
client.collectDefaultMetrics({ register, prefix: "monitor_" });

export const httpDuration = new client.Histogram<keyof LatencyLabels>({
  name: "probe_http_request_duration_seconds",
  help: "HTTP latency of probed endpoints",
  labelNames: ["target", "method", "status"],
  buckets: [0.05, 0.1, 0.2, 0.5, 1, 2, 5],
});
export const httpErrors = new client.Counter<keyof ErrorLabels>({
  name: "probe_http_errors_total",
  help: "Non-2xx responses",
  labelNames: ["target", "status"],
});

// Vercel deploy awareness (set by poller)
export const vercelLastDeploy = new client.Gauge({
  name: "vercel_last_deploy_unixtime",
  help: "Unix time of last seen deploy",
  labelNames: ["project", "state", "env"],
});

register.registerMetric(httpDuration);
register.registerMetric(httpErrors);
register.registerMetric(vercelLastDeploy);

const router = Router();
router.get("/", async (_req, res) => {
  res.set("Content-Type", register.contentType);
  res.end(await register.metrics());
});

export default router;
