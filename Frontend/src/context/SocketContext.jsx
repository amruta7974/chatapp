import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "../AuthProvider.jsx";
import io from "socket.io-client";

const socketContext = createContext();

export const useSocketContext = () => {
  return useContext(socketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState([]);

  const { authUser } = useAuth();

  useEffect(() => {
    if (!authUser?._id) return;

    if ("Notification" in window) {
      if (Notification.permission === "default") {
        Notification.requestPermission()
          .then(() => {})
          .catch((error) => {
            console.error("Notification permission error:", error);
          });
      }
    }
  }, [authUser?._id]);

  useEffect(() => {
    if (!authUser?._id) {
      setSocket(null);
      setOnlineUsers([]);
      return;
    }

    const newSocket = io(import.meta.env.VITE_API_URL, {
      query: {
        userId: String(authUser._id),
      },
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      setSocket(newSocket);
    });

    newSocket.on("getOnlineUsers", (users) => {
      setOnlineUsers(users.map((id) => String(id)));
    });

    newSocket.on("disconnect", () => {
      setSocket(null);
    });

    return () => {
      newSocket.off("connect");
      newSocket.off("getOnlineUsers");
      newSocket.off("disconnect");

      newSocket.close();
    };
  }, [authUser?._id]);

  return (
    <socketContext.Provider value={{ socket, onlineUsers }}>
      {children}
    </socketContext.Provider>
  );
};
