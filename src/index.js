import "dotenv/config";
import express from "express";
import mongoose from "mongoose";

import taskRouter from "./routers/task.js";
import userRouter from "./routers/user.js";

const app = express();
const port = process.env.PORT || 4040;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  try {
    mongoose.connect(process.env.ATLAS_CONNECTION_URL);
  } catch (e) {
    console.log("Error connecting to MongoDB Atlas");
  }
});
