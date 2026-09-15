import React, { useEffect, useState } from "react";
import User from "./User";
import useGetAllUsers from "../../context/useGetAllUsers";
import { useSocketContext } from "../../context/SocketContext.jsx";
import useConversation from "../../zustand/useConversation.js";
import { useAuth } from "../../AuthProvider.jsx";

const Users = () => {
  const [allusers, loading, setAllUsers] = useGetAllUsers();
  const { socket } = useSocketContext();
  const { selectedConversation } = useConversation();
  const { authUser } = useAuth();

  const [unreadCounts, setUnreadCounts] = useState({});
  const [unreadCountsLoaded, setUnreadCountsLoaded] = useState(false);

  useEffect(() => {
    if (!authUser?._id) {
      setUnreadCountsLoaded(false);
      return;
    }

    const savedCounts = localStorage.getItem(
      `unreadCounts_${authUser._id}`
    );

    setUnreadCounts(savedCounts ? JSON.parse(savedCounts) : {});
    setUnreadCountsLoaded(true);
  }, [authUser?._id]);

  useEffect(() => {
    if (!authUser?._id || !unreadCountsLoaded) return;

    localStorage.setItem(
      `unreadCounts_${authUser._id}`,
      JSON.stringify(unreadCounts)
    );
  }, [unreadCounts, authUser?._id, unreadCountsLoaded]);

  useEffect(() => {
    if (!socket || !authUser?._id) return;

    const handleUnreadCounts = (counts) => {
      setUnreadCounts(counts);
    };

    socket.on("unreadCounts", handleUnreadCounts);
    socket.emit("requestUnreadCounts");

    return () => {
      socket.off("unreadCounts", handleUnreadCounts);
    };
  }, [socket, authUser?._id]);

  useEffect(() => {
    if (!socket) return;

    const handleUnreadCountsUpdated = ({ senderId }) => {
      setUnreadCounts((prev) => {
        const updated = { ...prev };

        delete updated[String(senderId)];

        return updated;
      });
    };

    socket.on(
      "unreadCountsUpdated",
      handleUnreadCountsUpdated
    );

    return () => {
      socket.off(
        "unreadCountsUpdated",
        handleUnreadCountsUpdated
      );
    };
  }, [socket]);

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const senderId = String(newMessage.senderId);

      setAllUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          if (String(user._id) !== senderId) {
            return user;
          }

          return {
            ...user,
            lastMessage: newMessage.message,
            lastMessageTime: newMessage.createdAt,
          };
        });

        return updatedUsers.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;

          return (
            new Date(b.lastMessageTime) -
            new Date(a.lastMessageTime)
          );
        });
      });

      if (
        String(selectedConversation?._id) !== senderId
      ) {
        setUnreadCounts((prev) => ({
          ...prev,
          [senderId]: (prev[senderId] || 0) + 1,
        }));
      }
    };

    const handleMessageSent = (newMessage) => {
      const receiverId = String(newMessage.receiverId);

      setAllUsers((prevUsers) => {
        const updatedUsers = prevUsers.map((user) => {
          if (String(user._id) !== receiverId) {
            return user;
          }

          return {
            ...user,
            lastMessage: newMessage.message,
            lastMessageTime: newMessage.createdAt,
          };
        });

        return updatedUsers.sort((a, b) => {
          if (!a.lastMessageTime) return 1;
          if (!b.lastMessageTime) return -1;

          return (
            new Date(b.lastMessageTime) -
            new Date(a.lastMessageTime)
          );
        });
      });
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageSent", handleMessageSent);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageSent", handleMessageSent);
    };
  }, [socket, selectedConversation, setAllUsers]);

  return (
    <div className="flex h-full flex-col px-4 py-3">
      <h1 className="mb-2 text-sm font-semibold text-[#1c96c5]">
        Messages
      </h1>

      <div className="flex-1 space-y-1.5 overflow-y-auto pr-1">
        {loading ? (
          <div className="space-y-1.5">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center gap-3 rounded-xl bg-[#e8f8ff] p-2.5"
              >
                <div className="h-10 w-10 shrink-0 rounded-full bg-[#bfefff] animate-pulse" />

                <div className="h-4 flex-1 rounded bg-[#bfefff] animate-pulse" />
              </div>
            ))}
          </div>
        ) : (
          allusers.map((user) => (
            <User
              key={user._id}
              user={user}
              unreadCount={unreadCounts[user._id] || 0}
              setUnreadCounts={setUnreadCounts}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default Users;