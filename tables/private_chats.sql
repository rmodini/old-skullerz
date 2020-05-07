DROP TABLE IF EXISTS private_chats;

CREATE TABLE private_chats(
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL CHECK(text != ''),
    sender_id INT NOT NULL REFERENCES users(id),
    receiver_id INT NOT NULL REFERENCES users(id),
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO private_chats (text, sender_id, receiver_id)
VALUES ('Message from user 50 to user 68', 50, 68),
('Message from user 50 to 68', 50, 68),
('Message from user 68 to 50', 68, 50),
('Message from user 20 to 21', 20, 21),
('Message from user 21 to 20', 21, 20);