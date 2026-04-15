import API from "../../../services/api.js"

// 🔥 get all messages of a room
export const getMessages = (roomId) => {
  return API.get(`/messages/${roomId}`);
};

// 🔥 send message (optional, since socket handles it)
export const sendMessage = (roomId, text) => {
  return API.post(`/messages/${roomId}`, { text });
};