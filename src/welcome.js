import React from "react";
import Registration from "./register";
import Login from "./login";
import ResetPassword from "./resetpassword";
import { HashRouter, Route } from "react-router-dom";

export default class Welcome extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <HashRouter>
                <div className="welcome-bg">
                    <div className="welcome">
                        <h1>Welcome to Old Skullerz</h1>
                        <img
                            className="big-logo"
                            src="./images/skull_logo.png"
                        />
                        <h3>
                            Just another network for classic era video game
                            lovers.
                        </h3>
                        <Route exact path="/" component={Registration}></Route>
                        <Route path="/login" component={Login}></Route>
                        <Route
                            path="/resetpassword"
                            component={ResetPassword}
                        ></Route>
                    </div>
                </div>
            </HashRouter>
        );
    }
}
