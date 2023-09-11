"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.mainApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const mainApp = (app) => {
    app.use(express_1.default.json());
    app.use((0, cors_1.default)());
    app.use((0, morgan_1.default)("dev"));
    app.use((0, helmet_1.default)());
    app.set("view engine", "ejs");
    app.get("/", (req, res) => {
        try {
            return res.status(200).json({
                message: "OK response from server",
            });
        }
        catch (error) {
            return res.status(404).json({
                message: "error occured while loading default response",
                data: error
            });
        }
    });
};
exports.mainApp = mainApp;
