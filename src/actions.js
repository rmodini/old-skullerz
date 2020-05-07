import axios from "./axios";

export function receiveFriendsWannabes() {
    return axios.get("/friends-wannabes").then(({ data }) => {
        console.log("data from axios friends wannabes", data);
        return {
            type: "RECEIVE_FRIENDS_WANNABES",
            friendsWannabes: data,
        };
    });
}

export function acceptFriendRequest(id) {
    return axios.post("/add-friendship/" + id).then(() => {
        return {
            type: "ACCEPT_FRIEND_REQUEST",
            id,
        };
    });
}

export function unfriend(id) {
    return axios.post("/end-friendship/" + id).then(() => {
        return {
            type: "UNFRIEND",
            id,
        };
    });
}

export function chatMessages(msgs) {
    return {
        type: "CHAT_MESSAGES",
        msgs,
    };
}

export function userJoined(newUser) {
    return {
        type: "USER_JOINED",
        newUser,
    };
}

export function onlineUsers(users) {
    return {
        type: "ONLINE_USERS",
        users,
    };
}

export function userLeft(userId) {
    return {
        type: "USER_LEFT",
        userId,
    };
}

export function privateChat(msgs) {
    return {
        type: "PRIVATE_CHAT",
        msgs,
    };
}
