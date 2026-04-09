import Doubt from "../models/doubt.models.js";
import mongoose from "mongoose";

export const handleCreateDoubt = async(req, res)=>{
  const {title, description, isResolved} = req.body;

  try{
    console.log(req.body);
    if (!title || !description){
      return res.status(400).json({error: "title and description are required"})
    }
    else{
      const doubt = await Doubt.create({
      title, description, isResolved,user: req.userId
    });
    res.status(201).json(doubt);
    }
  }catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleGetAllDoubts = async(req, res)=>{
  try{
    const doubt = await Doubt.find().populate("user", "username email").sort({createdAt: -1});

    res.status(200).json(doubt);
  }catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleGetDoubt = async(req, res)=>{
  const id = req.params.id;
  try{
    const doubt = await Doubt.findById(id).populate("user", "username email");
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

    if (req.userId !== doubt.user.toString()) {
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

    if (req.userId === doubt.user.toString()){
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

    if (req.userId !== doubt.user.toString()){
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

