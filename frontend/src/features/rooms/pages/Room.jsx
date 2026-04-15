import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import useAuth from "../../../hooks/useAuth";
import useSocket from "../../../hooks/useSocket";
import { getMessages } from "../services/chatService";
import Avatar from "react-avatar";

export default function Room() {
  const { id: roomId } = useParams();
  const { user } = useAuth();
  const socket = useSocket(roomId);

  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const bottomRef = useRef(null);

  // 🔥 Load old messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const res = await getMessages(roomId);
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };

    loadMessages();
  }, [roomId]);

  // 🔥 Listen for new messages
  useEffect(() => {
    socket.on("receive_message", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });

    return () => {
      socket.off("receive_message");
    };
  }, [socket]);

  // 🔥 Auto scroll
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // 🔥 Send message
  const sendMessage = () => {
    if (!input.trim()) return;

    socket.emit("send_message", {
      roomId,
      message: input,
      user,
    });

    setInput("");
  };

  return (
    <section className="max-w-3xl mx-auto h-[80vh] flex flex-col border rounded-xl bg-white shadow-sm">
      
      {/* Header */}
      <div className="p-4 border-b font-semibold text-lg">
        Discussion Room
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          const messageUserId = msg.user?._id || msg.user?.id;
          const currentUserId = user?._id || user?.id;

          const isMe =
            String(messageUserId) === String(currentUserId);

          const username = msg.user?.username || "User";

          return (
            <div
              key={index}
              className={`flex items-end gap-2 ${
                isMe ? "justify-end" : "justify-start"
              }`}
            >
              {/* 👤 LEFT avatar (others) */}
              {!isMe && (
                <Avatar
                  src={msg.user?.avatar?.trim() || undefined}
                  name={username}
                  size="32"
                  round
                  textSizeRatio={2}
                />
              )}

              {/* 💬 Message bubble */}
              <div
                className={`max-w-[70%] px-3 py-2 rounded-lg text-sm ${
                  isMe
                    ? "bg-black text-white rounded-br-none"
                    : "bg-zinc-200 text-black rounded-bl-none"
                }`}
              >
                {/* Username */}
                <p
                  className={`mb-1 text-xs font-medium ${
                    isMe ? "text-zinc-300" : "text-zinc-700"
                  }`}
                >
                  {username}
                </p>

                <p>{msg.text}</p>
              </div>

              {/* 👤 RIGHT avatar (you) */}
              {isMe && (
                <Avatar
                  src={msg.user?.avatar?.trim() || undefined}
                  name={username}
                  size="32"
                  round
                  textSizeRatio={2}
                />
              )}
            </div>
          );
        })}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t flex gap-2">
        <input
          className="flex-1 border rounded-md px-3 py-2 text-sm"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) =>
            e.key === "Enter" && sendMessage()
          }
        />

        <button
          onClick={sendMessage}
          className="bg-zinc-900 text-white px-4 py-2 rounded-md text-sm"
        >
          Send
        </button>
      </div>
    </section>
  );
}