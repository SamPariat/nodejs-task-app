"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const task_1 = __importDefault(require("./routers/task"));
const user_1 = __importDefault(require("./routers/user"));
const app = (0, express_1.default)();
const port = process.env.PORT || 4040;
app.use(express_1.default.json());
app.use(user_1.default);
app.use(task_1.default);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
    try {
        mongoose_1.default.connect(process.env.ATLAS_CONNECTION_URL);
    }
    catch (e) {
        console.log("Error connecting to MongoDB Atlas");
    }
});
