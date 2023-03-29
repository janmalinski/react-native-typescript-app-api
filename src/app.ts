import express from "express";
import path from 'path';
import admin from 'firebase-admin';

import routes from "./routes";
import dotenv from 'dotenv';

const result = dotenv.config();

if (result.error) {
  throw result.error
}

const firebaseAccount = require("../firebase.json");
admin.initializeApp({
  credential: admin.credential.cert(firebaseAccount),
});

const app = express();
app.use(express.static(path.join(__dirname, '../public')));
app.use(express.json());

app.use("/api", routes);

export default app;
