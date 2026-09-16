import dotenv from "dotenv";
dotenv.config();

import { Server } from "socket.io";
import http from "http";
import express from "express";
import Message from "../models/message.model.js";


const app = express();
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    methods: ["GET", "POST"],
    credentials: true,
  },
});

const users = {};

export const getReceiverSocketId = (receiverId) => {
  return users[receiverId];
};

io.on("connection", async (socket) => {
  const userId = socket.handshake.query.userId;

  if (userId) {
    if (!users[userId]) {
      users[userId] = [];
    }

    users[userId].push(socket.id);

    try {
      const messages = await Message.find({
        receiverId: userId,
        status: "sent",
      });

      for (const message of messages) {
        await Message.findByIdAndUpdate(message._id, {
          status: "delivered",
        });

        const senderSocketIds = getReceiverSocketId(String(message.senderId));

        if (senderSocketIds) {
          senderSocketIds.forEach((socketId) => {
            io.to(socketId).emit("messageDelivered", {
              messageId: message._id,
            });
          });
        }
      }
    } catch (error) {
      console.error("Error marking offline messages delivered:", error);
    }

    try {
      const unreadMessages = await Message.find({
        receiverId: userId,
        status: { $ne: "seen" },
      }).select("senderId");

      const unreadCounts = {};

      unreadMessages.forEach((message) => {
        const senderId = String(message.senderId);

        unreadCounts[senderId] = (unreadCounts[senderId] || 0) + 1;
      });

      io.to(socket.id).emit("unreadCounts", unreadCounts);
    } catch (error) {
      console.error("Error loading unread counts:", error);
    }
  }

  io.emit("getOnlineUsers", Object.keys(users));

  socket.on("typing", ({ receiverId }) => {
    const receiverSocketIds = getReceiverSocketId(receiverId);

    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("typing", {
          senderId: userId,
        });
      });
    }
  });

  socket.on("stopTyping", ({ receiverId }) => {
    const receiverSocketIds = getReceiverSocketId(receiverId);

    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("stopTyping", {
          senderId: userId,
        });
      });
    }
  });

  socket.on("messageDelivered", async ({ messageId, senderId }) => {
    try {
      const message = await Message.findByIdAndUpdate(
        messageId,
        { status: "delivered" },
        { new: true },
      );

      if (!message) return;

      const senderSocketIds = getReceiverSocketId(senderId);

      if (senderSocketIds) {
        senderSocketIds.forEach((socketId) => {
          io.to(socketId).emit("messageDelivered", {
            messageId: message._id,
          });
        });
      }
    } catch (error) {
      console.error("Error updating delivered status:", error);
    }
  });

  socket.on("messagesSeen", async ({ senderId }) => {
    try {
      const messages = await Message.find({
        senderId: senderId,
        receiverId: userId,
        status: { $ne: "seen" },
      });

      if (messages.length === 0) return;

      const messageIds = messages.map((message) => message._id);

      await Message.updateMany(
        {
          senderId: senderId,
          receiverId: userId,
          status: { $ne: "seen" },
        },
        {
          $set: {
            status: "seen",
          },
        },
      );

      const senderSocketIds = getReceiverSocketId(senderId);

      if (senderSocketIds) {
        senderSocketIds.forEach((socketId) => {
          io.to(socketId).emit("messagesSeen", {
            messageIds,
          });
        });
      }

      io.to(socket.id).emit("unreadCountsUpdated", {
        senderId: String(senderId),
      });
    } catch (error) {
      console.error("Error marking messages as seen:", error);
    }
  });

  socket.on("requestUnreadCounts", async () => {
    try {
      const unreadMessages = await Message.find({
        receiverId: userId,
        status: { $ne: "seen" },
      }).select("senderId");

      const unreadCounts = {};

      unreadMessages.forEach((message) => {
        const senderId = String(message.senderId);

        unreadCounts[senderId] = (unreadCounts[senderId] || 0) + 1;
      });

      socket.emit("unreadCounts", unreadCounts);
    } catch (error) {
      console.error("Error requesting unread counts:", error);
    }
  });

  socket.on("disconnect", () => {
    if (userId && users[userId]) {
      users[userId] = users[userId].filter((id) => id !== socket.id);

      if (users[userId].length === 0) {
        delete users[userId];
      }
    }

    io.emit("getOnlineUsers", Object.keys(users));
  });
});

export { app, io, server };
