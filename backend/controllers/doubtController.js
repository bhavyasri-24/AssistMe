import Doubt from "../models/doubt.models.js";
import mongoose from "mongoose";

import cloudinary from "../config/cloudinary.js";

export const handleCreateDoubt = async (req, res) => {
  try {
    const { title, description } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploads = req.files.map(async (file) => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: "doubts",
        });

        return result.secure_url;
      });

      imageUrls = await Promise.all(uploads);
    }

    const doubt = await Doubt.create({
      title,
      description,
      images: imageUrls,
      user: req.userId,
    });

    res.status(201).json(doubt);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleGetAllDoubts = async(req, res)=>{
  try{
    const doubt = await Doubt.find().populate("user", "username email avatar").sort({createdAt: -1});

    res.status(200).json(doubt);
  }catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleGetDoubt = async(req, res)=>{
  const id = req.params.id;
  try{
    const doubt = await Doubt.findById(id).populate("user", "username email avatar");
    if (!doubt) {
      return res.status(404).json({ error: "doubt not found" });
    }
    res.status(200).json(doubt);
  }catch(error){
    res.status(404).json({error: error.message});
  }
}

export const handleUpdateDoubt = async(req, res)=>{
  const {id} = req.params;
  const {title, description} = req.body;

  try{
    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send(`No doubt with id: ${id}`);
    }
    const doubt = await Doubt.findById(id);

    if (!doubt) {
      return res.status(404).json({ error: "doubt not found" });
    }

    if (req.userId.toString() !== doubt.user.toString()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const updatedDoubt = await Doubt.findByIdAndUpdate(
      id,
      { $set: {title, description}},
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedDoubt);
  }
  catch(error){
    res.status(400).json({error: error.message});
  }
}

export const handleDeleteDoubt = async(req, res)=>{
  const id = req.params.id;
  try{
    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send(`No doubt with id: ${id}`);
    }
    const doubt = await Doubt.findById(id);

    if (!doubt) return res.status(404).json({error: "doubt not found"});

    if (req.userId.toString() === doubt.user.toString() || req.userRole === "admin"){
      await Doubt.findByIdAndDelete(id);
      res.status(200).json({message: "Doubt deleted successfully"});
      }
    else{
      res.status(401).json({error: "Unauthorized"});
    }
  }
  catch(error){
    res.status(400).json({error: error.message});
  }
}

export const handleResolveDoubt = async(req, res)=>{
  const id = req.params.id;

  try{
    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send(`No doubt with id: ${id}`);
    }

    const doubt = await Doubt.findById(id);
    if (!doubt){
      return res.status(404).json({error: "doubt not found"});
    }

    if (req.userId.toString() !== doubt.user.toString()){
      return res.status(401).json({error: "Unauthorized"});
    }
    doubt.isResolved = !doubt.isResolved;
    await doubt.save();
    
    res.status(200).json({message: doubt.isResolved ? "Doubt resolved successfully": "Doubt unresolved successfully"});
  }
  catch(error){
    res.status(400).json({error: error.message});
  }
}

export const handleGetMyDoubts = async(req, res)=>{
  try{
    const userId = req.userId;
    const doubts = (await Doubt.find({user: userId}).populate("user", "username email avatar")).sort({createdAt: -1});
    res.status(200).json(doubts);
  }
  catch(error){
    console.error("MY DOUBTS ERROR:", error); // 🔥 ADD THIS
    res.status(500).json({error: error.message}); // 🔥 CHANGE 400 → 500
  }
}
