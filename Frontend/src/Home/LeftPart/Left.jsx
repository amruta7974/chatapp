import React from "react";
import Search from "./Search";
import Users from "./Users";
import Logout from "./Logout";
import Profile from "./Profile";
import useConversation from "../../zustand/useConversation.js";

const Left = () => {
  const { selectedConversation } = useConversation();

  return (
    <div
      className={`
        w-full sm:w-[30%] h-full
        bg-white flex flex-col
        border-r border-[#a0d9ef]
        ${selectedConversation ? "hidden sm:flex" : "flex"}
      `}
    >
      <Search />

      <div className="flex-1 min-h-0 overflow-y-auto">
        <Users />
      </div>

      <div className="flex items-center gap-3 border-t border-[#a0d9ef] bg-[#f4fbff] px-3 py-2">
        <Logout />
        <Profile />
      </div>
    </div>
  );
};

export default Left;
