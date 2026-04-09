import mongoose from "mongoose"
import express from "express"
import User from "../models/user.models.js"
import bcrypt from "bcrypt"


export const handleGetUserById = async(req, res)=>{
  try{
    const user = await User.findById(req.params.id); 

    if (!user){
      return res.status(404).json({error: "user not found"});
    }

    res.status(200).json(user);
  }
  catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleUpdateUserById = async(req, res)=>{
  try{
    const {username, email, password} = req.body;
    const user = await User.findById(req.params.id);

    if (!user){
      return res.status(404).json({error: "user not found"});
    } 

    if (username) user.username = username;
    if (email) user.email = email;
    if (password) user.password = await bcrypt.hash(password, 10);

    await user.save();
    res.status(200).json(user);
  }
  catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleDeleteUserById = async(req, res)=>{
  try{
    const deletedUser = await User.findByIdAndDelete(req.params.id);

    if (!deletedUser){
      return res.status(404).json({error: "user not found"})
    }
    res.status(200).json({message: "user deleted"});
  }
  catch(error){
    res.status(500).json({error: error.message})
  }
}