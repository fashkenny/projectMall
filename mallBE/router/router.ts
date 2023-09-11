import express from "express";
import {
  changeAccountPassword,
  deleteAccount,
  registerAccount,
  resetAccountPassword,
  signInAccount,
  registerDispatcherAccount,
  updateAccountAvatar,
  updateAccountInfo,
  viewOneAccount,
  verifiedAccount,
  viewAccounts,
} from "../controller/authController";
import validatorHolder from "../utils/validatorHolder";
import { createAccountValidator } from "../utils/validator";
const router = express.Router();
import multer from "multer";

const myUpload = multer().single("avatar");

router.route("/all-accounts").get(viewAccounts);
router.route("/:userID/single-account").get(viewOneAccount);
router.route("/:userID/delete").delete(deleteAccount);

router
  .route("/create-account")
  .post(validatorHolder,  registerAccount);

router
  .route("/create-account-dispatcher")
  .post(validatorHolder(createAccountValidator), registerDispatcherAccount);

router.route("/sign-in-account").post(signInAccount);

router.route("/:token/verify-account").post(verifiedAccount);

router.route("/:userID/update-account-info").patch(updateAccountInfo);
router
  .route("/:userID/update-account-avatar")
  .patch(myUpload, updateAccountAvatar);
router.route("/reset-account-password").patch(resetAccountPassword);

router.route("/:token/change-account-password").patch(changeAccountPassword);

export default router;