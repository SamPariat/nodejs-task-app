import { Router } from "express";
import multer from "multer";

import { auth } from "../middleware/auth.js";
import User from "../models/user.js";

const userRouter = Router();

// Set up multer
// Destination path is in 'dest'
// Max file size is 5MB
const multerUpload = multer({
  dest: "profile-images",
  limits: {
    fileSize: 5000000,
  },
  fileFilter(req, file, callback) {
    // Only allow png, jpg, jpeg files
    if (!file.originalname.match(/\.(png|jpg|jpeg)$/)) {
      return callback(
        new Error("Please upload either a .png, .jpeg or .jpg file")
      );
    }

    callback(null, true);
  },
});

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

userRouter.patch("/users/me", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["name", "email", "password", "age"];
  const isValidUpdate = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidUpdate) {
    return res.status(400).send({ error: "Invalid updates added" });
  }

  try {
    const user = req.user;

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

userRouter.delete("/users/me", auth, async (req, res) => {
  try {
    await req.user.deleteOne();

    res.status(200).send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

// The string in multerUpload.single must match the key in the request
userRouter.post(
  "/users/me/profile-img",
  multerUpload.single("img-upload"),
  (req, res) => {
    res.status(200).send();
  }
);

export default userRouter;
