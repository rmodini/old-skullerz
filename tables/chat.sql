DROP TABLE IF EXISTS chat;

CREATE TABLE chat(
    id SERIAL PRIMARY KEY,
    text VARCHAR(255) NOT NULL CHECK(text != ''),
    user_id INT NOT NULL REFERENCES users(id),
    posted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat (text, user_id) VALUES ('Message from user 199', 199), ('Message from user 199', 199), ('Message from user 100', 100), ('Message from user 19', 19), ('Message from user 4', 4);