import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import useGetAllUsers from "../../context/useGetAllUsers";
import useConversation from "../../zustand/useConversation";

const Search = () => {
  const [search, setSearch] = useState("");
  const [allUsers] = useGetAllUsers();
  const { setSelectedConversation } = useConversation();

  const filteredUsers = allUsers.filter((user) =>
    user.fullname?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="bg-white p-4">
      <div className="flex h-11 items-center gap-3 rounded-xl border border-[#a0d9ef] bg-[#cfecf7] px-4">
        <FaSearch className="shrink-0 text-sm text-[#20a7db]" />

        <input
          type="search"
          placeholder="Search chats..."
          className="w-full bg-transparent text-sm text-[#1c96c5] outline-none placeholder:text-[#8bc7dd]"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {search && (
        <div className="mt-3 max-h-48 space-y-1.5 overflow-y-auto">
          {filteredUsers.length === 0 && (
            <p className="px-2 py-2 text-sm text-gray-500">
              No users found
            </p>
          )}

          {filteredUsers.map((user) => (
            <button
              type="button"
              key={user._id}
              onClick={() => {
                setSelectedConversation(user);
                setSearch("");
              }}
              className="w-full rounded-lg bg-white px-4 py-2.5 text-left text-sm text-[#1c96c5] transition hover:bg-[#62c1e5] hover:text-white"
            >
              {user.fullname}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default Search;