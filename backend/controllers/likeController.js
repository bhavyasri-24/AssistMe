import Like from "../models/like.models.js"
import mongoose from "mongoose";
import Post from "../models/post.models.js"


export const handleToggleLike = async (req, res) =>{
  try{
    const postId = req.params.id;
    const userId = req.userId;

    const post = await Post.findById(postId);
    if (!post) return res.status(404).json({error: "post not found"});

    const like = await Like.findOne({user: userId, post: postId});

    if (like){
      await Like.findByIdAndDelete(like._id);
      await Post.findByIdAndUpdate(postId, {$inc: {likesCount: -1}});

      return res.status(200).json({message: "post unliked"});
    }
    else{
      await Like.create({user: userId, post: postId});
      await Post.findByIdAndUpdate(postId, {$inc: {likesCount: 1}});
      return res.status(200).json({message: "post liked"});
    }
  }
  catch(error){
    return res.status(500).json({error: error.message});
  }
}

