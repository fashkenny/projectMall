"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mainApp_1 = require("./mainApp");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const port = parseInt(process.env.PORT);
const app = (0, express_1.default)();
(0, mainApp_1.mainApp)(app);
const server = app.listen(port, () => {
    console.log();
    console.log("Server connection established");
});
process.on("uncaughtException", (error) => {
    console.log("uncaughtException: ", error);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.log("unhandledRejection: ", reason);
    server.close(() => {
        process.exit(1);
    });
});
