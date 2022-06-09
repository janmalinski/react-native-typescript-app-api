import express from "express";
import path from 'path';

import routes from "./routes";
import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
  throw result.error
}

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use("/api", routes);

export default app;
