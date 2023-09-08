import express, { Application } from "express"

const port: number = 6000;
const app: Application = express();

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
    process.exit(1)
})