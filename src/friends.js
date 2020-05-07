import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
    receiveFriendsWannabes,
    acceptFriendRequest,
    unfriend,
} from "./actions";

export default function Friends() {
    const dispatch = useDispatch();
    const currentFriends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted === true)
    );
    const wannabeFriends = useSelector(
        (state) =>
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted === false)
    );

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    if (!currentFriends) {
        return null;
    }

    if (!wannabeFriends) {
        return null;
    }

    const currentFriendsList = (
        <div className="current-friends">
            {currentFriends.map((friend) => (
                <div key={friend.id} className="friend">
                    <Link to={`/user/${friend.id}`}>
                        <div className="img-box">
                            <img
                                className="result-profile-pic"
                                src={friend.img_url}
                            />
                        </div>
                        <h4>
                            {friend.first} {friend.last}
                        </h4>
                    </Link>
                    <button onClick={() => dispatch(unfriend(friend.id))}>
                        End Friendship
                    </button>
                </div>
            ))}
        </div>
    );

    const wannabeFriendsList = (
        <div className="wannabe-friends">
            {wannabeFriends.map((friend) => (
                <div key={friend.id} className="friend">
                    <Link to={`/user/${friend.id}`}>
                        <div className="img-box">
                            <img
                                className="result-profile-pic"
                                src={friend.img_url}
                            />
                        </div>
                        <h4>
                            {friend.first} {friend.last}
                        </h4>
                    </Link>
                    <button
                        onClick={() => dispatch(acceptFriendRequest(friend.id))}
                    >
                        Accept Friend Request
                    </button>
                </div>
            ))}
        </div>
    );

    return (
        <div className="friends">
            {currentFriends.length == 0 && <h2>You have no friends yet.</h2>}
            {currentFriends.length != 0 && (
                <div>
                    <h2>Friends</h2>
                    {currentFriendsList}
                </div>
            )}
            {wannabeFriends.length != 0 && (
                <div>
                    <h2>These people want to be your friends!</h2>
                    {wannabeFriendsList}
                </div>
            )}
        </div>
    );
}
