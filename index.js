import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

import AuthRouter from "./Routes/AuthRouter.js";
import ChatRouter from "./Routes/ChatRouter.js";
import "./Models/db.js";

const app = express();
const PORT = process.env.PORT || 8080;

app.use(bodyParser.json());
app.use(cors());
app.use("/auth", AuthRouter);
app.use("/api/chat", ChatRouter);

app.get("/ping", (req, res) => {
  res.send("PONG");
});

app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
