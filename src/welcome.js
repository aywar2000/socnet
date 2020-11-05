import React from "react";
import Registration from "./registration";

export default function Welcome() {
    return (
        <div>
            <h1>
                I am the welcome component, below is Registration child
                component
            </h1>
            <Registration />
            <a href="/login">if you have a profile, get a life</a>
            <img src="" />
        </div>
    );
}
