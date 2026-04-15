import mongoose from "mongoose";

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  description:{
    type: String,
    required: true,
  },
  tags:{
    type: [String], 
    default: [],
  },
  images:{
    type: [String],
    default: [],
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likesCount:{
    type: Number,
    default: 0,
  },
  commentsCount:{
    type: Number, 
    default: 0
  }
}, {timestamps : true})

export default mongoose.model("Post", postSchema);