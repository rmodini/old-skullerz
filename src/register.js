import React from "react";
// import axios from "axios";
// no longger from "axios", now:
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post(
                "/register",
                {
                    first: this.state.first,
                    last: this.state.last,
                    email: this.state.email,
                    pass: this.state.pass,
                }
                // you can do this en every post req
                // {
                //     xsrfCookieName: "mytoken",
                //     xsrfHeaderName: "csrf-token"
                // }
                // or also *
            )
            .then((response) => {
                if (response.data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            });
    }
    handleChange({ target }) {
        // this[target.name] = target.value;
        // or put it on setstate, but not necessary bc input already updates the ui when user types
        this.setState({
            [target.name]: target.value,
        });
    }
    render() {
        return (
            <div className="form">
                <div>
                    <h4>Register to join this great community!</h4>
                </div>
                {this.state.error && (
                    <div className="error">
                        Oops! Something went wrong. Pls try again!
                    </div>
                )}
                <br></br>
                <label>first name:</label>
                <input
                    name="first"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                />
                <label>last name:</label>
                <input
                    name="last"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                />
                <label>email:</label>
                <input
                    name="email"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                    type="email"
                />
                <label>password:</label>
                <input
                    name="pass"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                    type="password"
                />
                <button onClick={() => this.submit()}>register</button>
                <p>
                    Already a member? <Link to="/login">log in!</Link>
                </p>
            </div>
        );
    }
}
