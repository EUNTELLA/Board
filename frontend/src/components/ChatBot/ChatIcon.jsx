import React from "react";

const ChatIcon = ({onClick})=>{
    return (
        <button
            className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-gradient-to-br from-green-400 to-emerald-500 text-white text-3xl border-none cursor-pointer shadow-[0_4px_10px_rgba(0,0,0,0.2)] flex items-center justify-center z-[1000] transition-transform duration-200 hover:scale-110"
            onClick={onClick}
        >
            🤖
        </button>
    );
};

export default ChatIcon;