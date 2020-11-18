import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function DeleteBtn(props) {

    useEffect(() => {
        console.log("props-id", props.id);
        axios
            .get(`/checkfriendshipstatus/${props.id}`, {
                params: { id: props.id },
            })
            .then((response) => {
            .catch((error) => console.log("error in component mount: ", error));
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
      });

    return (
        <React.Fragment>
            <button onClick={handleClick} className="friend-btn">
                {buttonText}
            </button>
        </React.Fragment>
    );
}
