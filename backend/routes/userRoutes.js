import express from "express"
import { handleGetUserById, handleDeleteUserById, handleUpdateUserById, handleGetAllUsers } from "../controllers/userController.js"
import { auth, authorizeRoles } from "../middleware/auth.middleware.js"
import upload from "../middleware/upload.js"

const userRouter = express.Router();

userRouter.get("/admin/", auth, authorizeRoles("admin"), handleGetAllUsers)
userRouter.get("/:id", handleGetUserById)
userRouter.delete("/:id", auth, handleDeleteUserById)
userRouter.put("/profile", auth, upload.single("avatar"), handleUpdateUserById)


export default userRouter;