//CLASS NOTES

// all of the action creator functions
//action creator = fn that returns an obj
//obj returned is called an action

// export function fn(){
//     return{
//         type:"UPDATE_SOMETHING",
//         data[{}]
//     }
// }

import axios from "./axios";

export function receiveFriendsWannabes() {
    return axios
        .get("/friends-wannabes")
        .then(({ data }) => {
            return {
                type: "RECEIVE_FRIENDS_WANNABES",
                friendsWannabes: data,
            };
        })
        .catch((error) => {
            console.log("error in receive friends wannabes: ", error);
        });
}

export function unfriend(id) {
    return axios
        .post(`/endfriendship/${id}`)
        .then((response) => {
            return {
                type: "UNFRIEND",
                id: response.data,
            };
        })
        .catch((error) => {
            console.log("error in unfriend: ", error);
        });
}

export function acceptFriend(id) {
    return axios
        .post(`/addfriendship/${id}`)
        .then((response) => {
            return {
                type: "ACCEPT_FRIEND_REQUEST",
                id: response.data,
            };
        })
        .catch((error) => {
            console.log("error in receive friends wannabes: ", error);
        });
}

export function chatMessages(msgs) {
    return {
        type: "GET_LAST_TEN_MSGS",
        msgs,
    };
}

export function chatMessage(msg) {
    return {
        type: "NEW_CHAT_MESSAGE",
        msg,
    };
}
