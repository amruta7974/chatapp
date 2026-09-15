import { useState } from "react";
import useConversation from "../zustand/useConversation.js";
import axios from "axios";

const useSendMessage = () => {
  const [loading, setLoading] = useState(false);

  const {
    setMessage,
    selectedConversation,
    replyMessage,
    setReplyMessage,
  } = useConversation();

  const sendMessages = async (message) => {
    if (!message.trim()) return;

    try {
      setLoading(true);

      const res = await axios.post(
        `/api/message/send/${selectedConversation._id}`,
        {
          message,
          replyTo: replyMessage?._id || null,
        },
        {
          withCredentials: true,
        }
      );

      setMessage((prev) => [...prev, res.data.newMessage]);

      setReplyMessage(null);
    } catch (error) {
      console.error("Error in send messages", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, sendMessages };
};

export default useSendMessage;