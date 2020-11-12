import React from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    handleChange({ target }) {
        this.setState({
            [target.name]: target.value,
        });
    }

    login() {
        axios
            .post("/login", {
                email: this.state.email,
                password: this.state.password,
            })
            .then(({ data }) => {
                if (data.success) {
                    location.replace("/");
                } else {
                    this.setState({
                        error: true,
                    });
                }
            })
            .catch(() => {
                this.setState({
                    error: true,
                });
            });
    }

    render() {
        return (
            <div className="login-input">
                {this.state.error && (
                    <div className="error">something went wrong</div>
                )}
                <input
                    name="email"
                    placeholder="email"
                    onChange={(e) => this.handleChange(e)}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="password"
                    onChange={(e) => this.handleChange(e)}
                />
                <button onClick={() => this.login()}>Log in</button>
                <div className="links-login">
                    <h1>
                        still not registered? <Link to="/">click here</Link>
                    </h1>
                    <h1>
                        forgot your password?
                        <Link to="/reset">reset it here</Link>
                    </h1>
                </div>
            </div>
        );
    }
}
