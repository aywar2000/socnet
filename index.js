const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
// eslint-disable-next-line no-unused-vars
const db = require("./db");
const csurf = require("csurf");
// eslint-disable-next-line no-unused-vars
const { hash, compare } = require("./bc");

////// MULTER (iz IMAGEBOARD)//////////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

/////////COOKIES
app.use(
    cookieSession({
        secret: "i'm tired",
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);
///////// CSRF
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(compression());
app.use(express.json());
app.use(express.static("public"));

app.post("/registration", (req, res) => {
    const first = req.body.first;
    const last = req.body.last;
    const email = req.body.email;
    const password = req.body.password;
    console.log("Hit the post register route!!!");
    console.log("req.body: ", req.body);
    hash(password)
        .then((hashedPassword) => {
            db.insertUsers(first, last, email, hashedPassword)
                .then((result) => {
                    console.log("result.rows", result.rows);
                    req.session.userId = result.rows[0].id;
                    res.json({ success: true });
                })
                .catch((err) => {
                    console.log("error in insert user", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("err in hash", err);
            res.json({ success: false });
        });
});

// when everything works (i.e. hashing and inserting a row, and adding somethin to the session object)
//req.session.userId = 1;
//res.json({ success: true });

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

// app.post("/register", (req, res) => {
//     console.log("post to register route was made");
//     //onst first = req.body.first;
//     //   const last = req.body.last;
//     //   const email = req.body.email;
//     //   const password = req.body.password;
//     //   console.log("req.body: ", req.body);
//     const { first, last, email, password } = req.body;
//     if (first !== "" && last !== "" && email !== "" && password !== "") {
//         console.log("req.body", req.body);
//         db.getPass(email) //traži korisnika
//         .then((results) => {
//         if (results.rows.length === 0) {
//         hash(password)
//         .then((hashedPw) => {
//             db.insertUsers(first, last, email, hashedPw)
//              .then(({ rows }) => {
//                  console.log("result-rows", rows);
//                  req.session.userId = rows[0].id;
//                  console.log("rows.id", rows[0].id);
//                  res.json({ success: true });
//                 // console.log("req.session.userId", req.session.userId);
//                 });
//ADD CATCH ERROR

// app.post("/login", (req, res) => {
//     db.getPass(req.body.email)
//         .then((result) => {
//             const hashedPw = result.rows[0].password;
//             const password = req.body.password; //promijenio iz pw u password
//             const id = result.rows[0].id;
//             compare(password, hashedPw)
//                 .then((matchValue) => {
//                     if (matchValue == true) {
//                         req.session.userId = id;
//                         console.log("id", id);
//                         db.getSignature(req.session.userId)
//                             .then((signatures) => {
//                                 if (signatures.rows[0]) {
//                                     //pazi na pisanje tu; promijenio u signatures, result-rows 1, jer mi je id 0
//                                     req.session.sigid = result.rows[0].id; //tu nešto zeza; uspio c.logati id
//                                     res.redirect("/thankyou");
//                                 } else {
//                                     res.redirect("/petition");
//                                 }
//                             })
//                             .catch((error) => {
//                                 console.log("ERARRE", error);
//                                 res.render("login", { error });
//                             });
//                     } else {
//                         //console.log("error sloj vanka", error);
//                         res.render("login", { error: true });
//                     }
//                 })
//                 .catch((error) => {
//                     res.render("login", {
//                         error,
//                     });
//                 });
//         })
//         .catch((error) => {
//             res.render("login", { error });
//         });
// });

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

app.get("*", function (req, res) {
    console.log("have you seen the saucers?", req.session);
    res.sendFile(__dirname + "/index.html");
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
