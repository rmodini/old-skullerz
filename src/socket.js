import * as io from "socket.io-client";
import {
    chatMessages,
    userJoined,
    onlineUsers,
    userLeft,
    privateChat,
} from "./actions";

export let socket;

export const init = (store) => {
    if (!socket) {
        socket = io.connect();

        socket.on("userJoined", (newUser) => {
            store.dispatch(userJoined(newUser));
        });

        socket.on("onlineUsersArray", (users) => {
            store.dispatch(onlineUsers(users));
        });

        socket.on("userLeft", (userId) => {
            store.dispatch(userLeft(userId));
        });

        socket.on("privMsgs", (privMsgs) => {
            store.dispatch(privateChat(privMsgs));
        });

        socket.on("chatMsgs", (msgs) => {
            store.dispatch(chatMessages(msgs));
        });
    }
};
