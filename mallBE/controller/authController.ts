import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken"

const prisma = new PrismaClient();

export const viewAccounts = async (req: Request, res: Response) => {
    try {
        const user = await prisma.authModel.findMany({});

        return res.status(200).json({
            message: "Viewing Account",
            data: user
        })
    } catch (error) {
        return res.status(404).json({
            message: "An Error has occurred",
            data: error
        })
    }
}

export const viewOneAccount = async (req: Request, res: Response) => {
    try {
        const { userID } = req.params;
        const user = await prisma.authModel.findUnique({
            where: { id: userID }
        })

        return res.status(200).json({
            message: "Viewing One Account",
            data: user
        })
    } catch (error) {
        return res.status(404).json({
            message: "An Error has occurred",
            data: error
        })
    }
}

export const registerAccount = async (req: Request, res: Response) => {
    try {
        const { userName, email, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const value = crypto.randomBytes(16).toString("hex");
        const token = jwt.sign(value, "justRand");

        const user = await prisma.authModel.create({
            data: {
                userName, email, password: hashed, token
            }
        })

        const tokenID = jwt.sign({ id: user.id }, "justRand");

        return res.status(201).json({
            message: "Account created successfully",
            data: user
        })
    } catch (error) {
        return res.status(404).json({
            message: "Registration failed",
            data: error,
        })
    }
}

export const updateAccountInfo = async (req: Request, res: Response) => {
    try {
        const { userID } = req.params;
        const { userName } = req.body;
        const user = await prisma.authModel.update({
            where: { id: userID },
            data: { userName }
        })

        return res.status(201).json({
            message: "Account updated successfully",
            data: user,
        })
    } catch (error) {
        return res.status(404).json({
            message: "Update account info failed",
            data: error,
        })
    }
}

// export const updateAccountAvatar = async (req: Request, res: Response) => {
//     try {
//         const { userID } = req.params;
//         const 
//     } catch (error) {
//         return res.status(404).json({
//             message: "Update account avatar failed",
//             data: error,
//         })
//     }
// }