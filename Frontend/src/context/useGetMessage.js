import { useEffect, useState } from "react";
import useConversation from "../zustand/useConversation.js";
import { useSocketContext } from "./SocketContext.jsx";
import { useAuth } from "../AuthProvider.jsx";
import api from "../axios.js";
const useGetMessage = () => {
  const [loading, setLoading] = useState(false);

  const { messages, setMessage, selectedConversation } = useConversation();

  const { socket } = useSocketContext();
  const { authUser } = useAuth();

  useEffect(() => {
    const getMessages = async () => {
      if (!selectedConversation?._id) return;

      setLoading(true);

      try {
        const res = await api.get(
          `/api/message/get/${selectedConversation._id}`,
        );

        const loadedMessages = res.data;

        let finalMessages = loadedMessages;

        if (socket && authUser?._id) {
          const receivedMessageIds = loadedMessages
            .filter(
              (msg) =>
                String(msg.senderId) === String(selectedConversation._id) &&
                String(msg.receiverId) === String(authUser._id) &&
                msg.status !== "seen",
            )
            .map((msg) => msg._id);

          if (receivedMessageIds.length > 0) {
            socket.emit("messagesSeen", {
              senderId: selectedConversation._id,
            });

            finalMessages = loadedMessages.map((msg) =>
              receivedMessageIds.some((id) => String(id) === String(msg._id))
                ? {
                    ...msg,
                    status: "seen",
                  }
                : msg,
            );
          }
        }

        setMessage(finalMessages);
      } catch (error) {
        console.error("Error getting messages:", error);
      } finally {
        setLoading(false);
      }
    };

    getMessages();
  }, [selectedConversation, socket, authUser?._id, setMessage]);

  return {
    loading,
    messages,
  };
};

export default useGetMessage;
