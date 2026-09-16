import React, { useEffect, useState } from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";
import { IoArrowBack } from "react-icons/io5";

const ChatUser = () => {
  const {
    selectedConversation,
    setSelectedConversation,
  } = useConversation();

  const { onlineUsers, socket } = useSocketContext();

  const [isTyping, setIsTyping] = useState(false);

  const getOnlineUsersStatus = (userId) => {
    return onlineUsers.includes(String(userId))
      ? "Online"
      : "Offline";
  };

  useEffect(() => {
    if (!socket) return;

    const handleTyping = ({ senderId }) => {
      if (String(senderId) === String(selectedConversation?._id)) {
        setIsTyping(true);
      }
    };

    const handleStopTyping = ({ senderId }) => {
      if (String(senderId) === String(selectedConversation?._id)) {
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedConversation]);

  return (
    <div className="w-full flex items-center gap-2 sm:gap-4 bg-[#62c1e5] px-3 sm:px-4 py-3 border-b border-[#a0d9ef]">

      {/* Back button - mobile only */}
      <button
        onClick={() => setSelectedConversation(null)}
        className="sm:hidden w-9 h-9 flex items-center justify-center
                   rounded-full text-white
                   hover:bg-white/20 transition shrink-0"
        aria-label="Back to chats"
      >
        <IoArrowBack className="text-xl" />
      </button>

      <div className="avatar shrink-0">
        <div className="w-12 h-12 rounded-full ring-2 ring-white/70">
          <img
            src={
              selectedConversation?.profilePic ||
              "https://img.daisyui.com/images/profile/demo/batperson@192.webp"
            }
            alt="user"
          />
        </div>
      </div>

      <div className="flex flex-col justify-center min-w-0">
        <h1 className="text-sm font-semibold text-white leading-tight truncate">
          {selectedConversation?.fullname || "Select a chat"}
        </h1>

        <span className="text-xs text-white/90">
          {isTyping
            ? "typing..."
            : getOnlineUsersStatus(selectedConversation?._id)}
        </span>
      </div>
    </div>
  );
};

export default ChatUser;