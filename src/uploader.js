import React from "react";
import axios from "./axios";

export default class Uploader extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: false,
        };
    }

    handleChange(e) {
        this.setState({
            file: e.target.files[0],
        });
    }

    uploadImage(e) {
        e.preventDefault();
        var formData = new FormData();
        formData.append("file", this.state.file);
        axios
            .post("/upload", formData)
            .then(({ data }) => {
                console.log(data.imgUrl);
                let imgUrl = data.imgUrl;
                this.props.setImgUrl(imgUrl);
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div>
                <h1
                    onClick={() => this.props.toggleUploader()} //slično i za bio uploader
                    className="close-uploader"
                >
                    X
                </h1>
                {this.state.error && <p>something went wrong</p>}

                <input
                    onChange={(e) => this.handleChange(e)}
                    type="file"
                    name="file"
                    accept="image/*"
                />
                <button onClick={(e) => this.uploadImage(e)}>
                    upload photo
                </button>
            </div>
        );
    }
}
