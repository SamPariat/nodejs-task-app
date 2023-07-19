import { Request, Response, Router } from "express";

import User, { IUser } from "../models/user";

const userRouter = Router();

userRouter.post("/users", async (req: Request, res: Response) => {
  try {
    const user = new User(req.body as IUser);

    await user.save();
    res.status(201).send(user);
  } catch (e) {
    res.status(400).send(e);
  }
});

userRouter.get("/users", async (req: Request, res: Response) => {
  try {
    const users = await User.find({});
    res.status(200).send(users);
  } catch (e) {
    res.status(500).send();
  }
});

userRouter.get("/users/:userId", async (req: Request, res: Response) => {
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

userRouter.patch("/users/:userId", async (req: Request, res: Response) => {
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

userRouter.delete("/users/:userId", async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.userId);

    if (!user) {
      return res.status(404).send();
    }

    res.status(200).send(user);
  } catch (e) {
    res.status(500).send();
  }
});

export default userRouter;
