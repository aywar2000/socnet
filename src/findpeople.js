import React, { useEffect, useState } from "react";
import axios from "./axios";
import { Link } from "react-router-dom";

export default function FindPeople() {
    const [users, setUsers] = useState([]);
    const [input, setInput] = useState("");

    useEffect(() => {
        let cleanup = false;
        axios
            .get("/findusers", { params: { val: input } })
            .then((response) => {
                if (!cleanup) {
                    setUsers(response.data);
                }
            })
            .catch((error) => {
                console.log("useeffect error", error);
            });

        return () => {
            cleanup = true;
        };
    }, [input]);

    const handleChange = (e) => {
        setInput(e.target.value);
    };

    return (
        <div>
            <h4>______________________</h4>
            <input onChange={handleChange} placeholder="find people"></input>
            <h3>connect with like-minded people here</h3>
            <div className="find-container">
                {users.map((user) => {
                    return (
                        <div key={user.id} className="user-id">
                            <img
                                src={user.img_url || "/ok.png"}
                                className="find-foto"
                            />
                            <div className="link-user">
                                <Link to={"/user/" + user.id}>
                                    {user.first} {user.last}
                                </Link>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
