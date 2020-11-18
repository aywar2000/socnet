import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { receiveFriendsWannabes, unfriend, acceptFriend } from "./actions";
import { Link } from "react-router-dom";

export default function Friends() {
    const dispatch = useDispatch();

    let friends = useSelector((state) => {
        return (
            state.friendsWannabes &&
            state.friendsWannabes.filter((friend) => friend.accepted === true)
        );
    });

    let wannabes = useSelector((state) => {
        return (
            state.friendsWannabes &&
            state.friendsWannabes.filter(
                (wannabe) => wannabe.accepted === false
            )
        );
    });

    useEffect(() => {
        dispatch(receiveFriendsWannabes());
    }, []);

    return (
        <React.Fragment>
            <div>
                {wannabes && wannabes.length > 0 && (
                    <p>
                        potential friends ({wannabes.length}):
                    </p>
                )}
                <div>
                    {wannabes &&
                        wannabes.map((wannabe) => {
                            return (
                                <div
                                    key={wannabe.id}
                                    
                                >
                                    <div>
                                        <img
                                            
                                            src={wannabe.img_url}
                                            onError={(e) => {
                                                e.target.src =
                                                    "/ok.png";
                                            }}
                                        />
                                    </div>
                                    <Link
                                        to={"/user/" + wannabe.id}
                                        
                                    >
                                        {wannabe.first} {wannabe.last}
                                    </Link>
                                    <button
                                        className="friend-btn"
                                        onClick={() => {
                                            dispatch(acceptFriend(wannabe.id));
                                        }}
                                    >
                                        Accept Friend Request
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
            <div>
                {friends && friends.length > 0 && (
                    <p>
                        friends ({friends.length}):
                    </p>
                )}
                <div>
                    {friends &&
                        friends.map((friend) => {
                            return (
                                <div
                                    key={friend.id}
                                   
                                >
                                    <div>
                                        <img
                                            
                                            src={friend.img_url}
                                            onError={(e) => {
                                                e.target.src =
                                                    "/ok.png";
                                            }}
                                        />
                                    </div>
                                    <Link
                                        to={"/user/" + friend.id}
                                        
                                    >
                                        {friend.first} {friend.last}
                                    </Link>
                                    <button
                                        className="friend-btn"
                                        onClick={() =>
                                            dispatch(unfriend(friend.id))
                                        }
                                    >
                                        end friendship
                                    </button>
                                </div>
                            );
                        })}
                </div>
            </div>
        </React.Fragment>
    );
}
