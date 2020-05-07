import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendButton(props) {
    const [buttonText, setButtonText] = useState("make friend request");

    useEffect(() => {
        let ignore = false;
        (async () => {
            const { data } = await axios.get(
                "/initial-friendship-status/" + props.otherUserId
            );
            if (!ignore) {
                if (data.length == 0) {
                    setButtonText("make friend request");
                } else if (!data[0].accepted) {
                    if (data[0].sender_id == props.otherUserId) {
                        setButtonText("accept friend request");
                    } else {
                        setButtonText("cancel friend request");
                    }
                } else {
                    // if there is FS
                    setButtonText("end friendship");
                }
            }
        })();
        return () => {
            ignore = true;
        };
    }, [buttonText]);

    const handleClick = () => {
        if (buttonText == "make friend request") {
            axios
                .post("/make-friend-request/" + props.otherUserId)
                .then(() => {
                    setButtonText("cancel friend request");
                })
                .catch((e) => {
                    console.log("error in make f", e);
                });
        } else if (buttonText == "accept friend request") {
            axios
                .post("/add-friendship/" + props.otherUserId)
                .then(() => {
                    setButtonText("end friendship");
                })
                .catch((e) => {
                    console.log("error in add f", e);
                });
        } else if (
            buttonText == "cancel friend request" ||
            buttonText == "end friendship"
        ) {
            axios
                .post("/end-friendship/" + props.otherUserId)
                .then(() => {
                    setButtonText("make friend request");
                })
                .catch((e) => {
                    console.log("error in end f", e);
                });
        }
    };

    return (
        <div>
            <button onClick={handleClick}>{buttonText}</button>
            {/* {buttonText == "end friendship" && (
                <a href={`/chat/${this.props.match.params.id}`}>
                    <button>Open direct chat</button>
                </a>
            )} */}
        </div>
    );
}
