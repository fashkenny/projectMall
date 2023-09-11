import nodemailer from "nodemailer"
import ejs from "ejs"
import path from "path"
import { google } from "googleapis"

const GOOGLE_ID = "";
const GOOGLE_SECRET = "";
const GOOGLE_REFRESH_TOKEN = "";
const GOOGLE_URL = ""

const oAuth = new google.auth.OAuth2(GOOGLE_ID, GOOGLE_SECRET, GOOGLE_URL);
oAuth.setCredentials({ access_token: GOOGLE_REFRESH_TOKEN});

const url: string = "http://localhost:3030";

export const sendAccountOpeningMail = async(user: any, tokenID: string) => {
    try {
        const getAccess: any = (await oAuth.getAccessToken()).token

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "AjMall@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: getAccess
            }
        })

        const passedData = {
            userName: user.userName,
            url: `${url}/${tokenID}/verify-account`,
        }

        const readData = path.join(__dirname, "../view/accountOpening.ejs");
        const data = await ejs.renderFile(readData, passedData);

        const mailer = {
            form: "Congrate 😂😀😀<AjMall@gmail.com>",
            to: user.email,
            subject: "Awesome",
            html: data,
        }

        transport.sendMail(mailer)
    } catch (error) {
        console.log(error)
    }
}

export const resetAccountPasswordMail = async(user: any, tokenID: string) => {
    try {
        const getAccess: any = (await oAuth.getAccessToken()).token;

        const transport = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: "AjMall@gmail.com",
                clientId: GOOGLE_ID,
                clientSecret: GOOGLE_SECRET,
                refreshToken: GOOGLE_REFRESH_TOKEN,
                accessToken: getAccess
            }
        })

        const passedData = {
            userName: user.userName,
            url: `${url}/${tokenID}/verify-account`
        }

        const readData = path.join(__dirname, "../views/resetPassword.ejs");
        const data = await ejs.renderFile(readData, passedData);

        const mailer = {
            from: "Congrate <AjMall@gmail.com>",
            to: user.email,
            subject: "Awesome",
            html: data
        }

        transport.sendMail(mailer)
    } catch (error) {
        console.log(error)
    }
}


