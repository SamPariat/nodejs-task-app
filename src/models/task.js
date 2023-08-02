import { Schema, model } from "mongoose";

const taskSchema = new Schema(
  {
    description: {
      type: String,
      trim: true,
      required: true,
    },
    completed: {
      type: Boolean,
      default: false,
    },
    // ref is a reference to the User model
    // 'User' is the string provided to the User model
    author: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    // Adds timestamps whenever a task is created or updated
    timestamps: true,
  }
);

const Task = model("Task", taskSchema);

export default Task;
