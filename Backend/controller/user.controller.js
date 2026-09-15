import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import bcrypt from "bcrypt";
import createTokenAndSaveCookie from "../jwt/generateToken.js";

export const signup = async (req, res) => {
  const { fullname, email, password, confirmPassword } = req.body;

  try {
    if (!fullname || !email || !password || !confirmPassword) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match" });
    }

    const user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ message: "User already registered" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      fullname,
      email,
      password: hashPassword,
    });

    await newUser.save();

    try {
      createTokenAndSaveCookie(newUser._id, res);
    } catch (err) {
      console.error("Cookie creation error:", err);
    }

    return res.status(201).json({
      message: "User created successfully",
      user: {
        _id: newUser._id,
        fullname: newUser.fullname,
        email: newUser.email,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid email or password",
      });
    }

    createTokenAndSaveCookie(user._id, res);

    res.status(200).json({
      message: "User logged in successfully",
      user: {
        _id: user._id,
        fullname: user.fullname,
        email: user.email,
      },
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("jwt");

    res.status(201).json({
      message: "User logged out successfully",
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const allUsers = async (req, res) => {
  try {
    const loggedInUser = req.user._id;

    const users = await User.find({
      _id: { $ne: loggedInUser },
    }).select("-password");

    const usersWithLastMessage = await Promise.all(
      users.map(async (user) => {
        const lastMessage = await Message.findOne({
          $or: [
            {
              senderId: loggedInUser,
              receiverId: user._id,
            },
            {
              senderId: user._id,
              receiverId: loggedInUser,
            },
          ],
        }).sort({ createdAt: -1 });

        return {
          ...user.toObject(),
          lastMessage: lastMessage ? lastMessage.message : null,
          lastMessageTime: lastMessage ? lastMessage.createdAt : null,
        };
      }),
    );

    usersWithLastMessage.sort((a, b) => {
      if (!a.lastMessageTime) return 1;
      if (!b.lastMessageTime) return -1;

      return new Date(b.lastMessageTime) - new Date(a.lastMessageTime);
    });

    res.status(200).json(usersWithLastMessage);
  } catch (error) {
    console.error("Error in allUsers Controller:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { fullname, email } = req.body;

    if (!fullname || !email) {
      return res.status(400).json({
        message: "Full name and email are required",
      });
    }

    const existingUser = await User.findOne({
      email,
      _id: { $ne: userId },
    });

    if (existingUser) {
      return res.status(400).json({
        message: "Email already in use",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        fullname,
        email,
      },
      {
        new: true,
        runValidators: true,
      },
    ).select("-password -confirmPassword");

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.status(200).json({
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

    res.status(500).json({
      message: "Internal server error",
    });
  }
};