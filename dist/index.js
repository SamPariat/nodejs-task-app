"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const user_1 = __importDefault(require("./models/user"));
const task_1 = __importDefault(require("./models/task"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4040;
app.use(express_1.default.json());
app.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_1.default(req.body);
        yield user.save();
        res.status(201).send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
app.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        res.status(200).send(users);
    }
    catch (e) {
        res.status(500).send();
    }
}));
app.get("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.userId;
    try {
        const user = yield user_1.default.findById(_id);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    }
    catch (e) {
        res.status(500).send();
    }
}));
app.patch("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["name", "email", "password", "age"];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(400).send({ error: "Invalid updates added" });
    }
    try {
        const user = yield user_1.default.findByIdAndUpdate(req.params.userId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
app.post("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_1.default(req.body);
        yield task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
app.get("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_1.default.find({});
        res.status(200).send(tasks);
    }
    catch (e) {
        res.status(500).send();
    }
}));
app.get("/tasks/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const _id = req.params.taskId;
    try {
        const task = yield task_1.default.findById(_id);
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    }
    catch (e) {
        res.status(500).send();
    }
}));
app.patch("/tasks/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const updates = Object.keys(req.body);
    const allowedUpdates = ["description", "completed"];
    const isValidUpdate = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidUpdate) {
        return res.status(400).send({ error: "Invalid updates added" });
    }
    try {
        const task = yield task_1.default.findByIdAndUpdate(req.params.taskId, req.body, {
            new: true,
            runValidators: true,
        });
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    }
    catch (e) {
        console.log(e);
        res.status(400).send(e);
    }
}));
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    try {
        mongoose_1.default.connect("mongodb+srv://Sam:ABnyhd9c5qe9NM2y@cluster0.vnlpa5b.mongodb.net/?retryWrites=true&w=majority");
    }
    catch (e) {
        console.log("Error connecting to MongoDB Atlas");
    }
});
