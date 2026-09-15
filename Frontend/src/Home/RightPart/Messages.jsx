import React, { useEffect, useRef } from "react";
import Message from "./Message.jsx";
import useGetMessage from "../../context/useGetMessage.js";
import Loading from "../../Components/Loading.jsx";

const Messages = () => {
  const { loading, messages } = useGetMessage();

  const lastMessageRef = useRef(null);

  useEffect(() => {
    lastMessageRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (!Array.isArray(messages)) return null;

  return (
    <div className="flex-1 flex flex-col gap-1 p-3 overflow-y-auto">
      {loading && <Loading />}

      {!loading && messages.length === 0 && (
        <p className="text-center text-gray-400 mt-10">
          Start the conversation 👋
        </p>
      )}

      {!loading &&
        messages.map((msg, index) => (
          <div
            key={msg._id || index}
            ref={index === messages.length - 1 ? lastMessageRef : null}
          >
            <Message message={msg} />
          </div>
        ))}
    </div>
  );
};

export default Messages;