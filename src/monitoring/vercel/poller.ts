import client from "prom-client";
import cron from "node-cron";
import { runProbe } from "../probe/probe.database";

let seenId: string | undefined;

const lastDeploy = new client.Gauge({
  name: "vercel_last_deploy_timestamp",
  help: "Timestamp of latest deployment",
  labelNames: ["project", "state"],
});

export const vercelPoll = async () => {
  const token = process.env.VERCEL_TOKEN!;
  const project = process.env.VERCEL_PROJECT!;

  const response = await fetch("https://api.vercel.com/v6/deployments", {
    method: "GET",
    headers: { Authorization: `Bearer ${token}` },
    body: JSON.stringify({
      project,
      limit: 1,
    }),
  });

  const data = await response.json();
  const d = data?.deployments?.[0];
  if (!d) return;

  const env =
    d.target ?? (d.meta?.githubCommitRef === "main" ? "production" : "preview");
  const tsSec = Math.floor((d.createdAt ?? d.created ?? Date.now()) / 1000);

  lastDeploy.labels(project, d.state, env).set(tsSec);

  if (d.uid !== seenId) {
    seenId = d.uid;
    await runProbe();
  }
};

export function scheduleVercelPolling() {
  if (!process.env.VERCEL_TOKEN || !process.env.VERCEL_PROJECT) return;
  cron.schedule("*/10 * * * *", () => {
    vercelPoll()
      .then(() => {
        console.log("Vercel poll successful");
      })
      .catch(console.error);
  });
}
