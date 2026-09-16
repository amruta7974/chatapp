import { useEffect } from "react";
import useConversation from "../zustand/useConversation";
import { useSocketContext } from "./SocketContext";

const useGetSocketMessage = () => {
  const { socket } = useSocketContext();

  const { selectedConversation, setMessage } = useConversation();

  useEffect(() => {
    if (!socket) return;

    const handleNewMessage = (newMessage) => {
      const chatOpen =
        selectedConversation?._id &&
        String(newMessage.senderId) === String(selectedConversation._id);

      socket.emit("messageDelivered", {
        messageId: newMessage._id,
        senderId: newMessage.senderId,
      });

      if (chatOpen) {
    
        setMessage((prev) => {
          const exists = prev.some(
            (msg) => String(msg._id) === String(newMessage._id),
          );

          if (exists) return prev;

          return [
            ...prev,
            {
              ...newMessage,
              status: "seen",
            },
          ];
        });


        socket.emit("messagesSeen", {
          senderId: newMessage.senderId,
        });

        return;
      }

     
      if ("Notification" in window && Notification.permission === "granted") {
        const notification = new Notification("New Message", {
          body: newMessage.message,
        });

        notification.onclick = () => {
          window.focus();
          notification.close();
        };
      }
    };

    const handleMessageDelivered = ({ messageId }) => {
      setMessage((prev) =>
        prev.map((msg) =>
          String(msg._id) === String(messageId)
            ? {
                ...msg,
                status: "delivered",
              }
            : msg,
        ),
      );
    };

    const handleMessagesSeen = ({ messageIds }) => {
      setMessage((prev) =>
        prev.map((msg) =>
          messageIds.some((id) => String(id) === String(msg._id))
            ? {
                ...msg,
                status: "seen",
              }
            : msg,
        ),
      );
    };

    const handleMessageDeleted = ({ messageId }) => {
      setMessage((prev) =>
        prev.filter((msg) => String(msg._id) !== String(messageId)),
      );
    };

    socket.on("newMessage", handleNewMessage);
    socket.on("messageDelivered", handleMessageDelivered);
    socket.on("messagesSeen", handleMessagesSeen);
    socket.on("messageDeleted", handleMessageDeleted);

    return () => {
      socket.off("newMessage", handleNewMessage);
      socket.off("messageDelivered", handleMessageDelivered);
      socket.off("messagesSeen", handleMessagesSeen);
      socket.off("messageDeleted", handleMessageDeleted);
    };
  }, [socket, selectedConversation, setMessage]);
};

export default useGetSocketMessage;
