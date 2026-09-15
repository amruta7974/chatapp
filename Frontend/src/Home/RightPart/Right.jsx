import React, { useEffect } from "react";
import ChatUser from "./ChatUser";
import Messages from "./Messages";
import TypeSend from "./TypeSend";
import useConversation from "../../zustand/useConversation.js";
import { useAuth } from "../../AuthProvider.jsx";
import { CiMenuFries } from "react-icons/ci";
import useGetSocketMessage from "../../context/useGetSocketMessage.js";

const Right = () => {
  const { selectedConversation, setSelectedConversation } = useConversation();

  useGetSocketMessage();

  useEffect(() => {
    return () => setSelectedConversation(null);
  }, [setSelectedConversation]);

  return (
    <div
      className={`
      w-full sm:w-[70%] h-full
      flex flex-col bg-white
      ${selectedConversation ? "flex" : "hidden sm:flex"}
    `}
    >
      {!selectedConversation ? (
        <NoChatSelected />
      ) : (
        <>
          <ChatUser />

          <div className="flex-1 min-h-0 overflow-y-auto bg-[#f4fbff]">
            <Messages />
          </div>

          <div className="border-t border-[#a0d9ef]">
            <TypeSend />
          </div>
        </>
      )}
    </div>
  );
};

export default Right;

const NoChatSelected = () => {
  const { authUser } = useAuth();

  return (
    <div className="relative flex-1 min-h-0 bg-[#f4fbff]">
      <label
        htmlFor="my-drawer-2"
        className="btn btn-ghost drawer-button lg:hidden absolute left-5 top-5"
      >
        <CiMenuFries className="text-[#1c96c5] text-xl" />
      </label>

      <div className="flex h-full items-center justify-center px-6 text-center">
        <h1 className="text-[#1c96c5]">
          Welcome{" "}
          <span className="font-semibold text-xl">{authUser?.fullname}</span>
          <br />
          Select a chat to start messaging 💬
        </h1>
      </div>
    </div>
  );
};
