import { create } from "zustand";

const useConversation = create((set) => ({
  selectedConversation: null,

  messages: [],

  replyMessage: null,

  setSelectedConversation: (conversation) => {
    if (conversation) {
      localStorage.setItem("selected-convo", JSON.stringify(conversation));
    } else {
      localStorage.removeItem("selected-convo");
    }

    set({
      selectedConversation: conversation,
      messages: [],
      replyMessage: null,
    });
  },

  setMessage: (value) =>
    set((state) => ({
      messages: typeof value === "function" ? value(state.messages) : value,
    })),

  setReplyMessage: (message) =>
    set({
      replyMessage: message,
    }),
}));

export default useConversation;
