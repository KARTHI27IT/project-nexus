const express = require("express");
const userController = require("../controller/users");
const router = express.Router();

router.get("/", userController.isLogged, (req, res) => {
    if (req.user) {
        res.render("home", { user: req.user });
    } else {
        console.log("User not authenticated, redirecting to home");
        res.render("home");
    }
});

router.get("/login", (req, res) => {
    res.render("login");
});

router.get("/signup",userController.isLogged, (req, res) => {
    res.render("signup")
});

router.get("/profile", userController.isLogged , (req, res) => {
    if (req.user) {
        res.render("profile", { user: req.user });
    } else {
        console.log("User not authenticated, redirecting to home");
        res.redirect("/");
    }
});

module.exports = router;
