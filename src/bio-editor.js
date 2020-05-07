import React from "react";
import axios from "./axios";

export default class BioEditor extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            bioEditorIsVisible: false,
        };
    }
    toggleBioEditor() {
        this.setState({
            bioEditorIsVisible: !this.state.bioEditorIsVisible,
        });
    }
    handleChange({ target }) {
        this.setState({
            bio: target.value,
        });
    }
    editBio() {
        axios
            .post("/edit/bio", { newBio: this.state.bio })
            .then((result) => {
                this.props.setBio(result.data);
                this.toggleBioEditor();
            })
            .catch((e) => {
                console.log("error in axios psot edit bio", e);
            });
    }
    render() {
        return (
            <React.Fragment>
                {!this.props.bio && (
                    <p
                        className="clickable"
                        onClick={() => this.toggleBioEditor()}
                    >
                        Add your bio here
                    </p>
                )}
                {this.props.bio && (
                    <div>
                        <p>{this.props.bio}</p>
                        <p
                            className="clickable"
                            onClick={() => this.toggleBioEditor()}
                        >
                            Edit your bio
                        </p>
                    </div>
                )}
                {this.state.bioEditorIsVisible && (
                    <div>
                        <textarea
                            className="bio"
                            defaultValue={this.props.bio || this.state.bio}
                            onChange={(e) => this.handleChange(e)}
                        ></textarea>
                        <button
                            className="save-btn"
                            onClick={() => this.editBio()}
                        >
                            Save
                        </button>
                    </div>
                )}
            </React.Fragment>
        );
    }
}
