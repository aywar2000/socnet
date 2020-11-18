DELETE TABLE IF EXISTS chat;

CREATE TABLE chat (
    id SERIAL PRIMARY KEY,
    text VARCHAR NOT NULL CHECK (text !=''),
    user_id INT NOT NULL REFERENCES users(id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO chat(text, user_id) VALUES (
    'radlivamchet',
    1
);
INSERT INTO chat(text, user_id) VALUES (
    'bogami majstore evo neznam',
    2
);
INSERT INTO chat(text, user_id) VALUES (
    'pa ajde majketi valjaće',
    6
);
INSERT INTO chat(text, user_id) VALUES (
    'jes jes',
    7
);
INSERT INTO chat(text, user_id) VALUES (
    'radlivamchet',
    12
);