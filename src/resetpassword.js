import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class ResetPassword extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            step: "enter email",
        };
    }
    submitEmail() {
        axios
            .post("/password/reset/start", {
                email: this.state.email,
            })
            .then((result) => {
                if (result.data.success) {
                    this.setState({ step: "enter code" });
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((e) => {
                console.log("error in axios reset pass", e);
            });
    }
    submitCode() {
        axios
            .post("/password/reset/verify", {
                email: this.state.email,
                code: this.state.code,
                newPass: this.state.newPass,
            })
            .then((result) => {
                if (result.data.success) {
                    this.setState({ step: "success" });
                } else {
                    this.setState({ error: true });
                }
            })
            .catch((e) => {
                console.log("error in axios verify", e);
            });
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }
    getCurrentDisplay() {
        const step = this.state.step;
        if (step == "enter email") {
            return (
                <div className="form">
                    <h3>Reset password</h3>
                    {this.state.error && (
                        <div className="error">
                            Oops! Something went wrong. Pls try again!
                        </div>
                    )}
                    <h4>Please enter the email with which you registered</h4>
                    <label>email:</label>
                    <input
                        key="email"
                        name="email"
                        type="email"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <button onClick={() => this.submitEmail()}>submit</button>
                </div>
            );
        } else if (step == "enter code") {
            return (
                <div className="form">
                    <h3>Reset password</h3>
                    {this.state.error && (
                        <div className="error">
                            Oops! Something went wrong. Pls try again!
                        </div>
                    )}
                    <h4>Please enter the code you received</h4>
                    <label>code:</label>
                    <input
                        key="code"
                        name="code"
                        type="text"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <h4>Please enter a new password</h4>
                    <label>password:</label>
                    <input
                        key="newPass"
                        name="newPass"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <button onClick={() => this.submitCode()}>submit</button>
                </div>
            );
        } else if (step == "success") {
            return (
                <div>
                    <h3>succ3ss!</h3>
                    <h4>
                        You can now <Link to="/login">log in</Link> with your
                        new password!
                    </h4>
                </div>
            );
        }
    }
    render() {
        return <div>{this.getCurrentDisplay()}</div>;
    }
}
