const express = require("express");
const app = express();
const db = require("./utils/db");
const compression = require("compression");
const { hash, compare } = require("./utils/bcrypt.js");
const cookieSession = require("cookie-session");
const csurf = require("csurf");
const ses = require("./ses");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3");
const conf = require("./config");

///// socket.io bp
const server = require("http").Server(app);
const io = require("socket.io")(server, { origins: "localhost:8080" });

///// file upload boilerplate ///////
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
///////////////////////////////////////

let sessionSecret;
if (process.env.SESSION_SECRET) {
    sessionSecret = process.env.SESSION_SECRET;
} else {
    sessionSecret = require("./secrets").SESSION_SECRET;
}

app.use(compression());

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

app.use(express.json());

// old cookie mw before socket.io
// app.use(
//     cookieSession({
//         secret: sessionSecret,
//         maxAge: 1000 * 60 * 60 * 24 * 14,
//     })
// );

const cookieSessionMiddleware = cookieSession({
    secret: sessionSecret,
    maxAge: 1000 * 60 * 60 * 24 * 14,
});

app.use(cookieSessionMiddleware);
io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

app.use(csurf());

app.use(express.static("./public"));

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

app.get("/welcome", function (req, res) {
    if (!req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/");
    }
});

app.post("/password/reset/start", (req, res) => {
    db.findUserByEmail(req.body.email)
        .then((result) => {
            if (result.rows[0] != undefined) {
                console.log("email exists");
                const resetCode = cryptoRandomString({
                    length: 6,
                });
                db.insertResetCode(req.body.email, resetCode)
                    .then((results) => {
                        ses.sendEmail(
                            "twilight.candle+funkychicken@spicedling.email",
                            "Password restoration",
                            "Your super secret code to restore your password is: " +
                                resetCode
                        )
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((e) => {
                                console.log("error sending email", e);
                                res.json({ success: false });
                            });
                    })
                    .catch((e) => {
                        console.log("error adding code to db", e);
                        res.json({ success: false });
                    });
            } else {
                console.log("email doesnt exist");
                res.json({ success: false });
            }
        })
        .catch((e) => {
            console.log("error in findUserByEmail", e);
        });
});

app.post("/password/reset/verify", (req, res) => {
    hash(req.body.newPass)
        .then((hashedPw) => {
            db.getResetCode(req.body.email)
                .then((result) => {
                    if (result.rows[0].code == req.body.code) {
                        db.updatePw(req.body.email, hashedPw)
                            .then(() => {
                                console.log("password updated!");
                                res.json({ success: true });
                            })
                            .catch((e) => {
                                console.log("error updating password", e);
                            });
                    } else {
                        console.log("code not correct or expired");
                        res.json({ success: false });
                    }
                })
                .catch((e) => {
                    console.log("error in getResetCode", e);
                });
        })
        .catch((e) => {
            console.log("error hashing the new pass", e);
        });
});

app.get("/api/user/:id", (req, res) => {
    if (req.params.id == req.session.userId) {
        res.json({
            redirect: true,
        });
    } else {
        db.getUserById(req.params.id)
            .then(({ rows }) => {
                res.json(rows[0] || res.json({ redirect: true }));
            })
            .catch((e) => {
                console.log("error in getuserbyid", e);
                res.json({ redirect: true });
            });
    }
});

app.get("/user", (req, res) => {
    db.getUserById(req.session.userId)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((e) => {
            console.log("error in getuserbyid", e);
            res.json({ success: false });
        });
});

app.post("/search/users", (req, res) => {
    if (req.body.input != "") {
        db.getUsersByInput(req.body.input)
            .then((result) => {
                res.json(result.rows);
            })
            .catch((e) => {
                console.log("error in getlastusers", e);
            });
    }
});

app.get("/users", (req, res) => {
    db.getLastUsers()
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("error in getlastusers", e);
        });
});

app.get("/initial-friendship-status/:otherUserId", (req, res) => {
    db.getInitialFriendshipStatus(req.session.userId, req.params.otherUserId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("error in get fs status", e);
        });
});

app.post("/make-friend-request/:otherUserId", (req, res) => {
    db.makeFriendRequest(req.session.userId, req.params.otherUserId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("error in make f req", e);
        });
});

app.post("/add-friendship/:otherUserId", (req, res) => {
    db.addFriendship(req.session.userId, req.params.otherUserId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("error in add f", e);
        });
});

app.post("/end-friendship/:otherUserId", (req, res) => {
    db.endFriendship(req.session.userId, req.params.otherUserId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("error in end f", e);
        });
});

app.post(
    "/upload/profile-pic",
    uploader.single("file"),
    s3.upload,
    (req, res) => {
        let imageUrl = conf.s3Url + req.file.filename;
        db.addProfilePic(req.session.userId, imageUrl)
            .then((image) => {
                res.json(image);
            })
            .catch((err) => {
                console.log("error adding prof pic", err);
                res.sendStatus(500);
            });
    }
);

app.post("/edit/bio", (req, res) => {
    db.updateBio(req.session.userId, req.body.newBio)
        .then((result) => {
            res.json(result.rows[0].bio);
        })
        .catch((e) => {
            console.log("error in updatebio", e);
        });
});

app.post("/register", function (req, res) {
    hash(req.body.pass)
        .then((hashedPw) => {
            db.insertNewUser(
                req.body.first,
                req.body.last,
                req.body.email,
                hashedPw
            )
                .then((result) => {
                    // set cookie
                    req.session.userId = result.rows[0].id;
                    result.success = true;
                    res.json(result);
                })
                .catch((e) => {
                    console.log("error in insertNewUser", e);
                    res.json({
                        success: false,
                    });
                });
        })
        .catch((e) => {
            console.log("error hashing the password", e);
            res.json({ success: false });
        });
});

app.post("/login", function (req, res) {
    db.getHashedPw(req.body.email)
        .then((result) => {
            compare(req.body.pass, result.rows[0].pass)
                .then((match) => {
                    if (match) {
                        // set cookie
                        req.session.userId = result.rows[0].id;
                        result.success = true;
                        res.json(result);
                    } else {
                        console.log("pass is incorrect");
                        res.json({ success: false });
                    }
                })
                .catch((e) => {
                    console.log("error comparing passwords", e);
                    res.json({ success: false });
                });
        })
        .catch((e) => {
            console.log("error getting hashed pw", e);
            res.json({ success: false });
        });
});

app.get("/friends-wannabes", (req, res) => {
    db.getFriendsWannabes(req.session.userId)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((e) => {
            console.log("error in get friends wannabes", e);
        });
});

app.get("/chat/:id", (req, res, next) => {
    if (req.params.id == req.session.userId) {
        res.redirect("/");
    } else {
        next();
    }
});

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/welcome");
});

app.get("*", function (req, res) {
    if (req.session.userId) {
        res.sendFile(__dirname + "/index.html");
    } else {
        res.redirect("/welcome");
    }
});

// make it listen to the socket.io server, it checks it and sends it to app if it is not relevant to socket.io
server.listen(8080, function () {
    console.log("I'm listening.");
});

let onlineUsers = {};
let pathnames = {};

io.on("connection", function (socket) {
    console.log(`A socket with id ${socket.id} just connected`);
    if (!socket.request.session.userId) {
        console.log(`A socket with id ${socket.id} is about to disconnect`);
        return socket.disconnect(true);
    }

    socket.on("disconnect", () => {
        delete onlineUsers[socket.id];
        delete pathname[socket.id];
        if (!Object.values(onlineUsers).find((id) => id == userId)) {
            io.emit("userLeft", userId);
        }
    });

    const path = new URL(socket.handshake.headers.referer);

    const pathname = path.pathname;

    const userId = socket.request.session.userId;

    pathnames[socket.id] = [pathname, userId];

    // add connected user to onlineusers list
    onlineUsers[socket.id] = userId;

    //create user id array
    let userIdArray = [];
    for (let prop in onlineUsers) {
        userIdArray.push(onlineUsers[prop]);
    }

    // remove duplicates from array
    let uniq = (arr) => [...new Set(arr)];
    let cleanedUserIdArray = uniq(userIdArray);

    db.getUsersFromArray(cleanedUserIdArray)
        .then((result) => {
            socket.emit("onlineUsersArray", result.rows);
        })
        .catch((e) => {
            console.log("error in getusersfromaaray", e);
        });

    db.getUserById(userId)
        .then((result) => {
            // check if id exists
            if (cleanedUserIdArray.find((id) => id == userId)) {
                socket.broadcast.emit("userJoined", result.rows[0]);
            } else {
                return;
            }
        })
        .catch((e) => {
            console.log("error getting used by id", e);
        });

    socket.on("openPrivChat", (otherId) => {
        db.getPrivMsgs(userId, otherId)
            .then((result) => {
                socket.emit("privMsgs", result.rows);
            })
            .catch((e) => {
                console.log("error on get priv msgs", e);
            });
    });

    socket.on("newPrivMsg", (text, otherId) => {
        db.insertPrivMsg(userId, otherId, text)
            .then(() => {
                db.getPrivMsgs(userId, otherId)
                    .then((result) => {
                        socket.emit("privMsgs", result.rows);
                        // find receiver socket id(s)
                        for (let prop in pathnames) {
                            if (
                                pathnames[prop][0] == `/chat/${userId}` &&
                                pathnames[prop][1] == otherId
                            ) {
                                io.to(prop).emit("privMsgs", result.rows);
                            }
                        }
                    })
                    .catch((e) => {
                        console.log("error on get priv msgs", e);
                    });
            })
            .catch((e) => {
                console.log("error on insert priv msgs", e);
            });
    });

    db.getLastTenMessages()
        .then((result) => {
            // emit
            let orderedMsgs = result.rows.reverse();
            io.sockets.emit("chatMsgs", orderedMsgs);
        })
        .catch((e) => {
            console.log("error getting last msgs", e);
        });

    socket.on("newMsg", (newMsg) => {
        db.insertNewMsg(userId, newMsg)
            .then(() => {
                db.getLastTenMessages()
                    .then((result) => {
                        let orderedMsgs = result.rows.reverse();
                        io.sockets.emit("chatMsgs", orderedMsgs);
                    })
                    .catch((e) => {
                        console.log("error getting last msgs", e);
                    });
            })
            .catch((e) => {
                console.log("error inserting new msg", e);
            });
    });
});
