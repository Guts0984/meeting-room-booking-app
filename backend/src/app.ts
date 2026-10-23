import express, { type Express, type Request, type Response } from "express";
import { errorHandler } from "./middleware/error-handler.ts";
import { notFound } from "./middleware/not-found.ts";
import { authRouter } from "./modules/auth/auth.routes.ts";
import { bookingsRouter } from "./modules/bookings/bookings.routes.ts";
import { roomsRouter } from "./modules/rooms/rooms.routes.ts";
import { usersRouter } from "./modules/users/users.routes.ts";

export function createApp(): Express {
  const app = express();

  app.use(express.json());

  app.get("/health", (_req: Request, res: Response) => {
    res.json({ status: "ok" });
  });

  app.use("/api/auth", authRouter);
  app.use("/api/users", usersRouter);
  app.use("/api/rooms", roomsRouter);
  app.use("/api/bookings", bookingsRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
}
