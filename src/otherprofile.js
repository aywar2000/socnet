import React from "react";
import axios from "./axios";
import FriendBtn from "./friendbtn.js";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        console.log("this.props.match", this.props.match);
        const id = this.props.match.params.id;

        axios
            .get(`/user/${id}.json`)
            .then(({ data }) => {
                if (data.redirect) {
                    this.props.history.push("/");
                } else {
                    this.setState({
                        id: data[0].id,
                        first: data[0].first,
                        last: data[0].last,
                        imgUrl: data[0].img_url,
                        bio: data[0].bio,
                    });
                }
            })
            .catch((error) =>
                console.log("error otherprofile component didn't mount", error)
            );
    }

    render() {
        return (
            <React.Fragment>
                <div className="other-profile">
                    <div className="other-info">
                        <img
                            className="other-foto"
                            src={this.state.imgUrl}
                            onError={(e) => {
                                e.target.src = "/ok.png";
                            }}
                        />
                        <h1 className="other-name">
                            {this.state.first} {this.state.last}
                        </h1>
                        {this.state.bio}
                    </div>

                    <FriendBtn
                        id={this.props.match.params.id}
                        className="friend-btn"
                    />
                </div>
            </React.Fragment>
        );
    }
}
