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
        <div className="find-container">
            <input onChange={handleChange} placeholder="find people"></input>
            <div>
                {users.map((user) => {
                    return (
                        <div key={user.id} className="user-id">
                            <img
                                src={user.img_url || "/ok.png"}
                                className="find-foto"
                            />
                            <Link to={"/user/" + user.id}>
                                {user.first} {user.last}
                            </Link>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
