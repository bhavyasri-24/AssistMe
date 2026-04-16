import jwt from "jsonwebtoken";
import User from "../models/user.models.js";

export const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const refreshToken = req.cookies.refreshToken; // 👈 ADD THIS

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "no token" });
  }

  if (!refreshToken) {
    return res.status(401).json({ error: "no refresh token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);

    const user = await User.findById(decoded.userId).select("-password");

    if (!user) {
      return res.status(401).json({ error: "user not found" });
    }

    // 🔥 IMPORTANT: check if session exists
    const session = user.sessions.find(
      (session) => session.token === refreshToken
    );

    if (!session) {
      return res.status(401).json({ error: "session expired" });
    }

    req.user = user;
    req.userId = user._id;
    req.userRole = decoded.role;

    next();
  } catch (err) {
    return res.status(400).json({ error: "invalid token" });
  }
};

export const authorizeRoles = (...allowedRoles)=>{
  return (req, res, next) => {
    if (!allowedRoles.includes(req.userRole)){
      return res.status(403).json({error: "Forbidden"});
    } 
    next();
  }
}
