import Message from "../models/message.models.js"
export const initSocket = (io) =>{
  io.on("connection", (socket)=>{

    socket.on("join_room", (roomId)=>{
      socket.join(roomId);
    })

    socket.on("send_message", async(data)=>{
      const {roomId, message, user} = data;
      const userId = user?._id || user?.id;

      if (!userId || !message?.trim()) {
        return;
      }

      const saved = await Message.create({
        roomId,
        user: userId,
        text: message.trim()
      })

      const populated = await saved.populate("user", "username avatar");



      io.to(roomId).emit("receive_message", populated)
    });

    socket.on("disconnect", ()=>{
    })
    
  })
}
