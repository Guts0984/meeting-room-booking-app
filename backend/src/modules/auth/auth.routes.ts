import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.ts";
import * as authController from "./auth.controller.ts";

export const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/me", authenticate, authController.me);
