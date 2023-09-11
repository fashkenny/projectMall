import { PrismaClient } from "@prisma/client"
import { Request, Response } from "express"
import bcrypt from "bcrypt";
import crypto from "crypto";
import jwt from "jsonwebtoken"
import cloudinary from "../utils/cloudinary";
import streamifier from "streamifier";
import { role } from "../utils/roles"
import { resetAccountPasswordMail, sendAccountOpeningMail } from "../utils/email"

const prisma = new PrismaClient();

export const viewAccounts = async (req: Request, res: Response) => {
    try {
        const user = await prisma.authModel.findMany({});

        return res.status(200).json({
            message: "Viewing Account",
            data: user
        })
    } catch (error: any) {
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
    } catch (error: any) {
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
                userName,
                email,
                password: hashed,
                token,
                role: role.USER,
            },
        });

        const tokenID = jwt.sign({ id: user.id }, "justRand");
        sendAccountOpeningMail(user, tokenID);

        return res.status(201).json({
            message: "Account created successfully",
            data: user
        })
    } catch (error: any) {
        return res.status(404).json({
            message: "Registration failed",
            data: error,
        })
    }
}

export const registerDispatcherAccount = async (req: Request, res: Response) => {
    try {
        const { userName, email, password, dispatchID } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
        const value = crypto.randomBytes(16).toString("hex");
        const token = jwt.sign(value, "justRand");

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
        ]

        const findDispatcher = searchData.some((el: any) => {
            return el.id === dispatchID
        })

        if (findDispatcher) {
            const user = await prisma.authModel.create({
                data: {
                    userName,
                    email,
                    password: hashed,
                    token,
                    role: role.DISPATCHER,
                },
            });

            const tokenID = jwt.sign({ id: user.id }, "justRand");
            sendAccountOpeningMail(user, tokenID);

            return res.status(201).json({
                message: "Account created successfully",
                data: user
            })
        } else {
            return res.status(404).json({
                message: "Please check your Dispatcher ID",
            });
        }

    } catch (error: any) {
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

export const updateAccountAvatar = async (req: Request, res: Response) => {
    try {
        const { userID } = req.params;
        let streamUpload = async (req: any) => {
            return new Promise(async (resolve, reject) => {
                let stream = await cloudinary.uploader.upload_stream(
                    (error, result) => {
                        if (result) {
                            return resolve(result);
                        } else {
                            return reject(error);
                        }
                    }
                );

                streamifier.createReadStream(req.file.buffer).pipe(stream);
            });
        };

        const { secure_url, public_id }: any = await streamUpload(req);

        const user = await prisma.authModel.update({
            where: { id: userID },
            data: { avatar: secure_url, avatarID: public_id },
        });

        return res.status(201).json({
            message: "Account updated",
            data: user,
        });
    } catch (error) {
        return res.status(404).json({
            message: "Update account avatar failed",
            data: error,
        })
    }
}

export const deleteAccount = async (req: Request, res: Response) => {
    try {
        const { userID } = req.params;

        await prisma.authModel.delete({
            where: { id: userID }
        })

        return res.status(201).json({
            message: "Account deleted",
        })
    } catch (error) {
        return res.status(404).json({
            message: "Error  in deleting account"
        })
    }
}

export const signInAccount = async (req: Request, res: Response) => {
    try {
        const { email, password } = req.body;

        const user = await prisma.authModel.delete({
            where: { id: email }
        })

        if (user) {
            const check = await bcrypt.compare(password, user.password);

            if (check) {
                if (user.verified && user.token !== "") {
                    const token = jwt.sign(
                        {
                            id: user.id,
                        },
                        "secret",
                        { expiresIn: "3d" }
                    );

                    return res.status(201).json({
                        message: `Welcome back ${user.userName}`,
                        user: token,
                    });
                } else {
                    return res.status(404).json({
                        message: "Please go and verify your account",
                    });
                }
            } else {
                return res.status(401).json({
                    message: "incorrect password",
                });
            }
        } else {
            return res.status(404).json({
                message: "can't find user",
            });
        }
    } catch (error) {
        return res.status(404).json({
            message: "Error processing request to user"
        })
    }
}

export const verifiedAccount = async (req: Request, res: Response) => {
    try {
        const { token } = req.params;

        const getID: any = jwt.verify(token, "justRand", (err, payload: any) => {
            if (err) {
                return err;
            } else {
                return payload
            }
        })
        const user = await prisma.authModel.update({
            where: { id: getID },
            data: {
                verified: true,
                token: ""
            }
        })

        return res.status(201).json({
            message: "Account verified", data: user
        })
    } catch (error) {
        return res.status(404).json({
            message: "Error  verifying acccount"
        })
    }
}

export const resetAccountPassword = async (req: Request, res: Response) => {
    try {
        const { email } = req.body;

        const user = await prisma.authModel.findUnique({
            where: { email },
        });

        if (user?.verified && user.token === "") {
            const token = jwt.sign({ id: user.id }, "justRand");

            await prisma.authModel.update({
                where: { id: user.id },
                data: {
                    token,
                },
            });

            resetAccountPasswordMail(user, token);

            return res.status(201).json({
                message: "You can now change your Password",
                data: token,
            });
        } else {
            return res.status(404).json({
                message: "can't reset this password",
            });
        }
    } catch (error) {
        return res.status(404).json({
            message: "Error resetting acccount password"
        })
    }
}

export const changeAccountPassword = async (req: Request, res: Response) => {
    try {
      const { token } = req.params;
      const { password } = req.body;
  
      const getID: any = jwt.verify(token, "justRand", (err, payload: any) => {
        if (err) {
          return err;
        } else {
          return payload.id;
        }
      });
  
      const user = await prisma.authModel.findUnique({
        where: { id: getID },
      });
  
      if (user?.verified && user.token !== "") {
        const salt = await bcrypt.genSalt(10);
        const hashed = await bcrypt.hash(password, salt);
  
        await prisma.authModel.update({
          where: { id: user.id },
          data: {
            password: hashed,
          },
        });
  
        return res.status(201).json({
          message: "Your password has been changed",
        });
      } else {
        return res.status(404).json({
          message: "can't reset this password",
        });
      }
    } catch (error) {
      return res.status(404).json({
        message: "Error verifying Account",
      });
    }
  };