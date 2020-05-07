import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/login", {
                email: this.state.email,
                pass: this.state.pass,
            })
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
        this.setState({
            [target.name]: target.value,
        });
    }
    render() {
        return (
            <div className="form">
                {this.state.error && (
                    <div className="error">
                        Oops! Something went wrong. Pls try again!
                    </div>
                )}
                <br></br>
                <label>Email:</label>
                <input
                    name="email"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                    type="email"
                />
                <label>Password:</label>
                <input
                    name="pass"
                    onChange={(e) => this.handleChange(e)}
                    autoComplete="off"
                    type="password"
                />
                <button onClick={() => this.submit()}>login</button>
                <p>
                    Don&apos;t have an account yet?{" "}
                    <Link to="/">Register now!</Link>
                </p>
                <p>
                    Forgot your password?{" "}
                    <Link to="/resetpassword">Click here to reset it</Link>
                </p>
            </div>
        );
    }
}
