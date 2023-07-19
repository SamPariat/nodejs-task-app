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
const user_1 = __importDefault(require("../models/user"));
const userRouter = (0, express_1.Router)();
userRouter.post("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = new user_1.default(req.body);
        yield user.save();
        res.status(201).send(user);
    }
    catch (e) {
        res.status(400).send(e);
    }
}));
userRouter.get("/users", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield user_1.default.find({});
        res.status(200).send(users);
    }
    catch (e) {
        res.status(500).send();
    }
}));
userRouter.get("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
userRouter.patch("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
userRouter.delete("/users/:userId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield user_1.default.findByIdAndDelete(req.params.userId);
        if (!user) {
            return res.status(404).send();
        }
        res.status(200).send(user);
    }
    catch (e) {
        res.status(500).send();
    }
}));
exports.default = userRouter;
