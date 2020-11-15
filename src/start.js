import React from "react";
import ReactDOM from "react-dom";
// import HelloWorld from "./helloWorld";
// eslint-disable-next-line no-unused-vars
import Welcome from "./welcome.js";
import App from "./app";

//novo iz react devtools

//import { createStore, applyMiddleware } from "redux";
//import reduxPromise from "redux-promise";
//import { composeWithDevTools } from "redux-devtools-extension";
//import { Provider } from "react-redux";
//mport reducer from "./reducer";
//const store = createStore(
//    reducer,
//    composeWithDevTools(applyMiddleware(reduxPromise))
//);

let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    elem = <App />; //novo iz dev, promijeniti u elem = (<Provider store={store}><App /></Provider>)
}
ReactDOM.render(elem, document.querySelector("main"));
