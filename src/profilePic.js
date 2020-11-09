import React from "react";

export default function ProfilePic({ first, last, imgUrl }) {
    // console.log("props from App:", first, last, imgUrl);

    return (
        <>
            <h2>
                Hey I am the profile pic component My name is {first} {last}
            </h2>
            <img className="small" src={imgUrl || "/img/default.jpg"} />
        </>
    );
}