import User from '../models/user.models.js'
import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import {UAParser} from "ua-parser-js"

export const handleRegisterUser = async(req, res)=>{
  try{
    const {username, email, password} = req.body;

    const existing = await User.findOne({email});

    if (existing){
      return res.status(400).json({error: "user already exists"});
    } 

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username, email, password: hashedPassword,
    })
    res.status(201).json(user);
  }
  catch(error){
    res.status(400).json({error: error.message});
  }
}

export const handleLoginUser = async(req, res)=>{
  try{
    const {email, username, password} = req.body;

    const user = await User.findOne({$or: [{email}, {username}]});

    if (!user){
      return res.status(400).json({error: "user does not exist"});
    } 
    const match = await bcrypt.compare(password, user.password);

    if (!match){
      return res.status(400).json({error: "invalid credentials"});
    } 

    const accessToken = await user.generateAccessToken();
    const refreshToken = await user.generateRefreshToken();

    const parser = new UAParser(req.headers["user-agent"]);
    const result = parser.getResult();
    const ip = req.ip;
    const device = result.device.model || "unknown";
    const os = result.os.name || "unknown";
    const ua = result.ua || "unknown";

    console.log("adding session");

    await user.addSession(
      refreshToken,
      ip,
      device || "unknown",
      os || "unknown",
      ua || "unknown"
    )

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", 
      sameSite: "lax"
    });
    res.status(200).json({
      accessToken,
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });
  }
  catch(error){
    res.status(500).json({error: error.message})
  }
}

export const handleRefresh = async(req, res)=>{
  try{
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken){
      return res.status(401).json({msg: "no refresh token"});
    }

    let decoded;
    try{
      decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);
    }
    catch(error){
      return res.status(401).json({msg: "invalid refresh token"});
    }

    const user = await User.findById(decoded.userId);
    if (!user){
      return res.status(401).json({msg: "user not found"});
    }

    const session = user.sessions.find(session => session.token === refreshToken);
    if (!session){
      return res.status(401).json({msg: "invalid session"});
    }

    const accessToken = await user.generateAccessToken();
    res.status(200).json({accessToken});
  }
  catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleLogout = async(req, res)=>{
  try{
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken){
      return res.status(401).json({msg: "no refresh token"});
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

    const user = await User.findById(decoded.userId);
    
    user.sessions = user.sessions.filter(session=> session.token !== refreshToken)

    await user.save();

    res.clearCookie("refreshToken");
    res.status(200).json({msg: "logged out"});
  }
  catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleLogoutAll = async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {     
      return res.status(401).json({ msg: "no refresh token" });
    }
    try{
      const decoded = jwt.verify(refreshToken, process.env.REFRESH_SECRET_KEY);

      const user = await User.findById(decoded.userId);

      user.sessions = [];

      await user.save();

      res.clearCookie("refreshToken");

      res.json({ msg: "logged out from all devices" });
    }
    catch(error){
      return res.status(401).json({msg: "invalid refresh token"});
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};