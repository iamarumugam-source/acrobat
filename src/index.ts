import express, { type Request, type Response } from "express";
import dotenv from "dotenv";

import { slackApp } from "./slack";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.get("/", (req: Request, res: Response) => {
  res.send("✅ Slacky Express + TS server is running!");
});

(async () => {
  await slackApp.start(port);
  app.listen(8080);
  console.log(`⚡️ Slacky app running on http://localhost:${port}`);
  console.log(`⚡️ Express running on http://localhost:8080`);
})();
