import mongoose from "mongoose";

export interface ITask {
  description: string;
  completed: boolean;
}

const taskSchema = new mongoose.Schema<ITask>({
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

const Task = mongoose.model<ITask>("Task", taskSchema);

export default Task;
