import express from "express";
import helmet from "helmet";
import cors from "cors";
import morgan from "morgan";
import authRouter from "./routes/auth.routes";

const app = express();

// Basic Configuration
app.use(helmet());
app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health Check Route
app.get("/health", (req, res) => {
  res.status(200).json({ status: "Server is running" });
});

app.use("/api/auth", authRouter);

export default app;
