const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socialnetwork"
);

module.exports.insertNewUser = (first, last, email, pass) => {
    const q = `
    INSERT INTO users (first, last, email, pass)
    VALUES ($1, $2, $3, $4)
    RETURNING id
    ;`;
    const params = [first, last, email, pass];
    return db.query(q, params);
};

module.exports.getHashedPw = (email) => {
    const q = `
    SELECT pass, id FROM users
    WHERE email = $1
    ;`;
    const params = [email];
    return db.query(q, params);
};

module.exports.findUserByEmail = (email) => {
    const q = `
    SELECT id FROM users
    WHERE email = $1
    ;`;
    const params = [email];
    return db.query(q, params);
};

module.exports.insertResetCode = (email, code) => {
    const q = `
    INSERT INTO password_reset_codes (email, code)
    VALUES ($1, $2)
    ;`;
    const params = [email, code];
    return db.query(q, params);
};

module.exports.getResetCode = (email) => {
    const q = `
    SELECT code FROM password_reset_codes
    WHERE email = $1
    AND CURRENT_TIMESTAMP - created_at < INTERVAL '10 minutes'
    ;`;
    const params = [email];
    return db.query(q, params);
};

module.exports.updatePw = (email, pass) => {
    const q = `
    UPDATE users
    SET pass = $2
    WHERE email = $1
    ;`;
    const params = [email, pass];
    return db.query(q, params);
};

module.exports.getUserById = (id) => {
    const q = `
    SELECT * FROM users
    WHERE id = $1
    ;`;
    const params = [id];
    return db.query(q, params);
};

module.exports.addProfilePic = (id, img_url) => {
    const q = `
    UPDATE users
    SET img_url = $2
    WHERE id = $1
    RETURNING img_url
    ;`;
    const params = [id, img_url];
    return db.query(q, params);
};

module.exports.updateBio = (id, newBio) => {
    const q = `
    UPDATE users
    SET bio = $2
    WHERE id = $1
    RETURNING bio
    ;`;
    const params = [id, newBio];
    return db.query(q, params);
};

module.exports.getLastUsers = () => {
    const q = `
    SELECT * FROM users
    ORDER BY id DESC
    LIMIT 3
    ;`;
    return db.query(q);
};

module.exports.getUsersByInput = (input) => {
    const q = `
    SELECT * FROM users
    WHERE first ILIKE $1
    OR last ILIKE $1
    ;`;
    const params = [input + "%"];
    return db.query(q, params);
};

module.exports.getInitialFriendshipStatus = (id, otherUserId) => {
    const q = `
    SELECT * FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)
    ;`;
    const params = [id, otherUserId];
    return db.query(q, params);
};

module.exports.makeFriendRequest = (id, otherUserId) => {
    const q = `
    INSERT INTO friendships (sender_id, receiver_id)
    VALUES ($1, $2)
    ;`;
    const params = [id, otherUserId];
    return db.query(q, params);
};

module.exports.addFriendship = (id, otherUserId) => {
    const q = `
    UPDATE friendships
    SET accepted = true
    WHERE (receiver_id = $1 AND sender_id = $2)
    ;`;
    const params = [id, otherUserId];
    return db.query(q, params);
};

module.exports.endFriendship = (id, otherUserId) => {
    const q = `
    DELETE FROM friendships
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)
    ;`;
    const params = [id, otherUserId];
    return db.query(q, params);
};

module.exports.getFriendsWannabes = (id) => {
    const q = `
    SELECT users.id, first, last, img_url, accepted
    FROM friendships
    JOIN users
    ON (accepted = false AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND receiver_id = $1 AND sender_id = users.id)
    OR (accepted = true AND sender_id = $1 AND receiver_id = users.id)
    ;`;
    const params = [id];
    return db.query(q, params);
};

module.exports.getLastTenMessages = () => {
    const q = `
    SELECT chat.id, chat.user_id, text, posted_at, first, last, img_url
    FROM chat
    JOIN users
    ON users.id = chat.user_id
    ORDER BY chat.id DESC
    LIMIT 10
    ;`;
    return db.query(q);
};

module.exports.insertNewMsg = (id, text) => {
    const q = `
    INSERT INTO chat (user_id, text)
    VALUES ($1, $2)
    ;`;
    const params = [id, text];
    return db.query(q, params);
};

module.exports.getUsersFromArray = (array) => {
    const q = `
    SELECT id, first, last, img_url
    FROM users 
    WHERE id = ANY($1);
    ;`;
    const params = [array];
    return db.query(q, params);
};

module.exports.getPrivMsgs = (userId, otherId) => {
    const q = `
    SELECT private_chats.id, first, last, sender_id, receiver_id, private_chats.text, private_chats.posted_at
    FROM users
    JOIN private_chats
    ON users.id = private_chats.sender_id
    WHERE (receiver_id = $1 AND sender_id = $2)
    OR (receiver_id = $2 AND sender_id = $1)
    ORDER BY private_chats.id ASC
    ;`;
    const params = [userId, otherId];
    return db.query(q, params);
};

module.exports.insertPrivMsg = (userId, otherId, text) => {
    const q = `
    INSERT INTO private_chats (sender_id, receiver_id, text)
    VALUES ($1, $2, $3)
    ;`;
    const params = [userId, otherId, text];
    return db.query(q, params);
};
