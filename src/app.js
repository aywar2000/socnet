import React from "react";
import axios from "./axios";
import Uploader from "./uploader";
import Logo from "./logo";
import Uploader from "./uploader";
import { BrowserRouter, Route, Link } from "react-router-dom";

export default class App extends React.Component {
    constructor() {
        super();
        this.state = {
            first: this.state.first,
            last: this.state.last,
            imgUrl: null,
            uploaderIsVisible: false,
        };
        this.methodInApp = this.methodInApp.bind(this);
    }

    componentDidMount() {
        console.log("App just mounted");
        axios
            .get("/")
            .then(({ data }) => {
                this.setState({
                    id: data[0].id,
                    first: data[0].first,
                    last: data[0].last,
                    bio: data[0].bio,
                    imgUrl: data[0].img_url,
                    timestamp: data[0].created_at,
                });
            })
            .catch((error) => {
                console.log("error in cdm in app: ", error);
            });
    }

    toggleUploader() {
        this.setState({
            uploaderIsVisible: !this.state.uploaderIsVisible,
        });
    }
    
    methodInApp(arg) {
        console.log("running in App component");
        console.log("the argument I got passed was:", arg);
        console.log("this is the current state of app:", this.state);
    }

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


    render() {
        return (
            <BrowserRouter>
                <div>
                    <div>
                        <Route exact path="/" component={Logo} />
                        
                           <header>
                           <h1>Hey I am your App :D</h1>
                           </header>
                <div className="main-container">
                    <Xmpl
                        first={this.state.first}
                        last={this.state.last}
                        imgUrl={this.state.imgUrl}
                    />
                    <h2 onClick={() => this.toggleUploader()}>
                        {" "}
                        Changing state with a method: toggleUploader
                        {this.state.uploaderIsVisible && " 🐵"}
                        {!this.state.uploaderIsVisible && " 🙈"}{" "}
                    </h2>
                    {this.state.uploaderIsVisible && (
                        <Uploader methodInApp={this.methodInApp} />
                    )}
                </div>
                    </div>

                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                first={this.state.first}
                                last={this.state.last}
                                bio={this.state.bio}
                                imgUrl={this.state.imgUrl}
                                toggleModal={() => this.toggleModal()}
                                setBio={(newBio) => this.setBio(newBio)}
                            />
                        )}
                    />
                    )}
                </div>
            </BrowserRouter>
        );
    }
}
