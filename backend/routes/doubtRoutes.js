import express from "express"
import {handleGetAllDoubts, handleCreateDoubt, handleGetDoubt, handleUpdateDoubt, handleDeleteDoubt, handleResolveDoubt} from "../controllers/doubtController.js"
import {auth} from "../middleware/auth.middleware.js"

const doubtRouter = express.Router();

doubtRouter.get("/", handleGetAllDoubts);
doubtRouter.post("/", auth, handleCreateDoubt);
doubtRouter.get("/:id", auth, handleGetDoubt);
doubtRouter.put("/:id", auth, handleUpdateDoubt);
doubtRouter.delete("/:id", auth, handleDeleteDoubt);
doubtRouter.put("/:id/toggle-resolve", auth, handleResolveDoubt);

export default doubtRouter;