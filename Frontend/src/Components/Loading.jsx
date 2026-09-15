import React from "react";

const Loading = () => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-[#f4fbff] z-50">
      <div className="flex w-56 flex-col gap-4 p-6 bg-white rounded-2xl shadow-md border border-[#e5f4fb]">
        <div className="skeleton h-28 w-full rounded-xl bg-[#e5f4fb]" />
        <div className="skeleton h-4 w-32 rounded bg-[#e5f4fb]" />
        <div className="skeleton h-4 w-full rounded bg-[#e5f4fb]" />
        <div className="skeleton h-4 w-full rounded bg-[#e5f4fb]" />
      </div>
    </div>
  );
};

export default Loading;
