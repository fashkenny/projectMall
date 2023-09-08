import express, { Application, Request, Response } from "express"
import cors from "cors"
import morgan from "morgan";
import helmet from "helmet"

export const mainApp = (app: Application) => {
    app.use(express.json())
    app.use(cors())
    app.use(morgan("dev"))
    app.use(helmet())
    app.set("view engine", "ejs")

    app.get("/", (req: Request, res: Response) => {
        try {
            return res.status(200).json({
                message: "OK response from server",
            })
        } catch (error) {
            return res.status(404).json({
                message: "error occured while loading default response",
                data: error
            })
        }
    })
}