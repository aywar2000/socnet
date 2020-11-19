import React, { useEffect, useRef } from "react";
import { socket } from "./socket";
import { useSelector } from "react-redux";

export default function Chat() {
    const elemRef = useRef();
    const chatMessages = useSelector((state) => state && state.msgs);

    useEffect(() => {
        elemRef.current.scrollTop =
            elemRef.current.scrollHeight - elemRef.current.clientHeight;
    }, [chatMessages]);

    const keyCheck = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            socket.emit("newChatMsg", e.target.value);
            e.target.value = "";
        }
    };

    return (
        <div>
            <div className="chat-container">
                <div ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((msgs) => {
                            return (
                                <div className="msg-container" key={msgs.id}>
                                    <div className="msg-img">
                                        <img
                                            height="50px"
                                            src={msgs.img_url}
                                            onError={(e) => {
                                                e.target.src = "/ok.png";
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p className="msg-user">
                                            {msgs.first} {msgs.last}
                                        </p>
                                        <div className="msg-text">
                                            <p>{msgs.text}</p>
                                        </div>
                                        at
                                        <p className="msg-date">
                                            {new Date(
                                                msgs.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <textarea className="msg-textarea"
                    placeholder="say it loud"
                    onKeyDown={keyCheck}
                ></textarea>
            </div>
        </div>
    );
}
