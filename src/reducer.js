export default function reducer(state = {}, action) {
    if (action.type == "RECEIVE_FRIENDS_WANNABES") {
        state = {
            ...state,
            friendsWannabes: action.friendsWannabes,
        };
    }
    if (action.type == "ACCEPT_FRIEND_REQUEST") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((friend) => {
                if (action.id == friend.id) {
                    return {
                        ...friend,
                        accepted: true,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }
    if (action.type == "UNFRIEND") {
        state = {
            ...state,
            friendsWannabes: state.friendsWannabes.map((friend) => {
                if (action.id == friend.id) {
                    return {
                        ...friend,
                        accepted: null,
                    };
                } else {
                    return friend;
                }
            }),
        };
    }
    if (action.type == "CHAT_MESSAGES") {
        state = {
            ...state,
            chatMsgs: action.msgs,
        };
    }
    if (action.type == "USER_JOINED") {
        if (state.online.find((user) => user.id == action.newUser.id)) {
            state = {
                ...state,
            };
        } else {
            state = {
                ...state,
                online: state.online.concat(action.newUser),
            };
        }
    }
    if (action.type == "ONLINE_USERS") {
        state = {
            ...state,
            online: action.users,
        };
    }
    if (action.type == "USER_LEFT") {
        state = {
            ...state,
            online: state.online.filter((user) => user.id != action.userId),
        };
    }
    if (action.type == "PRIVATE_CHAT") {
        state = {
            ...state,
            privChats: action.msgs,
        };
    }
    return state;
}
