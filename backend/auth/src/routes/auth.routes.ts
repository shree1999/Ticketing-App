import express from "express";
import {
  registerUser,
  loginUser,
  getCurrentUser,
  logoutUser,
} from "../controllers/auth.controller";
import { auth } from "../middlewares/auth.middleware";

const router = express.Router();

router.route("/").get(auth, getCurrentUser).post(auth, logoutUser);

router.route("/register").post(registerUser);

router.route("/login").post(loginUser);

export default router;
