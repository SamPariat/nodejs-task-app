import {Schema, model} from "mongoose";

export interface ITask {
  description: string;
  completed: boolean;
}

const taskSchema = new Schema<ITask>({
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

const Task = model<ITask>("Task", taskSchema);

export default Task;
