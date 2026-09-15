import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import axios from "axios";
import { HiDotsVertical } from "react-icons/hi";
import { IoArrowUndoOutline } from "react-icons/io5";
import useConversation from "../../zustand/useConversation.js";

const Message = ({ message }) => {
  const authUser = JSON.parse(localStorage.getItem("chatapp"));

  const { setReplyMessage } = useConversation();

  const [showMenu, setShowMenu] = useState(false);
  const [menuDirection, setMenuDirection] = useState("down");
  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
  });
  const [deleting, setDeleting] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const menuContainerRef = useRef(null);
  const menuRef = useRef(null);

  if (!message) return null;

  const itsMe = String(message.senderId) === String(authUser?._id);

  const chatName = itsMe ? "chat-end" : "chat-start";

  const chatColor = itsMe
    ? "bg-[#62c1e5] text-white"
    : "bg-white text-gray-800 border border-[#a0d9ef]";

  const formattedTime = message.createdAt
    ? new Date(message.createdAt).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "";

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuContainerRef.current &&
        !menuContainerRef.current.contains(event.target)
      ) {
        setShowMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useLayoutEffect(() => {
    if (!showMenu || !menuRef.current || !menuContainerRef.current) {
      return;
    }

    const menu = menuRef.current;
    const button = menuContainerRef.current.querySelector("button");

    if (!button) return;

    const buttonRect = button.getBoundingClientRect();
    const menuRect = menu.getBoundingClientRect();

    const gap = 8;

    const spaceBelow = window.innerHeight - buttonRect.bottom;
    const spaceAbove = buttonRect.top;

    let top;

    if (spaceBelow >= menuRect.height + gap) {
      setMenuDirection("down");

      top = buttonRect.bottom + gap;
    } else {
      setMenuDirection("up");

      top = buttonRect.top - menuRect.height - gap;
    }

    // Keep menu inside screen horizontally
    let left;

    if (itsMe) {
      left = buttonRect.right - menuRect.width;
    } else {
      left = buttonRect.left;
    }

    // Prevent menu from going outside left/right
    left = Math.max(8, Math.min(left, window.innerWidth - menuRect.width - 8));

    setMenuPosition({
      top,
      left,
    });
  }, [showMenu, itsMe]);

  const handleDelete = async () => {
    try {
      setDeleting(true);

      await axios.delete(`/api/message/delete/${message._id}`, {
        withCredentials: true,
      });

      setShowDeleteModal(false);
      setShowMenu(false);
    } catch (error) {
      alert("Failed to delete message");
    } finally {
      setDeleting(false);
    }
  };

  const handleReply = () => {
    setReplyMessage(message);
    setShowMenu(false);
  };

  return (
    <div className="px-2 py-1">
      <div className={`chat ${chatName}`}>
        <div className="flex items-center gap-1">
          <div
            className={`chat-bubble ${chatColor} rounded-2xl shadow-sm max-w-[75%] sm:max-w-xs`}
          >
            {message.replyTo && (
              <div
                className={`mb-2 rounded-lg border-l-4 px-3 py-2 ${
                  itsMe
                    ? "border-white bg-white/20"
                    : "border-[#1c96c5] bg-[#e8f7fc]"
                }`}
              >
                <p
                  className={`text-[11px] font-semibold ${
                    itsMe ? "text-white" : "text-[#1c96c5]"
                  }`}
                >
                  Reply
                </p>

                <p
                  className={`truncate text-xs ${
                    itsMe ? "text-white/80" : "text-gray-500"
                  }`}
                >
                  {typeof message.replyTo === "object"
                    ? message.replyTo.message
                    : "Original message"}
                </p>
              </div>
            )}

            {message.message}
          </div>

          <div ref={menuContainerRef} className="relative">
            <button
              type="button"
              onClick={() => setShowMenu((prev) => !prev)}
              className="flex h-8 w-8 items-center justify-center rounded-full text-gray-400 transition hover:bg-[#e8f7fc] hover:text-[#1c96c5]"
              title="Message options"
              aria-label="Message options"
            >
              <HiDotsVertical className="text-lg" />
            </button>

            {showMenu && (
              <div
                ref={menuRef}
                style={{
                  position: "fixed",
                  top: `${menuPosition.top}px`,
                  left: `${menuPosition.left}px`,
                }}
                className="z-[200] bg-white border border-gray-200
             rounded-lg shadow-lg py-1 w-32"
              >
                <button
                  type="button"
                  onClick={handleReply}
                  className="flex h-9 w-full items-center gap-2 px-3 text-left text-sm text-gray-700 transition hover:bg-[#e8f7fc]"
                >
                  <IoArrowUndoOutline className="text-[#1c96c5]" />
                  Reply
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false);
                    setShowDeleteModal(true);
                  }}
                  disabled={deleting}
                  className="flex h-9 w-full items-center px-3 text-left text-sm text-[#1c96c5] transition hover:bg-[#e8f7fc] disabled:opacity-50"
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="chat-footer mt-1 flex items-center gap-2 text-[11px] text-[#7bbcd6]">
          {formattedTime}

          {itsMe && (
            <span
              className={`font-semibold ${
                message.status === "seen" ? "text-[#1c96c5]" : "text-gray-400"
              }`}
            >
              {message.status === "sent" ? "✓" : "✓✓"}
            </span>
          )}
        </div>
      </div>

      {showDeleteModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-[320px] rounded-2xl bg-white p-6 shadow-2xl">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#8ad3f0]">
              <span className="text-xl">🗑️</span>
            </div>

            <h2 className="text-center text-lg font-semibold text-gray-800">
              Delete message?
            </h2>

            <p className="mt-2 text-center text-sm text-gray-500">
              Are you sure you want to delete this message?
            </p>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                disabled={deleting}
                className="h-11 flex-1 rounded-xl border border-gray-200 text-sm font-medium text-gray-600 transition hover:bg-gray-50 disabled:opacity-50"
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDelete}
                disabled={deleting}
                className="h-11 flex-1 rounded-xl bg-[#1c96c5] text-sm font-medium text-white transition hover:bg-[#20a7db] disabled:opacity-50"
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Message;
