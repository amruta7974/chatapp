import React from "react";
import { useForm } from "react-hook-form";
import api from "../axios.js";
import toast from "react-hot-toast";
import { useAuth } from "../AuthProvider.jsx";
import { Link } from "react-router-dom";

const Signup = () => {
  const { setAuthUser } = useAuth();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      const userInfo = {
        fullname: data.fullname,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      };

      const response = await api.post(
        "/api/user/signup",
        userInfo,
        { withCredentials: true }
      );

      toast.success("Signup successful");
      setAuthUser(response.data.user);
      localStorage.setItem("chatapp", JSON.stringify(response.data.user));
    } catch (error) {
      if (error.response) {
        toast.error(error.response?.data?.message || "Signup failed");
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
            Signup
          </h2>
        </div>

        <div className="space-y-1">
          <label className="input input-bordered w-full flex items-center gap-3 border-[#a0d9ef] focus-within:ring-2 focus-within:ring-[#62c1e5] rounded-xl bg-white">
            <svg className="h-5 w-5 text-[#1c96c5]" viewBox="0 0 24 24">
              <circle
                cx="11"
                cy="11"
                r="8"
                stroke="#1c96c5"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="m21 21-4.3-4.3"
                stroke="#1c96c5"
                strokeWidth="2"
              />
            </svg>

            <input
              type="text"
              placeholder="Full name"
              autoComplete="name"
              {...register("fullname", {
                required: "Full name is required",
                minLength: {
                  value: 3,
                  message: "At least 3 characters",
                },
              })}
              className="w-full bg-white text-[#1c96c5] placeholder:text-[#9acfe6] outline-none"
            />
          </label>

          {errors.fullname && (
            <p className="text-xs text-red-500">
              {errors.fullname.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="input input-bordered w-full flex items-center gap-3 border-[#a0d9ef] focus-within:ring-2 focus-within:ring-[#62c1e5] rounded-xl bg-white">
            <svg className="h-5 w-5 text-[#1c96c5]" viewBox="0 0 24 24">
              <rect
                width="20"
                height="16"
                x="2"
                y="4"
                rx="2"
                stroke="#1c96c5"
                strokeWidth="2"
                fill="none"
              />
              <path
                d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"
                stroke="#1c96c5"
                strokeWidth="2"
              />
            </svg>

            <input
              type="email"
              placeholder="Email address"
              autoComplete="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+\.\S+$/,
                  message: "Enter a valid email address",
                },
              })}
              className="w-full bg-white text-[#1c96c5] placeholder:text-[#9acfe6] outline-none"
            />
          </label>

          {errors.email && (
            <p className="text-xs text-red-500">
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="input input-bordered w-full flex items-center gap-3 border-[#a0d9ef] focus-within:ring-2 focus-within:ring-[#62c1e5] rounded-xl bg-white">
            <svg className="h-5 w-5 text-[#1c96c5]" viewBox="0 0 24 24">
              <path
                d="M2 18v3h3v-1h1v-1h1v-1h.17l.81-.81a6.5 6.5 0 1 0-4-4z"
                stroke="#1c96c5"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            <input
              type="password"
              placeholder="Password"
              autoComplete="new-password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "At least 6 characters",
                },
              })}
              className="w-full bg-white text-[#1c96c5] placeholder:text-[#9acfe6] outline-none"
            />
          </label>

          {errors.password && (
            <p className="text-xs text-red-500">
              {errors.password.message}
            </p>
          )}
        </div>

        <div className="space-y-1">
          <label className="input input-bordered w-full flex items-center gap-3 border-[#a0d9ef] focus-within:ring-2 focus-within:ring-[#62c1e5] rounded-xl bg-white">
            <svg className="h-5 w-5 text-[#1c96c5]" viewBox="0 0 24 24">
              <path
                d="M2 18v3h3v-1h1v-1h1v-1h.17l.81-.81a6.5 6.5 0 1 0-4-4z"
                stroke="#1c96c5"
                strokeWidth="2"
                fill="none"
              />
            </svg>

            <input
              type="password"
              placeholder="Confirm password"
              autoComplete="new-password"
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (val) =>
                  val === password || "Passwords do not match",
              })}
              className="w-full bg-white text-[#1c96c5] placeholder:text-[#9acfe6] outline-none"
            />
          </label>

          {errors.confirmPassword && (
            <p className="text-xs text-red-500">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <div className="space-y-4 text-center">
          <p className="text-sm text-[#62c1e5]">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[#1c96c5] font-bold hover:underline"
            >
              Login
            </Link>
          </p>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-[#62c1e5] text-white text-sm font-medium hover:bg-[#20a7db] transition-colors duration-200"
          >
            Signup
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;