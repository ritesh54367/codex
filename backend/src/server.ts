import express from "express";
import cors from "cors";
import helmet from "helmet";
import shareRoutes from "./routes/share.js";
import { config } from "./config.js";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json({ limit: "10mb" }));

app.get("/health", (_, res) => res.json({ ok: true }));
app.use("/api", shareRoutes);

app.listen(config.port, () => {
  console.log(`ShareGate backend listening on :${config.port}`);
});
