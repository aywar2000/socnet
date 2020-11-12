import React from "react";

export default function ProfilePic({ first, last, imgUrl, toggleUploader }) {
    // console.log("props from App:", first, last, imgUrl);

    return (
        <div>
            {/* <h2>
                My name is {this.state.first} {this.state.last}
            </h2> */}
            <img
                className="profile-pic"
                src={imgUrl}
                alt={`${first} ${last}`}
                onClick={() => toggleUploader()}
            />
        </div>
    );
}
