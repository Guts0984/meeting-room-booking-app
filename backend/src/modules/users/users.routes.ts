import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.ts";
import { authorizeSelf } from "../../middleware/authorize-self.ts";
import * as usersController from "./users.controller.ts";

export const usersRouter = Router();

usersRouter.use(authenticate);
usersRouter.get("/", usersController.list);
usersRouter.get("/:id", authorizeSelf, usersController.getById);
usersRouter.post("/", usersController.create);
usersRouter.patch("/:id", authorizeSelf, usersController.update);
usersRouter.delete("/:id", authorizeSelf, usersController.remove);
