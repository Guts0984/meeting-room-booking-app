import { Router } from "express";
import { authenticate } from "../../middleware/authenticate.ts";
import { requireRoomRole } from "../../middleware/require-room-role.ts";
import * as bookingsController from "./bookings.controller.ts";

export const roomBookingsRouter = Router({ mergeParams: true });

roomBookingsRouter.get(
  "/",
  requireRoomRole("ADMIN", "USER"),
  bookingsController.listForRoom,
);
roomBookingsRouter.post(
  "/",
  requireRoomRole("ADMIN"),
  bookingsController.createForRoom,
);

export const bookingsRouter = Router();

bookingsRouter.use(authenticate);
bookingsRouter.get("/:id", bookingsController.getById);
bookingsRouter.patch("/:id", bookingsController.update);
bookingsRouter.delete("/:id", bookingsController.remove);
bookingsRouter.post("/:id/join", bookingsController.join);
bookingsRouter.delete("/:id/leave", bookingsController.leave);
