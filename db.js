// eslint-disable-next-line no-undef
var spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socnet"
);

module.exports.insertUsers = (first, last, email, password) => {
    const q = `INSERT INTO users(first, last, email, password)
              VALUES ($1, $2, $3, $4)
              RETURNING *`;
    const params = [first, last, email, password];
    return db.query(q, params);
};

module.exports.getPass = (email) => {
    const q = `SELECT id, password FROM users WHERE email=$1`;
    const params = [email];
    return db.query(q, params);
};

module.exports.checkEmail = (email) => {
    const q = `SELECT EXISTS(
        SELECT 1 FROM users WHERE users.email=$1
    )`;
    const params = [email];
    return db.query(q, params);
};

module.exports.insertCode = (code, email) => {
    const q = `INSERT INTO reset_pw_codes (code, email)
    VALUES ($1, $2)
    RETURNING *`;
    const params = [code, email];
    return db.query(q, params);
};

module.exports.findCode = (email) => {
    const q = `SELECT * FROM reset_pw_codes
    WHERE email=$1
    AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'`;
    const params = [email];
    return db.query(q, params);
};

module.exports.updateUser = (email, hashedPassword) => {
    const q = `UPDATE users
    SET password=$2
    WHERE email=$1`;
    const params = [email, hashedPassword];
    return db.query(q, params);
};

module.exports.getUserInfo = (id) => {
    const q = `SELECT * FROM users
    WHERE id=$1`;
    const params = [id];
    return db.query(q, params);
};

module.exports.addProfilePic = (imgUrl, id) => {
    const q = `UPDATE users
    SET img_url=$1
    WHERE id=$2`;
    const params = [imgUrl, id];
    return db.query(q, params);
};

module.exports.addBio = (newBio, id) => {
    const q = `UPDATE users
    SET bio=$1
    WHERE id=$2`;
    const params = [newBio, id];
    return db.query(q, params);
};
module.exports.getLastUsers = (id) => {
    const q = `SELECT * FROM users
     WHERE id != $1
     ORDER BY created_at DESC 
     LIMIT 3;`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getMatchingUsers = (val, id) => {
    const q = `SELECT * FROM users 
    WHERE first ILIKE $1
    AND id != $2`;
    const params = [val + "%", id];
    return db.query(q, params);
};

module.exports.getInitialStatus = (userId, otherId) => {
    const q = `SELECT * FROM friendships 
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.makeFriendRequest = (userId, otherId) => {
    const q = `INSERT INTO friendships (sender_id, recipient_id)
    VALUES ($1, $2)
    RETURNING *`;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.deleteFriendship = (userId, otherId) => {
    const q = `DELETE FROM friendships
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.addFriendship = (userId, otherId) => {
    const q = `UPDATE friendships
    SET accepted=true
    WHERE (recipient_id = $1 AND sender_id = $2)
    OR (recipient_id = $2 AND sender_id = $1)`;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.getFriendsWannabes = (id) => {
    const q = `SELECT users.id, first, last, img_url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND sender_id = users.id)
    OR (accepted = true AND recipient_id = $1 AND recipient_id = users.id)`;
    const params = [id];
    return db.query(q, params);
};
