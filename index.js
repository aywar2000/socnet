const express = require("express");
const app = express();
const compression = require("compression");
//socket
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });
const cookieSession = require("cookie-session");
const db = require("./db");
// eslint-disable-next-line no-unused-vars
const csurf = require("csurf");
const { hash, compare } = require("./bc");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3");
const s3url = "https://s3.amazonaws.com/spicedling/";

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

// eslint-disable-next-line no-unused-vars
const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

/////////COOKIES

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: "i'm tired",
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});
app.use(
    express.urlencoded({
        extended: false,
    })
);
///////// CSRF
app.use(express.json());
app.use(csurf());
app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.use(express.static("public"));
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
    if (!req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/");
    }
    console.log("welcome reached");
    console.log("req.session", req.session);
    let { userId } = req.session;
    console.log("userid for cookie", userId);

    app.get("/welcome", (req, res) => {
        if (req.session.userId) {
            res.redirect("/");
        } else {
            res.sendFile(__dirname + "/index.html");
        }
    });
    if (userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

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

app.post("/login", (req, res) => {
    db.getPass(req.body.email)
        .then((result) => {
            const hashedPassword = result.rows[0].password;
            const password = req.body.password;
            console.log("Password", password);
            const id = result.rows[0].id;

            console.log("hashedPw", hashedPassword);
            compare(password, hashedPassword)
                .then((matchValue) => {
                    if (matchValue == true) {
                        req.session.userId = id;
                        console.log("id", id);
                        res.json({
                            success: true,
                        });
                    } else {
                        res.json({ success: false });
                    }
                })
                .catch((error) => {
                    console.log("error in POST login compare", error);
                    res.json({
                        success: false,
                    });
                });
        })
        .catch((error) => {
            console.log("error in post login: ", error);
            res.json({
                success: false,
            });
        });
});

// when everything works (i.e. hashing and inserting a row, and adding somethin to the session object)
//req.session.userId = 1;
//res.json({ success: true });
app.post("/password/reset/start", (req, res) => {
    db.checkEmail(req.body.email)
        .then((result) => {
            if (result.rows[0].exists == true) {
                const secretCode = cryptoRandomString({
                    length: 6,
                });
                let email = req.body.email;
                db.insertCode(secretCode, email)
                    .then(() => {
                        ses.sendEmail(
                            email,
                            "socnet email verification",
                            secretCode
                        )
                            .then(() => {
                                res.json({
                                    success: true,
                                });
                            })
                            .catch((err) => {
                                console.log(err);
                                res.json({
                                    success: false,
                                });
                            });
                    })
                    .catch((error) => {
                        console.log("error in insertCode: ", error);
                        res.json({
                            success: false,
                        });
                    });
            } else {
                res.json({
                    success: false,
                });
            }
        })
        .catch((error) => {
            console.log("error in db.check email: ", error);
            res.json({
                state: false,
            });
        });
});

app.post("/password/reset/verify", (req, res) => {
    db.findCode(req.body.email)
        .then((result) => {
            let index = result.rows.length - 1;
            if (result.rows[index].code == req.body.code) {
                hash(req.body.password)
                    .then((hashedPassword) => {
                        db.updateUser(req.body.email, hashedPassword)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("error in password catch: ", err);
                                res.json({
                                    success: false,
                                });
                            });
                    })
                    .catch((err) => {
                        console.log("error in hash", err);
                        res.json({ success: false });
                    });
            } else {
                res.json({
                    success: false,
                });
            }
        })
        .catch((error) => {
            console.log("error in find code: ", error);
            res.json({
                success: false,
            });
        });
});

app.get("/user", (req, res) => {
    console.log("tu sam");
    const id = req.session.userId;
    db.getUserInfo(id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((error) => {
            console.log("error in getUserInfo: ", error);
        });
});

app.get("/user/:id.json", (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({
            redirect: true,
        });
    } else {
        db.getUserInfo(req.params.id)
            .then((result) => {
                if (result.rows[0]) {
                    res.json(result.rows);
                } else {
                    res.json({
                        redirect: true,
                    });
                }
            })
            .catch((error) => {
                console.log("error in db - userid", error);
            });
    }
});

app.get("/findusers", (req, res) => {
    if (req.query.val == "") {
        db.getLastUsers(req.session.userId)
            .then((result) => {
                res.json(result.rows);
            })
            .catch((error) => {
                console.log("error in get users: ", error);
            });
    } else {
        db.getMatchingUsers(req.query.val, req.session.userId)
            .then((result) => {
                res.json(result.rows);
            })
            .catch((error) =>
                console.log("error in get matching users: ", error)
            );
    }
});
app.get("/logout", (req, res) => {
    req.session = null;
    res.json({ logout: true });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    let userId = req.session.userId;
    let imageUrl = s3url + req.file.filename;

    db.addProfilePic(imageUrl, userId)
        .then(() => {
            res.json({
                success: true,
                imgUrl: imageUrl,
            });
        })
        .catch((error) => {
            console.log("error in insert prof pic: ", error);
            res.json({
                error: true,
            });
        });
});

app.post("/bio", (req, res) => {
    let userId = req.session.userId;
    let newBio = req.body.newBio;
    db.addBio(newBio, userId)
        .then(() => {
            res.json({
                success: true,
                newBio,
            });
        })
        .catch((error) => {
            console.log("error in post bio: ", error);
        });
});
app.get("/checkfriendshipstatus/:id", (req, res) => {
    let userId = req.session.userId;
    let otherId = req.params.id;

    db.getInitialStatus(userId, otherId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((error) =>
            console.log("error in select initial status: ", error)
        );
});

app.post("/makefriendshiprequest/:id", (req, res) => {
    let userId = req.session.userId;
    let otherId = req.params.id;

    db.makeFriendRequest(userId, otherId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((error) => {
            console.log("error in make friend request: ", error);
        });
});

app.post("/endfriendship/:id", (req, res) => {
    let userId = req.session.userId;
    let otherId = req.params.id;
    db.deleteFriendship(userId, otherId)
        .then(() => {
            res.json(otherId);
        })
        .catch((error) => {
            console.log("error in cancel end friendship: ", error);
        });
});

app.post("/addfriendship/:id", (req, res) => {
    let userId = req.session.userId;
    let otherId = req.params.id;
    db.addFriendship(userId, otherId)
        .then(() => {
            res.json(otherId);
        })
        .catch((error) => {
            console.log("error in add friendship: ", error);
        });
});

app.get("/friends-wannabes", (req, res) => {
    let id = req.session.userId;
    db.getFriendsWannabes(id)
        .then((result) => {
            console.log("rezultz", result.rows);
            res.json(result.rows);
        })
        .catch((error) => {
            console.log("error in friends-wannabes: ", error);
        });
});

// app.delete("/delete/:id", (req, res) => {
//      let userId = req.session.userId;
//         db.deleteProfile(id)
//             .then(() => {
//                 delete req.session.user.id;
//                 req.session = null;
//             res.json({ delete: true });
//             })
//             .catch((err) => {
//                 console.log("error in delete req", err);
//             });
//     }
// });

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

server.listen(8080, function () {
    //app zamijeniti za server. (za socket) - ne treba mijenjati routes
    console.log("I'm listening.");
});

//all of the backend socket code comes below - var io (odozgo)

// io.on('connection', function(socket) {
//     console.log(`socket with the id ${socket.id} is now connected`);
// });

io.on("connection", function (socket) {
    console.log(`socket with the ${socket.id} is now connected`);

    if (!socket.request.session.userId) {
        return socket.disconnect(true);
    }

    const userId = socket.request.session.userId;

    db.getChatMsgs()
        .then((result) => {
            io.sockets.emit("chatMessages", result.rows);
        })
        .catch((error) => {
            console.log("error in gettenlastmsgs: ", error);
        });

    socket.on("newChatMsg", (newMsg) => {
        db.insertNewMsg(newMsg, userId)
            .then(() => {
                db.getMessenger(userId)
                    .then((response) => {
                        io.sockets.emit("chatMessage", response.rows);
                    })
                    .catch((error) =>
                        console.log("error in getMessenger: ", error)
                    );
            })
            .catch((error) => {
                console.log("error in insertnewMsg: ", error);
            });
    });
});
