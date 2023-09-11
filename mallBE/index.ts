import express, { Application } from "express"
import { mainApp } from "./mainApp";
import env from "dotenv"
env.config()

const port: number = parseInt(process.env.PORT!);
const app: Application = express();

mainApp(app)

const server = app.listen(port, () => {
    console.log()
    console.log("Server connection established")
})

process.on("uncaughtException", (error: Error) => {
    console.log("uncaughtException: ", error)
    process.exit(1)
})

process.on("unhandledRejection", (reason: any) => {
    console.log("unhandledRejection: ", reason)
    server.close(()=>{
        process.exit(1)
    })
})