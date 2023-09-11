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
exports.changeAccountPassword = exports.resetAccountPassword = exports.verifiedAccount = exports.signInAccount = exports.deleteAccount = exports.updateAccountAvatar = exports.updateAccountInfo = exports.registerDispatcherAccount = exports.registerAccount = exports.viewOneAccount = exports.viewAccounts = void 0;
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cloudinary_1 = __importDefault(require("../utils/cloudinary"));
const streamifier_1 = __importDefault(require("streamifier"));
const roles_1 = require("../utils/roles");
const email_1 = require("../utils/email");
const prisma = new client_1.PrismaClient();
const viewAccounts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const user = yield prisma.authModel.findMany({});
        return res.status(200).json({
            message: "Viewing Account",
            data: user
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "An Error has occurred",
            data: error
        });
    }
});
exports.viewAccounts = viewAccounts;
const viewOneAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const user = yield prisma.authModel.findUnique({
            where: { id: userID }
        });
        return res.status(200).json({
            message: "Viewing One Account",
            data: user
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "An Error has occurred",
            data: error
        });
    }
});
exports.viewOneAccount = viewOneAccount;
const registerAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const value = crypto_1.default.randomBytes(16).toString("hex");
        const token = jsonwebtoken_1.default.sign(value, "justRand");
        const user = yield prisma.authModel.create({
            data: {
                userName,
                email,
                password: hashed,
                token,
                role: roles_1.role.USER,
            },
        });
        const tokenID = jsonwebtoken_1.default.sign({ id: user.id }, "justRand");
        (0, email_1.sendAccountOpeningMail)(user, tokenID);
        return res.status(201).json({
            message: "Account created successfully",
            data: user
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Registration failed",
            data: error,
        });
    }
});
exports.registerAccount = registerAccount;
const registerDispatcherAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userName, email, password, dispatchID } = req.body;
        const salt = yield bcrypt_1.default.genSalt(10);
        const hashed = yield bcrypt_1.default.hash(password, salt);
        const value = crypto_1.default.randomBytes(16).toString("hex");
        const token = jsonwebtoken_1.default.sign(value, "justRand");
        const searchData = [
            {
                id: 1
            },
            {
                id: 2
            },
            {
                id: 3
            },
            {
                id: 4
            }
        ];
        const findDispatcher = searchData.some((el) => {
            return el.id === dispatchID;
        });
        if (findDispatcher) {
            const user = yield prisma.authModel.create({
                data: {
                    userName,
                    email,
                    password: hashed,
                    token,
                    role: roles_1.role.DISPATCHER,
                },
            });
            const tokenID = jsonwebtoken_1.default.sign({ id: user.id }, "justRand");
            (0, email_1.sendAccountOpeningMail)(user, tokenID);
            return res.status(201).json({
                message: "Account created successfully",
                data: user
            });
        }
        else {
            return res.status(404).json({
                message: "Please check your Dispatcher ID",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Registration failed",
            data: error,
        });
    }
});
exports.registerDispatcherAccount = registerDispatcherAccount;
const updateAccountInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        const { userName } = req.body;
        const user = yield prisma.authModel.update({
            where: { id: userID },
            data: { userName }
        });
        return res.status(201).json({
            message: "Account updated successfully",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Update account info failed",
            data: error,
        });
    }
});
exports.updateAccountInfo = updateAccountInfo;
const updateAccountAvatar = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        let streamUpload = (req) => __awaiter(void 0, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
                let stream = yield cloudinary_1.default.uploader.upload_stream((error, result) => {
                    if (result) {
                        return resolve(result);
                    }
                    else {
                        return reject(error);
                    }
                });
                streamifier_1.default.createReadStream(req.file.buffer).pipe(stream);
            }));
        });
        const { secure_url, public_id } = yield streamUpload(req);
        const user = yield prisma.authModel.update({
            where: { id: userID },
            data: { avatar: secure_url, avatarID: public_id },
        });
        return res.status(201).json({
            message: "Account updated",
            data: user,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Update account avatar failed",
            data: error,
        });
    }
});
exports.updateAccountAvatar = updateAccountAvatar;
const deleteAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userID } = req.params;
        yield prisma.authModel.delete({
            where: { id: userID }
        });
        return res.status(201).json({
            message: "Account deleted",
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error  in deleting account"
        });
    }
});
exports.deleteAccount = deleteAccount;
const signInAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield prisma.authModel.delete({
            where: { id: email }
        });
        if (user) {
            const check = yield bcrypt_1.default.compare(password, user.password);
            if (check) {
                if (user.verified && user.token !== "") {
                    const token = jsonwebtoken_1.default.sign({
                        id: user.id,
                    }, "secret", { expiresIn: "3d" });
                    return res.status(201).json({
                        message: `Welcome back ${user.userName}`,
                        user: token,
                    });
                }
                else {
                    return res.status(404).json({
                        message: "Please go and verify your account",
                    });
                }
            }
            else {
                return res.status(401).json({
                    message: "incorrect password",
                });
            }
        }
        else {
            return res.status(404).json({
                message: "can't find user",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error processing request to user"
        });
    }
});
exports.signInAccount = signInAccount;
const verifiedAccount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const getID = jsonwebtoken_1.default.verify(token, "justRand", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload;
            }
        });
        const user = yield prisma.authModel.update({
            where: { id: getID },
            data: {
                verified: true,
                token: ""
            }
        });
        return res.status(201).json({
            message: "Account verified", data: user
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error  verifying acccount"
        });
    }
});
exports.verifiedAccount = verifiedAccount;
const resetAccountPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email } = req.body;
        const user = yield prisma.authModel.findUnique({
            where: { email },
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && user.token === "") {
            const token = jsonwebtoken_1.default.sign({ id: user.id }, "justRand");
            yield prisma.authModel.update({
                where: { id: user.id },
                data: {
                    token,
                },
            });
            (0, email_1.resetAccountPasswordMail)(user, token);
            return res.status(201).json({
                message: "You can now change your Password",
                data: token,
            });
        }
        else {
            return res.status(404).json({
                message: "can't reset this password",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error resetting acccount password"
        });
    }
});
exports.resetAccountPassword = resetAccountPassword;
const changeAccountPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { token } = req.params;
        const { password } = req.body;
        const getID = jsonwebtoken_1.default.verify(token, "justRand", (err, payload) => {
            if (err) {
                return err;
            }
            else {
                return payload.id;
            }
        });
        const user = yield prisma.authModel.findUnique({
            where: { id: getID },
        });
        if ((user === null || user === void 0 ? void 0 : user.verified) && user.token !== "") {
            const salt = yield bcrypt_1.default.genSalt(10);
            const hashed = yield bcrypt_1.default.hash(password, salt);
            yield prisma.authModel.update({
                where: { id: user.id },
                data: {
                    password: hashed,
                },
            });
            return res.status(201).json({
                message: "Your password has been changed",
            });
        }
        else {
            return res.status(404).json({
                message: "can't reset this password",
            });
        }
    }
    catch (error) {
        return res.status(404).json({
            message: "Error verifying Account",
        });
    }
});
exports.changeAccountPassword = changeAccountPassword;
