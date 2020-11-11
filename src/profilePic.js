import React from "react";

export default function ProfilePic({ first, last, imgUrl, toggleUploader }) {
    // console.log("props from App:", first, last, imgUrl);

    return (
        <div>
            <h2>
                Hey I am the profile pic component My name is {first} {last}
            </h2>
            <img
                className="profile-pic"
                src={imgUrl}
                alt={`${first} ${last}`}
                onClick={() => toggleUploader()}
            />
        </div>
    );
}
