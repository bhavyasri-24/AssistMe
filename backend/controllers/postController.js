import Post from "../models/post.models.js";
import mongoose from "mongoose";

export const handleCreatePost = async(req, res)=>{
  const {title, description, tags} = req.body;

  try{
    console.log(req.body);
    if (!title || !description){
      return res.status(400).json({error: "title and description are required"})
    }
    else{
      const post = await Post.create({
      title, description, tags, user: req.userId
    });
    res.status(201).json(post);
    }
  }catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleGetAllPosts = async(req, res)=>{
  try{
    const post = await Post.find().populate("user", "username email").sort({createdAt: -1});

    res.status(200).json(post);
  }catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleGetPost = async(req, res)=>{
  const id = req.params.id;
  try{
    const post = await Post.findById(id).populate("user", "username email");
    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }
    res.status(200).json(post);
  }catch(error){
    res.status(404).json({error: error.message});
  }
}

export const handleUpdatePost = async(req, res)=>{
  const {id} = req.params;
  const {title, description, tags} = req.body;

  try{
    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send(`No post with id: ${id}`);
    }
    const post = await Post.findById(id);

    if (!post) {
      return res.status(404).json({ error: "post not found" });
    }

    if (req.userId !== post.user.toString()) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { $set: {title, description, tags}},
      { new: true, runValidators: true }
    );

    res.status(200).json(updatedPost);
  }
  catch(error){
    res.status(400).json({error: error.message});
  }
}

export const handleDeletePost = async(req, res)=>{
  const id = req.params.id;
  try{
    if (!mongoose.Types.ObjectId.isValid(id)){
      return res.status(404).send(`No post with id: ${id}`);
    }
    const post = await Post.findById(id);

    if (!post) return res.status(404).json({error: "post not found"});

    if (req.userId === post.user.toString()){
      await Post.findByIdAndDelete(id);
      res.status(200).json({message: "Post deleted successfully"});
      }
    else{
      res.status(401).json({error: "Unauthorized"});
    }
  }
  catch(error){
    res.status(400).json({error: error.message});
  }
}
