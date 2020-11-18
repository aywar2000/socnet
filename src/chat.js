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
            <div>
                <div ref={elemRef}>
                    {chatMessages &&
                        chatMessages.map((msgs) => {
                            return (
                                <div key={msgs.id}>
                                    <div>
                                        <img
                                            height="30px"
                                            src={msgs.img_url}
                                            onError={(e) => {
                                                e.target.src = "/ok.png";
                                            }}
                                        />
                                    </div>
                                    <div>
                                        <p>
                                            {msgs.first} {msgs.last}
                                        </p>
                                        <div>
                                            <p>{msgs.text}</p>
                                        </div>
                                        <p>
                                            {new Date(
                                                msgs.created_at
                                            ).toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            );
                        })}
                </div>
                <textarea
                    placeholder="say it loud"
                    onKeyDown={keyCheck}
                ></textarea>
            </div>
        </div>
    );
}
