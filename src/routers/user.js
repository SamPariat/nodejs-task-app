import { Router } from "express";
import multer from "multer";
import sharp from "sharp";

import { auth } from "../middleware/auth.js";
import User from "../models/user.js";
import {
  sendWelcomeEmail,
  sendCancellationEmail,
} from "../../emails/account.js";

const userRouter = Router();

// Set up multer
// Destination path is in 'dest'
// Max file size is 5MB
const multerUpload = multer({
  // dest: "profile-images",
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

    // Send email when user creates their account
    await sendWelcomeEmail(user.email, user.name);

    const token = user.generateAuthToken();

    // Set the authentication token cookie when signed up
    res.cookie("auth_token", token);

    res.status(201).send({ user, token });
  } catch (e) {
    if (e.type === "MailgunAPIError") {
      return res.status(403).send();
    }
    res.status(400).send();
  }
});

userRouter.post("/users/login", async (req, res) => {
  console.log("Hello")
  try {
    const user = await User.findByCredentials(
      req.body.email,
      req.body.password
    );

    const token = await user.generateAuthToken();

    // Send the authentication token cookie when logged in
    res.cookie("auth_token", token);

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

    // Send email when the user deletes their account
    await sendCancellationEmail(req.user.email, req.user.name);

    res.status(200).send(req.user);
  } catch (e) {
    console.log(e);
    res.status(500).send();
  }
});

// The string in multerUpload.single must match the key in the request
// First make sure that the user is authenticated
// Then run the multer middleware
userRouter.post(
  "/users/me/profile-img",
  auth,
  multerUpload.single("img-upload"),
  async (req, res) => {
    // req.file.buffer allows to access the image if 'dest' is not specified
    const sharpBuffer = await sharp(req.file.buffer)
      .resize({
        width: 250,
        height: 250,
      })
      .png()
      .toBuffer();

    req.user.profileImage = sharpBuffer; // Save the profile image to the user after resizing and converting to .png format

    await req.user.save();
    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

userRouter.delete(
  "/users/me/profile-img",
  auth,
  async (req, res) => {
    req.user.profileImage = undefined;
    await req.user.save();
    res.status(200).send();
  },
  (error, req, res, next) => {
    res.status(400).send({ error: error.message });
  }
);

// Allow fetching of images
userRouter.get("/users/:userId/profile-img", async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);

    if (!user || !user.profileImage) {
      throw new Error();
    }

    res.setHeader("Content-Type", "image/png"); // Sharp reformats to .png
    res.status(200).send(user.profileImage);
  } catch (e) {
    res.status(404).send();
  }
});

export default userRouter;
