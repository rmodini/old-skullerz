import React from "react";
import ProfilePic from "./profile-pic";
import BioEditor from "./bio-editor";

export default function Profile(props) {
    return (
        <React.Fragment>
            <h1>Your profile</h1>
            <h2>
                {props.first} {props.last}
            </h2>
            <ProfilePic
                first={props.first}
                last={props.last}
                imgUrl={props.imgUrl}
            />
            <br></br>
            <BioEditor bio={props.bio} setBio={props.setBio} />
        </React.Fragment>
    );
}
