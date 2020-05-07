import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor() {
        super();
        this.state = {};
    }
    componentDidMount() {
        console.log("uploader mounted");
    }
    handleChange({ target }) {
        this.setState({
            [target.name]: target.files,
        });
    }
    uploadImage() {
        var formData = new FormData();
        formData.append("file", this.state.profilePic[0]);
        axios
            .post("/upload/profile-pic", formData)
            .then((result) => {
                this.props.setProfilePic(result.data.rows[0].img_url);
            })
            .catch((e) => {
                console.log("error uplaoding profile pic", e);
            });
    }
    closeModal() {
        this.props.closeModal();
    }
    render() {
        return (
            <React.Fragment>
                <div className="modal">
                    <h3>Choose a new profile image!</h3>
                    <img
                        src="/images/close-outline.svg"
                        className="x-btn"
                        onClick={() => this.closeModal()}
                    />
                    <input
                        name="profilePic"
                        type="file"
                        onChange={(e) => this.handleChange(e)}
                    />
                    <button onClick={() => this.uploadImage()}>upload</button>
                </div>
            </React.Fragment>
        );
    }
}
