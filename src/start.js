import React from "react";
import ReactDOM from "react-dom";
// import HelloWorld from "./helloWorld";
// eslint-disable-next-line no-unused-vars
import Welcome from "./welcome.js";
import App from "./app";

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />;
}
ReactDOM.render(elem, document.querySelector("main"));
