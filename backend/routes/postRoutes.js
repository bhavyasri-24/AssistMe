import express from "express";
import {handleCreatePost, handleGetAllPosts, handleUpdatePost, handleGetPost, handleDeletePost} from "../controllers/postController.js";
import {auth} from "../middleware/auth.middleware.js"

const postRouter = express.Router();

postRouter.post("/", auth, handleCreatePost);
postRouter.get("/", handleGetAllPosts);
postRouter.put("/:id", auth, handleUpdatePost);
postRouter.get("/:id", handleGetPost);
postRouter.delete("/:id", auth, handleDeletePost);

export default postRouter;
