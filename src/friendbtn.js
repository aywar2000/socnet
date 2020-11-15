import React, { useState, useEffect } from "react";
import axios from "./axios";

export default function FriendBtn(props) {
    const [buttonText, setButtonText] = useState();

    useEffect(() => {
        axios
            .get(`/checkfriendshipstatus/${props.id}`, {
                params: { id: props.id },
            })
            .then((response) => {
                if (response.data.length == 0) {
                    setButtonText("send request");
                } else if (
                    response.data[0].accepted == false &&
                    response.data[0].sender_id == props.id
                ) {
                    setButtonText("accept request");
                } else if (
                    response.data[0].accepted == false &&
                    response.data[0].sender_id != props.id
                ) {
                    setButtonText("cancel request");
                } else if (response.data[0].accepted == true) {
                    setButtonText("friendship's end");
                }
            })
            .catch((error) =>
                console.log("error when comp mounts initial: ", error)
            );
    }, []);

    const handleClick = (e) => {
        e.preventDefault();
        if (buttonText == "send request") {
            axios
                .post(`/makefriendshiprequest/${props.id}`, {
                    params: { id: props.id },
                })
                .then((response) => {
                    if (response.data[0].accepted == false) {
                        setButtonText("cancel request");
                    }
                })
                .catch((error) => {
                    console.log("error in make friend request: ", error);
                });
        } else if (
            buttonText == "cancel request" ||
            buttonText == "friendship's end"
        ) {
            axios
                .post(`/endfriendship/${props.id}`, {
                    params: { id: props.id },
                })
                .then(() => {
                    setButtonText("send request");
                })
                .catch((error) => {
                    console.log("error in cancel end friendship: ", error);
                });
        } else if (buttonText == "accept request") {
            axios
                .post(`/addfriendship/${props.id}`, {
                    params: { id: props.id },
                })
                .then(() => {
                    setButtonText("friendship's end");
                })
                .catch((error) => {
                    console.log("error in add friendship: ", error);
                });
        }
    };

    return (
        <React.Fragment>
            <button onClick={handleClick} className="friend-btn">
                {buttonText}
            </button>
            {buttonText == "friendship's end"}
        </React.Fragment>
    );
}
