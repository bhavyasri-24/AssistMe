import express from "express"
import {handleToggleLike} from "../controllers/likeController.js"
import {auth} from "../middleware/auth.middleware.js"

const likeRouter = express.Router();

likeRouter.post("/:id/toggle-like", auth, handleToggleLike);

export default likeRouter;