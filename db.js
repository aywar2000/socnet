const db = spicedPg(
    process.env.DATABASE_URL ||
        "postgres:postgres:postgres@localhost:5432/socnet"
);

module.exports.getPass = (email) => {
    const q = `SELECT id, password FROM users WHERE email=$1`;
    const params = [email];
    return db.query(q, params);
};

// module.exports.getPass = (email) => {
//     const q = `SELECT id, password FROM users WHERE email=$1`;
//     const params = [email];
//     return db.query(q, params);
// };

module.exports.insertUsers = (first, last, email, pw) => {
  const q = `INSERT INTO users(first, last, email, password)
              VALUES ($1, $2, $3, $4)
              RETURNING *`;
  const params = [first, last, email, pw];
  return db.query(q, params);