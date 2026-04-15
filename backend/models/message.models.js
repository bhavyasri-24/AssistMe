import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    roomId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doubt",
    },
    user:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    text:{
      type: String,
      required: true,
    }
  },
  {timestamps: true}
)

export default mongoose.model("Message", messageSchema)