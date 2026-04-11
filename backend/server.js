import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser"
import connectDB from "./config/db.js";
import cors from "cors";

import postRouter from "./routes/postRoutes.js";
import authRouter from "./routes/authRoutes.js";
import userRouter from "./routes/userRoutes.js";
import doubtRouter from "./routes/doubtRoutes.js";
import commentRouter from "./routes/commentRoutes.js";
import likeRouter from "./routes/likeRoutes.js";

dotenv.config();
connectDB();

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin: "http://localhost:5173",
  credentials: true              
}));

app.use("/api/posts", postRouter);
app.use("/api", authRouter);
app.use("/api/users", userRouter);
app.use("/api/doubts", doubtRouter);
app.use("/api/comments", commentRouter);
app.use("/api/likes", likeRouter);

app.listen(process.env.PORT, ()=>{
  console.log(`server running on port ${process.env.PORT}`);
})