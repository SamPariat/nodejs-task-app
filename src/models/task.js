import { Schema, model } from "mongoose";

const taskSchema = new Schema({
  description: {
    type: String,
    trim: true,
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
});

const Task = model("Task", taskSchema);

export default Task;
