import React from "react";
import axios from "./axios";
import Uploader from "./uploader";
import Logo from "./logo";
import ProfilePic from "./profile-pic";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import { BrowserRouter, Route, Link } from "react-router-dom";
import FindPeople from "./find-people";
import Friends from "./friends";
import Chat from "./chat";
import OnlineUsers from "./online-users";
import PrivateChat from "./private-chat";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            uploaderIsVisible: false,
        };
        this.setProfilePic = this.setProfilePic.bind(this);
        this.toggleModal = this.toggleModal.bind(this);
        this.setBio = this.setBio.bind(this);
    }
    componentDidMount() {
        axios
            .get("/user")
            .then((result) => {
                this.setState({
                    id: result.data.id,
                    first: result.data.first,
                    last: result.data.last,
                    imgUrl: result.data.img_url,
                    bio: result.data.bio,
                });
                let profPic = document.getElementsByClassName("profile-pic");
                for (let i = 0; i < profPic.length; i++) {
                    profPic[i].addEventListener("error", () => {
                        console.log("eror on img");
                        profPic[i].setAttribute(
                            "src",
                            "/images/default_banana.gif"
                        );
                    });
                }
            })
            .catch((e) => {
                console.log("error in axios get user", e);
            });
    }
    toggleModal() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    setProfilePic(newImg) {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
            imgUrl: newImg,
        });
    }
    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    render() {
        return (
            <React.Fragment>
                <BrowserRouter>
                    <div className="header">
                        <Link className="logo-name" to="/">
                            <Logo />
                            <h3 className="name">Old Skullers</h3>
                        </Link>
                        <div className="blank"></div>
                        <div id="nav-bar">
                            <Link className="button" to="/friends">
                                Friends
                            </Link>
                            <Link className="button" to="/find/users">
                                Find People
                            </Link>
                            <Link className="button" to="/online">
                                Online Users
                            </Link>
                            <Link className="button" to="/chat">
                                Shoutbox
                            </Link>
                            <a className="button" href="/logout">
                                Logout
                            </a>
                        </div>
                        <div onClick={() => this.toggleModal()}>
                            <ProfilePic
                                first={this.state.first}
                                last={this.state.last}
                                imgUrl={this.state.imgUrl}
                            />
                        </div>
                    </div>
                    <div className="content">
                        <Route
                            exact
                            path="/"
                            render={() => (
                                <Profile
                                    first={this.state.first}
                                    last={this.state.last}
                                    imgUrl={this.state.imgUrl}
                                    bio={this.state.bio}
                                    setBio={this.setBio}
                                />
                            )}
                        />
                        <Route
                            path="/user/:id"
                            render={(props) => (
                                <OtherProfile
                                    key={props.match.url}
                                    match={props.match}
                                    history={props.history}
                                />
                            )}
                        />
                        <Route path="/find/users" component={FindPeople} />
                        <Route exact path="/friends" component={Friends} />
                        <Route exact path="/chat" component={Chat} />
                        <Route
                            path="/online"
                            render={() => <OnlineUsers id={this.state.id} />}
                        />
                        <Route exact path="/chat/:id" component={PrivateChat} />
                    </div>
                </BrowserRouter>
                {this.state.uploaderIsVisible && (
                    <Uploader
                        setProfilePic={this.setProfilePic}
                        closeModal={this.toggleModal}
                    />
                )}
            </React.Fragment>
        );
    }
}
