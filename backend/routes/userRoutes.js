import express from "express"
import {handleGetUserById, handleDeleteUserById, handleUpdateUserById} from "../controllers/userController.js"

const userRouter = express.Router();

userRouter.get("/:id", handleGetUserById).
delete("/:id", handleDeleteUserById).
put("/:id", handleUpdateUserById);


export default userRouter;