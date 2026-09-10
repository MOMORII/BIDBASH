const express = require("express");

const auction = require("./controllers/auction");
const auth = require("./controllers/auth");
const seller = require("./controllers/seller");
const moderator = require("./controllers/moderator");

const {
    requireLogin,
    requireModerator
} = require("./middleware/auth");

const {
    requireAgeConfirmation
} = require("./middleware/ageGate");

const router = express.Router();

//renders the age confirmation page
router.get("/age-check", (req, res) => {
    res.render("age-check", {
        pageTitle: "Age Confirmation - BIDBASH"
    });
});

//records successful age confirmation
router.post("/age-check", (req, res) => {
    if (req.body.ageConfirmed !== "yes") {
        return res.status(400).render("age-check", {
            pageTitle: "Age Confirmation - BIDBASH",
            error: "You must confirm that you are aged 18 or over."
        });
    }

    req.session.ageConfirmed = true;

    res.redirect("/");
});

//protects normal bidbash pages behind the age confirmation
router.use(requireAgeConfirmation);

//renders the homepage
router.get("/", (req, res) => {
    res.render("index", {
        pageTitle: "BIDBASH"
    });
});

//renders the browse auctions page
router.get("/browse", (req, res) => {
    res.render("browse", {
        pageTitle: "Browse Auctions - BIDBASH"
    });
});

//renders the selected auction page
router.get("/auction/:id", auction.show);

//renders the login page
router.get("/login", auth.showLogin);

//handles login submissions
router.post("/login", auth.login);

//ends the active session
router.post("/logout", auth.logout);

//restricts seller tools to authenticated users
router.get(
    "/sell",
    requireLogin,
    seller.dashboard
);

//accepts authenticated bid requests
router.post(
    "/api/bids",
    requireLogin,
    auction.placeBid
);

//restricts moderation tools to moderators
router.get(
    "/moderation",
    requireModerator,
    moderator.dashboard
);

module.exports = router;