import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

// all dispatches happen in socket.js

export default function PrivateChat(props) {
    const elemRef = useRef();
    const otherId = props.match.params.id;
    const privChat = useSelector((state) => state && state.privChats);
    const otherUserIsOnline = useSelector(
        (state) =>
            state.online && state.online.find((user) => user.id == otherId)
    );

    useEffect(() => {
        console.log("chat hooks has mounted!");
        socket.emit("openPrivChat", otherId);
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, []);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [privChat]);

    const keyCheck = (e) => {
        if (e.key == "Enter") {
            e.preventDefault();
            socket.emit("newPrivMsg", e.target.value, otherId);
            e.target.value = "";
        }
    };

    // if (!privChat) {
    //     return null;
    // }

    return (
        <div>
            <h3>Private Chat</h3>
            {otherUserIsOnline && (
                <h3>
                    with {otherUserIsOnline.first} {otherUserIsOnline.last}
                    {" (online)"}
                </h3>
            )}
            {!otherUserIsOnline && <h3>This user is currently not online</h3>}
            <div className="msgs-container" ref={elemRef}>
                {privChat &&
                    privChat.map((msg) => (
                        <div key={msg.id} className="msg">
                            <span className="posted-at">
                                {new Date(msg.posted_at).toLocaleString()}
                            </span>
                            <br></br>
                            <strong>{msg.first}: </strong>
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
