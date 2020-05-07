import React from "react";
import axios from "./axios";

export default class EnterEmail extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {
        axios
            .post("/resetpassword", {
                email: this.state.email,
            })
            .then(() => {})
            .catch((e) => {
                console.log("error in axios reset pass", e);
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
                <h3>Reset password</h3>
                {this.state.error && (
                    <div className="error">
                        Oops! Something went wrong. Pls try again!
                    </div>
                )}
                <h4>Please enter the email with which you registered</h4>
                <label>Email:</label>
                <input
                    name="email"
                    type="email"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <button onClick={() => this.submit()}>submit</button>
            </div>
        );
    }
}
