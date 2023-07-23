import { Router } from "express";

import { auth } from "../middleware/auth.js";
import User from "../models/user.js";

const userRouter = Router();

userRouter.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);

    await user.save();

    const token = user.generateAuthToken();

    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

userRouter.post("/users/login", async (req, res) => {
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    res.status(200).send({ user, token });
  } catch (e) {
    res.status(400).send();
  }
});

userRouter.post("/users/logout", auth, async (req, res) => {
  try {
    // Remove token that was used when authenticating
    req.user.tokens = req.user.tokens.filter((token) => {
      return token.token !== req.token;
    });
    await req.user.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

userRouter.post("/users/logout-all", auth, async (req, res) => {
  try {
    // Wipe out all the tokens that were used when authenticating
    req.user.tokens = [];
    await req.user.save();

    res.status(200).send();
  } catch (e) {
    res.status(500).send();
  }
});

userRouter.get("/users/me", auth, async (req, res) => {
  res.status(200).send(req.user);
});

userRouter.get("/users/:userId", async (req, res) => {
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

userRouter.patch("/users/:userId", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates added" });
  }

  try {
    const user = await User.findById(req.params.userId);

    if (!user) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      user.set(update, req.body[update]);
    });

    await user.save();

    res.status(200).send(user);
  } catch (e) {
    console.log(e);
    res.status(400).send(e);
  }
});

userRouter.delete("/users/:userId", async (req, res) => {
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
