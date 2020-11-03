import React from "react";

export default function greetYe(props) {
    //after setting it in helloworld!  - props == convention, could be anything
    console.log("props", props);
    return (
        <div>
            <p>{props.first}</p>
            <h1>BRUCE LEE</h1>
        </div>
    );
}
