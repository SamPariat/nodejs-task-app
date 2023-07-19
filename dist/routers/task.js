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
const express_1 = require("express");
const task_1 = __importDefault(require("../models/task"));
const taskRouter = (0, express_1.Router)();
taskRouter.post("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = new task_1.default(req.body);
        yield task.save();
        res.status(201).send(task);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
taskRouter.get("/tasks", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const tasks = yield task_1.default.find({});
        res.status(200).send(tasks);
    }
    catch (e) {
        res.status(500).send();
    }
}));
taskRouter.get("/tasks/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
taskRouter.patch("/tasks/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
taskRouter.delete("/tasks/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const task = yield task_1.default.findByIdAndDelete(req.params.taskId);
        if (!task) {
            return res.status(404).send();
        }
        res.status(200).send(task);
    }
    catch (e) {
        res.status(500).send();
    }
}));
exports.default = taskRouter;
