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
exports.verifyAdmin = exports.verifyDispatcher = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
const verifyDispatcher = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = req.headers.authorization;
        if (value) {
            const realValue = value.split(" ")[1];
            if (realValue) {
                jsonwebtoken_1.default.verify(realValue, "secret", (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        return res.status(404).json({
                            message: "jwt payload error"
                        });
                    }
                    else {
                        const user = yield prisma.authModel.findUnique({
                            where: { id: payload }
                        });
                        if ((user === null || user === void 0 ? void 0 : user.role) === "admin" || (user === null || user === void 0 ? void 0 : user.role) === "dispatcher") {
                            next();
                        }
                        else {
                            return res.status(404).json({
                                message: "You're not authorized to handle this page",
                            });
                        }
                    }
                }));
            }
            else {
                return res.status(404).json({
                    message: "Token gotten not correct"
                });
            }
        }
        else {
            return res.status(404).json({
                message: "Invalid token"
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error found"
        });
    }
});
exports.verifyDispatcher = verifyDispatcher;
const verifyAdmin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const value = req.headers.authorization;
        if (value) {
            const realValue = value.split(" ")[1];
            if (realValue) {
                jsonwebtoken_1.default.verify(realValue, "secret", (err, payload) => __awaiter(void 0, void 0, void 0, function* () {
                    if (err) {
                        return res.status(404).json({
                            message: "jwt payload error"
                        });
                    }
                    else {
                        const user = yield prisma.authModel.findUnique({
                            where: { id: payload },
                        });
                        if ((user === null || user === void 0 ? void 0 : user.role) === "admin") {
                            next();
                        }
                        else {
                            return res.status(404).json({
                                message: "You're not authorized to handle this page",
                            });
                        }
                    }
                }));
            }
            else {
                return res.status(404).json({
                    message: "Token gotten not correct"
                });
            }
        }
        else {
            return res.status(404).json({
                message: "invalid Token"
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error Found"
        });
    }
});
exports.verifyAdmin = verifyAdmin;
