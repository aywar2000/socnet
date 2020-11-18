import React from "react";
import axios from "./axios";
// eslint-disable-next-line no-unused-vars
import Uploader from "./uploader";
import Logo from "./logo";
// eslint-disable-next-line no-unused-vars
import { BrowserRouter, Route, Link } from "react-router-dom";
//import ProfilePic from "./profilePic";
import Profile from "./profile";
import OtherProfile from "./otherprofile.js";
import FindPeople from "./findpeople";
//import FriendBtn from "./friendbtn";
import Friends from "./friends.js";
import Chat from "./chat.js";
//poludeću ooo poluudeću

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            //         first: this.state.first,
            //         last: this.state.last,
            //         imgUrl: null,
            uploaderIsVisible: false,
        };
        //     this.methodInApp = this.methodInApp.bind(this);
    }

    componentDidMount() {
        console.log("App just mounted");
        axios
            .get("/user")
            .then(({ data }) => {
                console.log(data);
                this.setState({
                    id: data[0].id,
                    first: data[0].first,
                    last: data[0].last,
                    bio: data[0].bio,
                    imgUrl: data[0].img_url,
                    timestamp: data[0].created_at,
                });
                console.log("this.state", this.state);
            })
            .catch((error) => {
                console.log("app error component did mount: ", error);
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }

    // methodInApp(arg) {
    //     console.log("running in App component");
    //     console.log("the argument I got passed was:", arg);
    //     console.log("this is the current state of app:", this.state);
    // }

    setImgUrl(url) {
        this.setState({
            imgUrl: url,
            uploaderIsVisible: false,
        });
    }

    setBio(newBio) {
        this.setState({
            bio: newBio,
        });
    }

    logout() {
        axios
            .get("/logout")
            .then(() => {
                location.replace("/welcome#/login");
            })
            .catch((err) => {
                console.log("error in logout: ", err);
            });
    }

    render() {
        return (
            <BrowserRouter>
                <div className="profile-container">
                    <div className="header-menu">
                        <Logo />

                        <header>
                            <h1>your profile</h1>
                        </header>
                    </div>
                    <Link to="/logout" onClick={() => this.logout()}>
                        <button id="logout-button">log out</button>
                    </Link>

                    {/* <div>
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            imgUrl={this.state.imgUrl}
                            toggleUploader={() => this.toggleUploader()}
                        />
                    </div> */}
                    <div>
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                toggleUploader={() => this.toggleUploader()}
                                setImgUrl={(url) => this.setImgUrl(url)} //za bio edit
                            />
                        )}
                    </div>
                </div>
                <div>
                    <Link to="/users">find like-minded people</Link>
                    <h4>______</h4>
                    <Link to="/friends">friends</Link>
                    <h4>______</h4>
                    <Link to="/chat">chat</Link>
                    <h4>______</h4>
                    <Profile
                        first={this.state.first}
                        last={this.state.last}
                        bio={this.state.bio}
                        imgUrl={this.state.imgUrl}
                        toggleUploader={() => this.toggleUploader()}
                        setBio={(newBio) => this.setBio(newBio)}
                    />
                </div>
                <Route
                    path="/user/:id"
                    render={(props) => (
                        <OtherProfile
                            key={props.match.url}
                            match={props.match}
                            history={props.history}
                        />
                    )}
                />
                <Route path="/users" component={FindPeople} />
                <Route path="/friends" component={Friends} />
                <Route path="/chat" component={Chat} />
                {/* <Route
                    exact
                    path="/"
                    render={() => (
                        <Profile
                            first={this.state.first}
                            last={this.state.last}
                            bio={this.state.bio}
                            imgUrl={this.state.imgUrl}
                            toggleUploader={() => this.toggleUploader()}
                            setBio={(newBio) => this.setBio(newBio)}
                        />
                    )}
                /> */}
            </BrowserRouter>
        );
    }
}
