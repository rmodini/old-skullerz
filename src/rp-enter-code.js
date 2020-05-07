import React from "react";

export default class EnterCode extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    submit() {}
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
                <h4>Please enter the code you received</h4>
                <label>Code:</label>
                <input
                    name="code"
                    type="text"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <h4>Please enter a new password</h4>
                <label>Password:</label>
                <input
                    name="pass"
                    type="password"
                    onChange={(e) => this.handleChange(e)}
                ></input>
                <button onClick={() => this.submit()}>Submit</button>
            </div>
        );
    }
}
