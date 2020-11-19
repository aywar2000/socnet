import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Registration extends React.Component {
    constructor() {
        super();
        this.state = {};
        // this.handleChange = this.handleChange.bind(this);
    }

    handleChange(e) {
        console.log("e.target.value", e.target.name);
        this.setState(
            {
                [e.target.name]: e.target.value,
            },
            console.log("this.state: ", this.state)
        );
    }

    submit() {
        console.log("about to submit!!!");
        console.log("this.state: ", this.state);
        axios
            .post("/registration", {
                first: this.state.first,
                last: this.state.last,
                email: this.state.email,
                password: this.state.password,
            })
            .then((response) => {
                console.log("response", response);
                if (response.data.success) {
                    // then we want to redirect the user to our social network
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch((e) => console.log(e));
    }

    render() {
        console.log("this.state.error: ", this.state.error);
        return (
            <div className="register">
                <form className="input-form">
                    <h1>a network of like-minded</h1>
                    {this.state.error && <div>something went wrong</div>}
                    <input
                        name="first"
                        placeholder="first name"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <input
                        name="last"
                        placeholder="last name"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <input
                        name="email"
                        placeholder="email"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <input
                        name="password"
                        placeholder="password"
                        type="password"
                        onChange={(e) => this.handleChange(e)}
                    ></input>
                    <button onClick={() => this.submit()}>register now</button>
                    <h2>or</h2>
                    <div>
                        already a member?
                        <Link to="/login"> log in here</Link>
                    </div>
                </form>
            </div>
        );
    }
}
