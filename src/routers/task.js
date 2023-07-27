import { Router } from "express";

import { auth } from "../middleware/auth.js";
import Task from "../models/task.js";

const taskRouter = Router();

taskRouter.post("/tasks", auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, author: req.user._id });

    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.get("/tasks", auth, async (req, res) => {
  try {
    await req.user.populate("tasks");

    res.status(200).send(req.user.tasks);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

taskRouter.get("/tasks/:taskId", auth, async (req, res) => {
  const _id = req.params.taskId;

  try {
    const task = await Task.findOne({ _id, author: req.user._id });

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

taskRouter.patch("/tasks/:taskId", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates added" });
  }

  try {
    const task = await Task.findOne({
      _id: req.params.taskId,
      author: req.user._id,
    });

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

taskRouter.delete("/tasks/:taskId", auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.taskId,
      author: req.user._id,
    });

    if (!task) {
      return res.status(404).send();
    }

    res.status(200).send(task);
  } catch (e) {
    res.status(500).send();
  }
});

export default taskRouter;
