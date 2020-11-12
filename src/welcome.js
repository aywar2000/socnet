import React from "react";
import Registration from "./registration";
import Login from "./login";
import ResetPassword from "./resetPassword";
import { HashRouter, Route } from "react-router-dom";

export default function Welcome() {
    return (
        <HashRouter>
            <div className="welcome-route">
                <h1>like</h1>
                <img src="/ok.png" className="logo-small" alt="logo" />

                <div>
                    <Route exact path="/" component={Registration} />
                    <Route path="/login" component={Login} />
                    <Route path="/reset" component={ResetPassword} />
                </div>
                <div>
                    _________________________________________________________________
                </div>
            </div>
        </HashRouter>
    );
}
