import React from "react";
import './ChatIcon.css';

const ChatIcon = ({onClick})=>{
    return (
        <button className="chat-icon" onClick={onClick}>
            🤖
        </button>
    );
};

export default ChatIcon;