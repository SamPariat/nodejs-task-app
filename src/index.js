import cookieParser from "cookie-parser";
import cors from "cors";
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

import taskRouter from "./routers/task.js";
import userRouter from "./routers/user.js";

const app = express();
const port = process.env.PORT || 4040;

app.use(express.json());

// Parse data from forms
app.use(express.urlencoded({ extended: false }));

// Middleware parses cookies send with forms
app.use(cookieParser());

// Enable cross origin resource sharing
app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
);

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:5173");
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  try {
    mongoose.connect(process.env.ATLAS_CONNECTION_URL);
  } catch (e) {
    console.log("Error connecting to MongoDB Atlas", e);
  }
});
