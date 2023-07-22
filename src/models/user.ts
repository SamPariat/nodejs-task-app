import { model, Schema } from "mongoose";
import isEmail from "validator/lib/isEmail";
import { hash } from "bcrypt";

export interface IUser {
  name: string;
  email: string;
  age: number;
  password: string;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    validate(value: string) {
      if (!isEmail(value)) {
        throw new Error("Email is invalid");
      }
    },
    trim: true,
    lowercase: true,
  },
  age: {
    type: Number,
    validate(value: number) {
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
    validate(value: string) {
      if (value.toLowerCase().includes("password")) {
        throw new Error('Password cannot contain "password"');
      }
    },
  },
});

userSchema.pre("save", async function (next) {
  const user = this;

  if (user.isModified("password")) {
    user.password = await hash(user.password, 8);
  }

  next();
});

const User = model<IUser>("User", userSchema);

export default User;
