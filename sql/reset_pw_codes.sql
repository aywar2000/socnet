DROP TABLE IF EXISTS reset_pw_codes;

CREATE TABLE reset_pw_codes(
      id SERIAL PRIMARY KEY,
      code VARCHAR(255),
      email VARCHAR(255),
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );