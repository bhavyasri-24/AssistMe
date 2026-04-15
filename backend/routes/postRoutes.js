import express from "express";
import {handleCreatePost, handleGetAllPosts, handleUpdatePost, handleGetPost, handleDeletePost, handleGetMyPosts} from "../controllers/postController.js";
import {auth} from "../middleware/auth.middleware.js"
import upload from "../middleware/upload.js"

const postRouter = express.Router();

postRouter.post("/", auth,upload.array("images", 5), handleCreatePost);
postRouter.get("/", handleGetAllPosts);
postRouter.get("/me", auth, handleGetMyPosts)
postRouter.put("/:id", auth, handleUpdatePost);
postRouter.get("/:id", handleGetPost);
postRouter.delete("/:id", auth, handleDeletePost);


export default postRouter;
