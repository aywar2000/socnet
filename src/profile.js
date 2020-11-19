import React from "react";
import ProfilePic from "./profilePic";
import BioEditor from "./bioeditor";

export default function Profile({
    first,
    last,
    bio,
    setBio,
    toggleUploader,
    imgUrl,
}) {
    return (
        <React.Fragment>
            <div className="profile">
                <div className="user-foto">
                    <ProfilePic
                        toggleUploader={toggleUploader}
                        imgUrl={imgUrl}
                        onError={(e) => {
                            e.target.src = "/ok.png";
                        }}
                    />
                </div>
                <div className="user-info">
                    <h1 className="user-name">
                        {first} {last}
                    </h1>
                    <BioEditor bio={bio} setBio={setBio} />
                </div>
            </div>
        </React.Fragment>
    );
}
