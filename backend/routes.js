const express = require("express");

const auction = require("./controllers/auction");
const auth = require("./controllers/auth");
const seller = require("./controllers/seller");
const bidder = require("./controllers/bidder");
const moderator = require("./controllers/moderator");

const auctionService = require("./services/auction");

const {
    requireLogin,
    requireModerator,
    requireOwnUser
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

//protects normal bidbash pages behind age confirmation
router.use(requireAgeConfirmation);

//renders the homepage with temporary auction data
router.get("/", (req, res) => {
    res.render("index", {
        pageTitle: "BIDBASH",
        featuredAuctions: auctionService.getFeatured(),
        endingSoonAuctions: auctionService.getEndingSoon()
    });
});

//renders filtered and sorted browse auction results
router.get("/browse", (req, res) => {
    const sort = req.query.sort || "default";
    const category = req.query.category || "all";

    const auctions = auctionService.browse({
        sort,
        category
    });

    res.render("browse", {
        pageTitle: "Browse Auctions - BIDBASH",
        auctions,
        activeSort: sort,
        activeCategory: category
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

//renders the temporary registration page
router.get("/register", (req, res) => {
    res.render("register", {
        pageTitle: "Sign Up - BIDBASH"
    });
});

//prevents registration storage before sqlite is connected
router.post("/register", (req, res) => {
    res.render("register", {
        pageTitle: "Sign Up - BIDBASH",
        message: "Registration storage will be enabled when the BIDBASH database is connected."
    });
});

//redirects authenticated sellers to their own dashboard
router.get(
    "/sell",
    requireLogin,
    seller.redirectToDashboard
);

//renders the user-specific my listings dashboard
router.get(
    "/users/:id/listings",
    requireLogin,
    requireOwnUser,
    seller.dashboard
);

//renders the user-specific my bids dashboard
router.get(
    "/users/:id/bids",
    requireLogin,
    requireOwnUser,
    bidder.dashboard
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