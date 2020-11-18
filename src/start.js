import React from "react";
import ReactDOM from "react-dom";
// import HelloWorld from "./helloWorld";
// eslint-disable-next-line no-unused-vars
import Welcome from "./welcome.js";
import App from "./app";
//novo iz react devtools
import { createStore, applyMiddleware } from "redux";
import { Provider } from "react-redux";
import reduxPromise from "redux-promise";
import { composeWithDevTools } from "redux-devtools-extension";
import reducer from "./reducer";
import { init } from "./socket.js";

const store = createStore(
    reducer,
    composeWithDevTools(applyMiddleware(reduxPromise))
);

let elem;
// const userIsLoggedIn = location.pathname != "/welcome";

// if (userIsLoggedIn) {
//     elem = (
//         <Provider store={store}>
//             <App />;
//         </Provider>
//     );
// } else {
//     elem = <Welcome />;
// }
//Staro
// let elem;
if (location.pathname === "/welcome") {
    elem = <Welcome />;
} else {
    init(store);
    elem = (
        <Provider store={store}>
            <App />
        </Provider>
    ); //novo iz dev, promijeniti u elem = (<Provider store={store}><App /></Provider>)
}
ReactDOM.render(elem, document.querySelector("main"));
