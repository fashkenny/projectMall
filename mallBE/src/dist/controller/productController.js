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
exports.payment = exports.detailedProduct = exports.readProducts = void 0;
const client_1 = require("@prisma/client");
const https_1 = __importDefault(require("https"));
const prisma = new client_1.PrismaClient();
const readProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const product = yield prisma.productModel.findMany({});
        return res.status(201).json({
            message: "view Product",
            data: product,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: "Error",
        });
    }
});
exports.readProducts = readProducts;
// export const createProduct = async (req: any, res: Response) => {
//   try {
//     const { title, cost, image } = req.body;
//     const product = await prisma.productModel.create({
//       data: { title, cost, image },
//     });
//     return res.status(201).json({
//       message: "create Product",
//       data: product,
//     });
//   } catch (error) {
//     return res.status(404).json({
//       message: error,
//     });
//   }
// };
const detailedProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { productID } = req.params;
        const product = yield prisma.productModel.findUnique({
            where: { id: productID },
        });
        return res.status(200).json({
            message: "create Product",
            data: product,
        });
    }
    catch (error) {
        return res.status(404).json({
            message: error,
        });
    }
});
exports.detailedProduct = detailedProduct;
const payment = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { amount } = req.body;
        const params = JSON.stringify({
            email: "customer@email.com",
            amount: amount * 100,
        });
        const options = {
            hostname: "api.paystack.co",
            port: 443,
            path: "/transaction/initialize",
            method: "POST",
            headers: {
                Authorization: "Bearer sk_test_ec1b0ccabcb547fe0efbd991f3b64b485903c88e",
                "Content-Type": "application/json",
            },
        };
        const ask = https_1.default
            .request(options, (resp) => {
            let data = "";
            resp.on("data", (chunk) => {
                data += chunk;
            });
            resp.on("end", () => {
                console.log(JSON.parse(data));
                res.status(200).json({
                    message: "Payment successful",
                    data: JSON.parse(data),
                });
            });
        })
            .on("error", (error) => {
            console.error(error);
        });
        ask.write(params);
        ask.end();
    }
    catch (error) {
        return res.status(404).json({
            message: "Error making Payment",
        });
    }
});
exports.payment = payment;
