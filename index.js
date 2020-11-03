const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
app.use(
    cookieSession({
        secret: "i'm tired",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

app.use(compression());
app.use(express.static("public"));
app.post("/register", (req, res) => {
    console.log("Hit the post register route!!!");
    console.log("req.body: ", req.body);

    // when everything works (i.e. hashing and inserting a row, and adding somethin to the session object)
    req.session.userId = 1;
    res.json({ success: true });
});

app.get("/welcome", (req, res) => {
    console.log("welcome reached");
    console.log("req.session", req.session);
    let { userId } = req.session;
    console.log("userid for cookie", userId);

    if (userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

//PETITION
// app.post("/register", (req, res) => {
//   const first = req.body.first;
//   const last = req.body.last;
//   const email = req.body.email;
//   const password = req.body.password;
//   console.log("req.body: ", req.body);
//   // console.log("passw", password);
//   hash(password)
//     .then((hashedPassword) => {
//       db.insertUsers(first, last, email, hashedPassword)
//         .then((result) => {
//           console.log("result.rows", result.rows);
//           req.session.userId = result.rows[0].id;
//           res.redirect("/profile");
//         })
//         .catch((err) => {
//           console.log("error in insert user", err);
//           res.render("register", {
//             err,
//           });
//         });
//     })
//     .catch((err) => {
//       console.log("err in hash", err);
//       res.render("register", { err });
//     });
// });

app.post("/register", (req, res) => {
    console.log("post to register route was made");
    //onst first = req.body.first;
    //   const last = req.body.last;
    //   const email = req.body.email;
    //   const password = req.body.password;
    //   console.log("req.body: ", req.body);
    const { first, last, email, password } = req.body;
    if (first !== "" && last !== "" && email !== "" && password !== "") {
        console.log("req.body", req.body);
        db.getPass(email) //traži korisnika
        .then((results) => {
        if (results.rows.length === 0) {
        hash(password)
        .then((hashedPw) => {
            db.insertUsers(first, last, email, hashedPw)
             .then(({ rows }) => {
                 console.log("result-rows", rows);
                 req.session.userId = rows[0].id;
                 console.log("rows.id", rows[0].id);
                 res.json({ success: true });
                // console.log("req.session.userId", req.session.userId);
                });
//ADD CATCH ERROR

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

// it is important that the * route is the LAST get route we have....
app.get("*", function (req, res) {
    console.log("req.session: ", req.session);
    // console.log("req.session.userId: ", req.session.userId);
    // console.log("!res.session.userId: ", !res.session.userId);
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

app.get("*", function (req, res) {
    console.log("have you seen the saucers?", req.session);
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
