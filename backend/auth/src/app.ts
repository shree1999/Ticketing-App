import "express-async-errors";
import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";

import { keys } from "./config/keys";
import authRoutes from "./routes/auth.routes";
import { errorMiddleware } from "./middlewares/error.middleware";
import { NotFoundError } from "./config/errors/NotFoundError";

const app = express();

const PORT = keys.port;

if (keys.nodeEnv === "development") {
  app.use(morgan("dev"));
}

app.use(cors());

app.use(helmet());

app.use(express.json());

app.use(cookieParser());

app.use("/api/users/v1", authRoutes);

app.use((req, res, next) => {
  throw new NotFoundError(`404 could not find ${req.path} with ${req.method}`);
});

app.use(errorMiddleware);

export { app, PORT };
