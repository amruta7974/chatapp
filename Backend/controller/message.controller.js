import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import mongoose from "mongoose";
import { getReceiverSocketId, io } from "../SocketIO/server.js";

export const sendMessage = async (req, res) => {
  try {
    const { message, replyTo } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let conversation = await Conversation.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        members: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      replyTo: replyTo || null,
    });

    conversation.messages.push(newMessage._id);

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketIds = getReceiverSocketId(String(receiverId));

    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("newMessage", newMessage);
      });
    }

    const senderSocketIds = getReceiverSocketId(String(senderId));

    if (senderSocketIds) {
      senderSocketIds.forEach((socketId) => {
        io.to(socketId).emit("messageSent", newMessage);
      });
    }

    res.status(201).json({
      newMessage,
    });
  } catch (error) {
    console.error("Error in sendMessage", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const message = await Message.findOne({
      _id: id,
      $or: [{ senderId: userId }, { receiverId: userId }],
    });

    if (!message) {
      return res.status(404).json({
        error: "Message not found or unauthorized",
      });
    }

    const receiverId = String(message.receiverId);

    await Message.findByIdAndDelete(id);

    await Conversation.updateOne(
      { messages: id },
      { $pull: { messages: id } },
    );

    const receiverSocketIds = getReceiverSocketId(receiverId);

    if (receiverSocketIds) {
      receiverSocketIds.forEach((socketId) => {
        io.to(socketId).emit("messageDeleted", {
          messageId: id,
        });
      });
    }

    const senderSocketIds = getReceiverSocketId(String(userId));

    if (senderSocketIds) {
      senderSocketIds.forEach((socketId) => {
        io.to(socketId).emit("messageDeleted", {
          messageId: id,
        });
      });
    }

    res.status(200).json({
      message: "Message deleted successfully",
      messageId: id,
    });
  } catch (error) {
    console.error("Error deleting message:", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getMessage = async (req, res) => {
  try {
    const chatUser = req.params.id.trim();
    const receiverId = req.user._id.toString();

    if (!mongoose.Types.ObjectId.isValid(chatUser)) {
      return res.status(400).json({
        error: "Invalid user ID",
      });
    }

    const result = await Message.updateMany(
      {
        senderId: chatUser,
        receiverId: receiverId,
        status: "sent",
      },
      {
        $set: {
          status: "delivered",
        },
      },
    );

    if (result.modifiedCount > 0) {
      const senderSocketIds = getReceiverSocketId(chatUser);

      if (senderSocketIds) {
        senderSocketIds.forEach((socketId) => {
          io.to(socketId).emit("messagesDelivered", {
            receiverId,
          });
        });
      }
    }

    const conversation = await Conversation.findOne({
      members: {
        $all: [receiverId, chatUser],
      },
    }).populate({
      path: "messages",
      populate: {
        path: "replyTo",
      },
    });

    if (!conversation) {
      return res.status(200).json([]);
    }

    res.status(200).json(conversation.messages);
  } catch (error) {
    console.error("Error in getMessage", error);

    res.status(500).json({
      error: "Internal server error",
    });
  }
};