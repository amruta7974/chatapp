import React, { useState } from "react";
import api from "../../axios.js";
import { useAuth } from "../../AuthProvider.jsx";

const Profile = () => {
  const { authUser, setAuthUser } = useAuth();

  const [showModal, setShowModal] = useState(false);
  const [fullname, setFullname] = useState(authUser?.fullname || "");
  const [email, setEmail] = useState(authUser?.email || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleOpenModal = () => {
    setFullname(authUser?.fullname || "");
    setEmail(authUser?.email || "");
    setError("");
    setShowModal(true);
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();

    if (!fullname.trim() || !email.trim()) {
      setError("Full name and email are required");
      return;
    }

    try {
      setLoading(true);
      setError("");

      const res = await api.put(
        "/api/user/update-profile",
        {
          fullname: fullname.trim(),
          email: email.trim(),
        },
        {
          withCredentials: true,
        }
      );

      const updatedUser = res.data.user;

      setAuthUser(updatedUser);

      localStorage.setItem("chatapp", JSON.stringify(updatedUser));

      setShowModal(false);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Failed to update profile"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        type="button"
        onClick={handleOpenModal}
        className="flex min-w-0 items-center gap-2 text-left"
      >
        <div className="avatar shrink-0">
          <div className="h-9 w-9 rounded-full ring-2 ring-[#62c1e5]">
            <img
              src={
                authUser?.profilePic ||
                `https://ui-avatars.com/api/?name=${encodeURIComponent(
                  authUser?.fullname || "User"
                )}&background=89ddfb&color=ffffff`
              }
              alt="profile"
            />
          </div>
        </div>

        <div className="min-w-0">
          <p className="max-w-[120px] truncate text-sm font-semibold text-[#1c96c5]">
            {authUser?.fullname || "User"}
          </p>

          <div className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-green-500" />
            <span className="text-xs text-[#62c1e5]">
              Online
            </span>
          </div>
        </div>
      </button>

      {showModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[360px] rounded-2xl bg-white p-6 shadow-2xl">
            <h2 className="text-center text-xl font-semibold text-[#1c96c5]">
              Edit Profile
            </h2>

            <p className="mt-1 mb-6 text-center text-sm text-gray-500">
              Update your profile information
            </p>

            <form onSubmit={handleUpdateProfile}>
              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-600">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullname}
                  onChange={(e) => setFullname(e.target.value)}
                  className="h-11 w-full rounded-xl bg-[#e8f7fc] px-4 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#62c1e5]"
                  placeholder="Enter your full name"
                />
              </div>

              <div className="mb-4">
                <label className="mb-1.5 block text-sm font-medium text-gray-600">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 w-full rounded-xl bg-[#e8f7fc] px-4 text-sm text-gray-700 outline-none transition focus:ring-2 focus:ring-[#62c1e5]"
                  placeholder="Enter your email"
                />
              </div>

              {error && (
                <p className="mb-3 text-sm text-red-500">
                  {error}
                </p>
              )}

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  disabled={loading}
                  className="h-11 flex-1 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={loading}
                  className="h-11 flex-1 rounded-xl bg-[#1c96c5] text-sm font-medium text-white transition-colors duration-200 hover:bg-[#20a7db] disabled:opacity-50"
                >
                  {loading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Profile;