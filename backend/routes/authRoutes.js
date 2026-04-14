import express from "express"
import {handleLoginUser, handleRegisterUser, handleLogout, handleLogoutAll, handleRefresh, getMe} from "../controllers/authController.js"
import {auth} from "../middleware/auth.middleware.js"

const authRouter = express.Router();

authRouter.post("/login", handleLoginUser);
authRouter.post("/register", handleRegisterUser);
authRouter.post("/logout", handleLogout);
authRouter.post("/logoutAll", handleLogoutAll);
authRouter.post("/refresh", handleRefresh);
authRouter.get("/me", auth, getMe);

export default authRouter;