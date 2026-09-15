import React, { useEffect, useRef, useState } from "react";
import { IoSendOutline, IoClose } from "react-icons/io5";
import useSendMessage from "../../context/useSendMessage.js";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";

function Typesend() {
  const [message, setMessage] = useState("");

  const { selectedConversation, replyMessage, setReplyMessage } =
    useConversation();

  const { loading, sendMessages } = useSendMessage();
  const { socket } = useSocketContext();

  const typingTimeoutRef = useRef(null);

  const handleTyping = (e) => {
    const value = e.target.value;

    setMessage(value);

    if (!socket || !selectedConversation?._id) return;

    socket.emit("typing", {
      receiverId: selectedConversation._id,
    });

    clearTimeout(typingTimeoutRef.current);

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("stopTyping", {
        receiverId: selectedConversation._id,
      });
    }, 1000);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!message.trim()) return;

    if (socket && selectedConversation?._id) {
      socket.emit("stopTyping", {
        receiverId: selectedConversation._id,
      });
    }

    clearTimeout(typingTimeoutRef.current);

    await sendMessages(message);

    setMessage("");
  };

  useEffect(() => {
    return () => {
      clearTimeout(typingTimeoutRef.current);
    };
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-full bg-white">
      {replyMessage && (
        <div className="px-4 pt-3">
          <div className="flex items-center justify-between gap-3 rounded-lg border-l-4 border-[#1c96c5] bg-[#e8f7fc] px-3 py-2">
            <div className="min-w-0">
              <p className="text-xs font-semibold text-[#1c96c5]">
                Replying to{" "}
                {String(replyMessage.senderId) ===
                String(JSON.parse(localStorage.getItem("chatapp"))?._id)
                  ? "yourself"
                  : selectedConversation?.fullname}
              </p>

              <p className="max-w-[280px] truncate text-sm text-gray-600">
                {replyMessage.message}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setReplyMessage(null)}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-gray-500 transition hover:bg-white"
              aria-label="Cancel reply"
            >
              <IoClose className="text-lg" />
            </button>
          </div>
        </div>
      )}

      <div className="flex items-center gap-2 p-3 sm:gap-3 sm:p-4">
        <input
          type="text"
          placeholder={
            replyMessage ? "Type your reply..." : "Type a message..."
          }
          value={message}
          onChange={handleTyping}
          className="h-11 w-full flex-1 rounded-full bg-[#cfecf7] px-4 text-sm text-[#1c96c5] outline-none placeholder:text-[#62c1e5] focus:ring-2 focus:ring-[#62c1e5]"
        />

        <button
          type="submit"
          disabled={loading}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[#62c1e5] text-white transition-colors duration-200 hover:bg-[#20a7db] disabled:opacity-50"
          aria-label="Send message"
        >
          <IoSendOutline className="text-xl" />
        </button>
      </div>
    </form>
  );
}

export default Typesend;
