import express from "express"
import {handleAddComment, handleDeleteComment, handleGetComments, handleUpdateComment} from "../controllers/commentController.js"
import {auth, authorizeRoles} from "../middleware/auth.middleware.js"

const commentRouter = express.Router();

commentRouter.post("/:id", auth, handleAddComment);
commentRouter.get("/:id", handleGetComments);
commentRouter.delete("/:id/:commentId", auth, handleDeleteComment);
commentRouter.put("/:id/:commentId", auth,  handleUpdateComment);

export default commentRouter;