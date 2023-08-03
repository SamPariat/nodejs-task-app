import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { Schema, model } from "mongoose";
import isEmail from "validator/lib/isEmail.js";

import Task from "./task.js";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      validate(value) {
        if (!isEmail(value)) {
          throw new Error("Email is invalid");
        }
      },
      trim: true,
      lowercase: true,
      unique: true,
    },
    age: {
      type: Number,
      validate(value) {
        if (value < 0) {
          throw new Error("Age must be a positive number");
        }
      },
      default: 0,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      trim: true,
      validate(value) {
        if (value.toLowerCase().includes("password")) {
          throw new Error('Password cannot contain "password"');
        }
      },
    },
    tokens: [
      {
        token: {
          type: String,
          required: true,
        },
      },
    ],
    profileImage: {
      // Allow storing of images in the buffer format
      type: Buffer,
    },
  },
  {
    // Adds timestamps whenever a user is created or updated
    timestamps: true,
  }
);

// Create a relationship between the User and the Task model
// Allows to create a reference to the Task model
userSchema.virtual("tasks", {
  ref: "Task",
  localField: "_id", // The field in the User model
  foreignField: "author", // The field in the Task model
});

// For an individual user - Accessed by 'user'
userSchema.methods.toJSON = function () {
  // toJSON() is a property of an object to override the default serialization behavior from
  // JSON.stringify()
  const user = this;

  // Converts the mongoose document into an object that can be manipulated
  const userObject = user.toObject();

  delete userObject.password;
  delete userObject.tokens;

  return userObject;
};

// For an individual user - Accessed by 'user'
userSchema.methods.generateAuthToken = async function () {
  const user = this;

  const token = jwt.sign({ _id: user._id.toString() }, process.env.SECRET_KEY, {
    expiresIn: "1 day",
  });

  user.tokens = user.tokens.concat({ token });
  await user.save();

  return token;
};

// For all users - Accessed by 'User'
userSchema.statics.findByCredentials = async function (email, password) {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error("Unable to log in");
  }

  const isPasswordMatch = await bcrypt.compare(password, user.get("password"));

  if (!isPasswordMatch) {
    throw new Error("Unable to login");
  }

  return user;
};

// Hash the password before saving / updating
userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await bcrypt.hash(user.password, 8);
  }

  next();
});

// Delete all the user's tasks when the user deletes their account
userSchema.post("deleteOne", async function (next) {
  const user = this;

  await Task.deleteMany({ author: user._id });

  next();
});

const User = model("User", userSchema);

export default User;
