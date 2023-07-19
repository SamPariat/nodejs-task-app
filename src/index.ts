import express, { Request, Response } from "express";
import mongoose from "mongoose";
import "dotenv/config";

import User, { IUser } from "./models/user";
import Task, { ITask } from "./models/task";

const app = express();
const port = process.env.PORT || 4040;

app.use(express.json());

app.post("/users", async (req: Request, res: Response) => {
  try {
    const user = new User(req.body as IUser);

    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/users/:userId", async (req: Request, res: Response) => {
  const _id = req.params.userId;

  try {
    const user = await User.findById(_id);

    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

app.patch("/users/:userId", async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates added" });
  }

  try {
    const user = await User.findByIdAndUpdate(req.params.userId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.post("/tasks", async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body as ITask);

    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

app.get("/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({});

    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

app.get("/tasks/:taskId", async (req: Request, res: Response) => {
  const _id = req.params.taskId;

  try {
    const task = await Task.findById(_id);

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

app.patch("/tasks/:taskId", async (req: Request, res: Response) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates added" });
  }

  try {
    const task = await Task.findByIdAndUpdate(req.params.taskId, req.body, {
      new: true,
      runValidators: true,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
  try {
    mongoose.connect(process.env.ATLAS_CONNECTION_URL!);
  } catch (e) {
    console.log("Error connecting to MongoDB Atlas");
  }
});
