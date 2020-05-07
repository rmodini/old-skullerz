import React from "react";

export default function ProfilePic(props) {
    let img = props.imgUrl || "/images/default_banana.gif";

    return (
        <React.Fragment>
            <img
                className="profile-pic"
                src={img}
                alt={`${props.first} ${props.last}'s profile picture`}
            />
        </React.Fragment>
    );
}
