import { Router } from "express";

import Task from "../models/task.js";

const taskRouter = Router();

taskRouter.post("/tasks", async (req, res) => {
  try {
    const task = new Task(req.body);

    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.get("/tasks", async (req, res) => {
  try {
    const tasks = await Task.find({});

    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

taskRouter.get("/tasks/:taskId", async (req, res) => {
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

taskRouter.patch("/tasks/:taskId", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates added" });
  }

  try {
    const task = await Task.findById(req.params.taskId);

    if (!task) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      task.set(update, req.body[update]);
    });

    await task.save();

    res.status(200).send(task);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

taskRouter.delete("/tasks/:taskId", async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.taskId);

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

export default taskRouter;
