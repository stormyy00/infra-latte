import express from "express";
import cors from "cors";
import helmet from "helmet";
import bodyParser from "body-parser";

import userRoute from "./users/user.database";
import imageRoute from "./images/images.database";
import probeRoute from "./monitoring/probe/probe.database";
import metricsRoute from "./monitoring/metrics/metrics.database";
import { scheduleVercelPolling } from "./monitoring/vercel/poller";
import dotenv from "dotenv";
dotenv.config({ path: ".env" });
// if (!process.env.PORT) {
//     console.log(`No port value specified...`)
// }

const PORT = parseInt(process.env.PORT as string, 10) || 3000;
const isTest =
  process.env.NODE_ENV === "test" || process.env.JEST_WORKER_ID !== undefined;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(cors());
app.use(helmet());
app.use(bodyParser.json({ verify: (_req: any, _res, _buf) => {} }));
app.use((err: any, _req: any, res: any, _next: any) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

// app.use('/', (_req, res) => {
//   res.json({ message: "Welcome to Infra Latte API" });
// });
app.use(`/api/users`, userRoute);
app.use(`/api/image`, imageRoute);
app.use(`/api/probe`, probeRoute);
app.use(`/metrics`, metricsRoute);

if (!isTest) {
  scheduleVercelPolling();
  app.listen(PORT, () =>
    console.log(`Server is listening on port ${`http://localhost:${PORT}`}`),
  );
}

export default app;
