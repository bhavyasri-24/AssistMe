import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js";
import cors from "cors";
import http from "http";
import { Server } from "socket.io";
import { initSocket } from "./sockets/socket.js"

import postRouter from "./routes/postRoutes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import doubtRouter from "./routes/doubtRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import likeRouter from "./routes/likeRoutes.js";
import messageRouter from "./routes/messageRoutes.js";

dotenv.config();
connectDB();


const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
const allowedOrigins = [
  "http://localhost:5173",
  process.env.FRONTEND_URL,
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("CORS not allowed"));
    }
  },
  credentials: true,
}));

app.use("/api/posts", postRouter);
app.use("/api", authRouter);
app.use("/api/users", userRouter);
app.use("/api/doubts", doubtRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);
app.use("/api/messages", messageRouter);

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: [
      "http://localhost:5173",
      process.env.FRONTEND_URL
    ],
    credentials: true
  }
});

initSocket(io);

server.listen(process.env.PORT || 8000, () => console.log("server running", process.env.PORT));
