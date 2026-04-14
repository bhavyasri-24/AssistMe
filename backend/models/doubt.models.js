import mongoose from "mongoose"

const doubtSchema = new mongoose.Schema({
  title:{
    type: String, 
    required: true
  },
  description:{
    type: String,
    required: true
  },
  user:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isResolved:{
    type: Boolean,
    default: false
  }
}, {timestamps: true})

export default mongoose.model("Doubt", doubtSchema)