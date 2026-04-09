import express from "express"
import {handleLoginUser, handleRegisterUser, handleLogout, handleLogoutAll, handleRefresh} from "../controllers/authController.js"

const authRouter = express.Router();

authRouter.post("/login", handleLoginUser);
authRouter.post("/register", handleRegisterUser);
authRouter.post("/logout", handleLogout);
authRouter.post("/logoutAll", handleLogoutAll);
authRouter.post("/refresh", handleRefresh)

export default authRouter;