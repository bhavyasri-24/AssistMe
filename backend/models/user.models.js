import mongoose from "mongoose"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const sessionSchema = new mongoose.Schema({
  token:{
    type: String, 
    required: true
  },
  ip: String,
  device: String,
  os: String,
  ua: String
}, {timestamps: true})

const userSchema = new mongoose.Schema({
  username:{
    type: String, 
    required: true,
    trim: true
  },
  email:{
    type: String, 
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password:{
    type: String,
    required: true
  },
  avatar:{
    type: String,
    default: ""
  },
  role:{
    type: String,
    enum: ["admin", "user"],
    required: true,
    default: "user"
  },
  sessions:[sessionSchema]
}, {timestamps: true});

userSchema.methods.comparePassword = async function(password){
  return await bcrypt.compare(password, this.password)
}

userSchema.methods.generateAccessToken = function(){
  return jwt.sign(
    {userId : this._id, role: this.role},
    process.env.ACCESS_SECRET_KEY,
    {expiresIn: "15m"}
  );
};

userSchema.methods.generateRefreshToken = function(){
  return jwt.sign(
    {userId : this._id, role: this.role},
    process.env.REFRESH_SECRET_KEY,
    {expiresIn: "7d"}
  );
};

userSchema.methods.addSession = async function(token, ip, device, os, ua){
  const existingSessionIndex = this.sessions.findIndex(session => session.device === device && session.os === os);

  if (existingSessionIndex !== -1){
    const s = this.sessions[existingSessionIndex];
    s.token = token;
    s.ip = ip;
    s.ua = ua;
    console.log("updated session");
  }
  else{
    this.sessions.push({token, ip, device, os, ua});
    console.log("added session");
  }
  return await this.save()
}

userSchema.methods.removeSession = async function(refreshToken){
  this.sessions = this.sessions.filter(session => session.token !== refreshToken);
  await this.save();
}

userSchema.methods.clearSessions = async function(){
  this.sessions = [];
  await this.save();
}

export default mongoose.model("User", userSchema);
