const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const nocache = require("nocache");

// app
const app = express();

// view engine
app.set("view engine", "ejs");

// Middleware
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(nocache());

// Default Email and Password
const user = {
    email: "montyxgreen@gmail.com",
    password: "montyxgreen",
};

// Session Middleware
app.use(
    session({
        secret: "montyxgreen",
        resave: false,
        saveUninitialized: false,
    })
);

// Middleware to redirect authenticated users to /home
const sessionChecker = (req, res, next) => {
    if (req.session.user) {
        res.redirect("/home");
    } else {
        next();
    }
};

app.get("/", sessionChecker, (req, res) => {
    res.redirect("/login");
});

app.get("/login", sessionChecker, (req, res) => {
    res.render("login", { message: false });
});

app.post("/login", (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (user.email === email && user.password === password) {
        req.session.user = true;
        res.redirect("/home");
    } else if (user.email !== email) {
        res.render("login", { message: "User not found" });
    } else if (user.email === email && user.password !== password) {
        res.render("login", { message: "Invalid Password" });
    }
});

app.get("/home", (req, res) => {
    if (req.session.user) {
        res.render("home");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", (req, res) => {
    req.session.user = false;
    res.redirect("/login");
});

// 404 Page
app.use((req, res) => {
    res.status(404).render("404");
});

app.listen(3003, () => {
    console.log("Server is listening on port 3000");
});
