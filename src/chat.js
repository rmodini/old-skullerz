import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.chatMsgs);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            socket.emit("newMsg", e.target.value);
            e.target.value = "";
        }
    };

    // if (!chatMessages) {
    //     return null;
    // }

    return (
        <div>
            <h3>Shoutbox</h3>
            <div className="msgs-container" ref={elemRef}>
                {chatMessages &&
                    chatMessages.map((msg) => (
                        <div key={msg.id} className="msg">
                            <span className="posted-at">
                                {new Date(msg.posted_at).toLocaleString()}
                            </span>
                            <br></br>
                            <strong>
                                {msg.first} {msg.last}:{" "}
                            </strong>
                            <span>{msg.text}</span>
                        </div>
                    ))}
            </div>
            <textarea
                className="chat-textarea"
                placeholder="Write your message here"
                onKeyDown={keyCheck}
            ></textarea>
        </div>
    );
}
