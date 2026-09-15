import React from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import toast from "react-hot-toast";
import { useAuth } from "../AuthProvider.jsx";
import { Link } from "react-router-dom";
import useConversation from "../zustand/useConversation.js";

const Login = () => {
  const { setAuthUser } = useAuth();
  const { setSelectedConversation } = useConversation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(
        "/api/user/login",
        {
          email: data.email,
          password: data.password,
        },
        { withCredentials: true }
      );

      toast.success("Login successful");
      setSelectedConversation(null);
      setAuthUser(response.data.user);
      localStorage.setItem("chatapp", JSON.stringify(response.data.user));
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message || "Login failed");
      } else {
        toast.error("Server not responding");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-md bg-white border border-[#e5f4fb] rounded-2xl shadow-md p-6 space-y-5"
      >
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-semibold text-[#1c96c5]">
            Chat App
          </h1>

          <h2 className="text-sm text-[#62c1e5]">
            Login
          </h2>
        </div>

        <div className="space-y-1">
          <input
            type="email"
            placeholder="Email"
            className="w-full h-11 px-3 border border-[#a0d9ef] rounded-xl
                       text-gray-800 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[#62c1e5]
                       focus:border-transparent"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: "Enter a valid email address",
              },
            })}
          />

          {errors.email && (
            <p className="text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <input
            type="password"
            placeholder="Password"
            className="w-full h-11 px-3 border border-[#a0d9ef] rounded-xl
                       text-gray-800 placeholder-gray-400
                       focus:outline-none focus:ring-2 focus:ring-[#62c1e5]
                       focus:border-transparent"
            {...register("password", {
              required: "Password is required",
            })}
          />

          {errors.password && (
            <p className="text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <p className="text-sm text-center text-[#62c1e5]">
          Don’t have an account?{" "}
          <Link
            to="/signup"
            className="text-[#1c96c5] font-bold hover:underline"
          >
            Signup
          </Link>
        </p>

        <button
          type="submit"
          className="w-full h-11 rounded-xl bg-[#62c1e5] text-white
                     font-medium hover:bg-[#20a7db]
                     transition-colors duration-200"
        >
          Login
        </button>
      </form>
    </div>
  );
};

export default Login;