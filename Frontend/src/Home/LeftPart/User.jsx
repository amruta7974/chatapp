import React from "react";
import useConversation from "../../zustand/useConversation.js";
import { useSocketContext } from "../../context/SocketContext.jsx";

const User = ({ user, unreadCount, setUnreadCounts }) => {
  const { selectedConversation, setSelectedConversation } =
    useConversation();

  const { onlineUsers } = useSocketContext();

  const isSelected = selectedConversation?._id === user._id;
  const isOnline = onlineUsers.includes(String(user._id));

  const handleSelectUser = () => {
    setSelectedConversation(user);

    setUnreadCounts((prev) => {
      const updated = { ...prev };
      delete updated[user._id];
      return updated;
    });
  };

  return (
    <button
      type="button"
      onClick={handleSelectUser}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left transition ${
        isSelected
          ? "bg-[#a0d9ef]"
          : "hover:bg-[#a0d9ef]"
      }`}
    >
      <div className={`avatar shrink-0 ${isOnline ? "online" : ""}`}>
        <div className="h-10 w-10 rounded-full ring-2 ring-[#1c96c5]">
          <img
            src={
              user?.profilePic ||
              `https://ui-avatars.com/api/?name=${encodeURIComponent(
                user?.fullname || "User"
              )}&background=89ddfb&color=ffffff`
            }
            alt={user?.fullname || "User"}
          />
        </div>
      </div>

      <div className="min-w-0 flex-1">
        <h1 className="truncate text-sm font-medium leading-tight text-[#1c96c5]">
          {user.fullname}
        </h1>

        <p className="truncate text-xs text-[#62c1e5]">
          {user.lastMessage || user.email}
        </p>
      </div>

      {unreadCount > 0 && (
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-[#1c96c5] px-1.5 text-xs font-semibold text-white">
          {unreadCount > 99 ? "99+" : unreadCount}
        </span>
      )}
    </button>
  );
};

export default User;