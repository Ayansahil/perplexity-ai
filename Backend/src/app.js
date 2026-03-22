import cors from "cors";
import express from "express";
import cookieParser from "cookie-parser";
import authRouter from "./routes/auth.routes.js";
import chatRouter from "./routes/chat.routes.js";
import helmet from "helmet";
import morgan from "morgan";
import { apiLimiter } from "./middlewares/rateLimit.middleware.js";
import { errorMiddleware, notFoundHandler } from "./middlewares/error.middleware.js";

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true,
    methods: ["GET", "POST", "PUT","PATCH","DELETE"],
  }),
);

// Apply global rate limiting to all requests
app.use(apiLimiter);

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

app.use("/api/auth", authRouter);
app.use("/api/chats", chatRouter);

// Undefined Route Handler (404)
app.use(notFoundHandler);

// Global Error Handler 
app.use(errorMiddleware);

export default app;
