import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.ts";
import { requireRoomRole } from "../../middleware/require-room-role.ts";
import { roomBookingsRouter } from "../bookings/bookings.routes.ts";
import * as roomsController from "./rooms.controller.ts";

export const roomsRouter = Router();

roomsRouter.use(authenticate);
roomsRouter.get("/", roomsController.list);
roomsRouter.post("/", roomsController.create);
roomsRouter.use("/:roomId/bookings", roomBookingsRouter);
roomsRouter.get(
  "/:id",
  requireRoomRole("ADMIN", "USER"),
  roomsController.getById,
);
roomsRouter.patch("/:id", requireRoomRole("ADMIN"), roomsController.update);
roomsRouter.delete("/:id", requireRoomRole("ADMIN"), roomsController.remove);
roomsRouter.get(
  "/:id/members",
  requireRoomRole("ADMIN", "USER"),
  roomsController.listMembers,
);
roomsRouter.post(
  "/:id/members",
  requireRoomRole("ADMIN"),
  roomsController.addMember,
);
roomsRouter.delete(
  "/:id/members/:userId",
  requireRoomRole("ADMIN"),
  roomsController.removeMember,
);
