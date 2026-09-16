import React, { useState } from "react";
import { AiOutlineLogout } from "react-icons/ai";
import api from "../axios.js";
import Cookies from "js-cookie";
import toast from "react-hot-toast";

const Logout = () => {
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);

    try {
      await api.post("/api/user/logout");

      localStorage.removeItem("chatapp");
      Cookies.remove("jwt");

      setLoading(false);
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (error) {
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleLogout}
      disabled={loading}
      className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-[#20a7db] shadow-sm transition duration-200 hover:bg-[#62c1e5] hover:text-white disabled:opacity-50"
      aria-label="Logout"
      title="Logout"
    >
      <AiOutlineLogout className="text-xl" />
    </button>
  );
};

export default Logout;