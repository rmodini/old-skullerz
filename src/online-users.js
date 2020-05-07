import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

export default function OnlineUsers(props) {
    const onlineUsers = useSelector((state) => state && state.online);

    // useEffect(() => {
    //     console.log("online users in comp", onlineUsers);
    // }, [onlineUsers]);

    if (!onlineUsers) {
        return null;
    }

    return (
        <div>
            <h3>Online users</h3>
            <ul>
                {onlineUsers &&
                    onlineUsers.map((user) => (
                        <li key={user.id}>
                            <span> </span>
                            <Link to={`/user/${user.id}`}>
                                {user.first} {user.last}
                            </Link>
                            <span> </span>
                            {props.id == user.id && <span>(you)</span>}
                            {props.id != user.id && (
                                <a href={`/chat/${user.id}`}>
                                    <button>Open direct chat</button>
                                </a>
                            )}
                        </li>
                    ))}
            </ul>
        </div>
    );
}
