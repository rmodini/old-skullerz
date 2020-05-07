import React from "react";
import axios from "./axios";
import ProfilePic from "./profile-pic";
import FriendButton from "./friend-button";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: {} };
    }
    componentDidMount() {
        const id = this.props.match.params.id;
        axios
            .get(`/api/user/${id}`)
            .then((data) => {
                if (data.data.redirect) {
                    this.props.history.push("/");
                } else {
                    this.setState(data);
                }
            })
            .catch((e) => {
                console.log("error in axios get other profile", e);
                this.props.history.push("/");
            });
    }
    render() {
        return (
            <React.Fragment>
                <h2>
                    {this.state.data.first} {this.state.data.last}
                </h2>
                <ProfilePic
                    first={this.state.data.first}
                    last={this.state.data.last}
                    imgUrl={this.state.data.img_url}
                />
                <p>{this.state.data.bio}</p>
                <FriendButton otherUserId={this.props.match.params.id} />
                <a href={`/chat/${this.props.match.params.id}`}>
                    <button>Open direct chat</button>
                </a>
            </React.Fragment>
        );
    }
}
