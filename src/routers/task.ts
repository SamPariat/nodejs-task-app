import { Request, Response, Router } from "express";

import Task, { ITask } from "../models/task";

const taskRouter = Router();

taskRouter.post("/tasks", async (req: Request, res: Response) => {
  try {
    const task = new Task(req.body as ITask);

    await task.save();
    res.status(201).send(task);
  } catch (e) {
    res.status(400).send(e);
  }
});

taskRouter.get("/tasks", async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find({});

    res.status(200).send(tasks);
  } catch (e) {
    res.status(500).send();
  }
});

taskRouter.get("/tasks/:taskId", async (req: Request, res: Response) => {
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

taskRouter.patch("/tasks/:taskId", async (req: Request, res: Response) => {
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

taskRouter.delete("/tasks/:taskId", async (req: Request, res: Response) => {
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
