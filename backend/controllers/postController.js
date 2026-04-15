import Post from "../models/post.models.js";
import mongoose from "mongoose";
import cloudinary from "../config/cloudinary.js";


export const handleCreatePost = async (req, res) => {
  try {
    const { title, description } = req.body;

    let imageUrls = [];

    if (req.files && req.files.length > 0) {
      const uploads = req.files.map(async (file) => {
        const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;

        const result = await cloudinary.uploader.upload(base64, {
          folder: "posts",
        });

        return result.secure_url;
      });

      imageUrls = await Promise.all(uploads);
    }

    const post = await Post.create({
      title,
      description,
      images: imageUrls,
      user: req.userId,
    });


    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const handleGetAllPosts = async(req, res)=>{
  try{
    const post = await Post.find().populate("user", "username email avatar").sort({createdAt: -1});

    res.status(200).json(post);
  }catch(error){
    res.status(500).json({error: error.message});
  }
}

export const handleGetPost = async(req, res)=>{
  const id = req.params.id;
  try{
    const post = await Post.findById(id).populate("user", "username email avatar");
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

    if (req.userId.toString() !== post.user.toString()) {
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

    if (req.userId.toString() === post.user.toString() || req.userRole === "admin"){
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

export const handleGetMyPosts = async(req, res)=>{
  try{
    const posts = (await Post.find({user: req.userId}).populate("user", "username email avatar")).sort({createdAt: -1});
    res.status(200).json(posts);
  }catch(error){
    res.status(400).json({error: error.message});
  }
}
