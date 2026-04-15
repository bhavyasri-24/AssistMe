import Message from "../models/message.models.js"
import mongoose from "mongoose"
export const handleGetMessages = async (req, res) => {
  const roomId = req.params.roomId;
  try {
    const messages = await Message.find({
      roomId: new mongoose.Types.ObjectId(roomId)
    })
      .populate("user", "username avatar")
      .sort({ createdAt: 1 });

    res.status(200).json(messages);
  }
  catch (error) {
    console.log("❌ ERROR IN GET MESSAGES:", error);
    res.status(500).json({ error: error.message });
  }
}

export const handleSendMessage = async (req, res) => {
  const roomId = req.params.roomId;
  const { text } = req.body;
  console.log(req)

  try {
    const message = await Message.create({
      roomId,
      user: req.userId,
      text
    });

    const populated = await message.populate("user", "username avatar");
    console.log(populated);


    res.status(201).json(populated);
  }
  catch (error) {
    console.log("❌ ERROR IN SEND MESSAGES:", error);
    res.status(500).json({ error: error.message });
  }

}