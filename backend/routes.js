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

router.get(
    "/age-check",
    (req, res) => {
        res.render("age-check", {
            pageTitle:
                "Age Confirmation - BIDBASH"
        });
    }
);

//records successful age confirmation

router.post(
    "/age-check",
    (req, res) => {
        if (
            req.body.ageConfirmed !==
            "yes"
        ) {
            return res.status(400).render(
                "age-check",
                {
                    pageTitle:
                        "Age Confirmation - BIDBASH",
                    error:
                        "You must confirm that you are aged 18 or over."
                }
            );
        }

        req.session.ageConfirmed =
            true;

        res.redirect("/");
    }
);

//protects normal bidbash pages behind age confirmation

router.use(
    requireAgeConfirmation
);

//renders the homepage with temporary auction data

router.get("/", (req, res) => {
    if (
        req.session.user &&
        req.session.user.role ===
            "moderator"
    ) {
        return res.redirect(
            "/moderation"
        );
    }

    res.render("index", {
        pageTitle:
            "BIDBASH",
        featuredAuctions:
            auctionService.getFeatured(),
        endingSoonAuctions:
            auctionService.getEndingSoon()
    });
});

//renders filtered and sorted browse auction results

router.get(
    "/browse",
    (req, res) => {
        const sort =
            req.query.sort ||
            "default";

        const category =
            req.query.category ||
            "all";

        const search =
            req.query.search ||
            "";

        const auctions =
            auctionService.browse({
                sort,
                category,
                search
            });

        res.render("browse", {
            pageTitle:
                "Browse Auctions - BIDBASH",
            auctions,
            activeSort:
                sort,
            activeCategory:
                category,
            activeSearch:
                search
        });
    }
);

//renders the selected auction page

router.get(
    "/auction/:id",
    auction.show
);

//renders the login page

router.get(
    "/login",
    auth.showLogin
);

//handles login submissions

router.post(
    "/login",
    auth.login
);

//ends the active session

router.post(
    "/logout",
    auth.logout
);

//renders the registration page

router.get(
    "/register",
    auth.showRegister
);

//creates a registered user

router.post(
    "/register",
    auth.register
);

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

//validates authenticated listing submissions

router.post(
    "/listings/new",
    requireLogin,
    seller.create
);

//renders the user-specific my bids dashboard

router.get(
    "/users/:id/bids",
    requireLogin,
    requireOwnUser,
    bidder.dashboard
);

//places authenticated bids

router.post(
    "/api/bids",
    requireLogin,
    bidder.placeBid
);

//returns unread notifications

router.get(
    "/api/notifications",
    requireLogin,
    bidder.getNotifications
);

//marks notifications as read

router.post(
    "/api/notifications/:id/read",
    requireLogin,
    bidder.readNotification
);

//restricts moderation tools to moderators

router.get(
    "/moderation",
    requireModerator,
    moderator.dashboard
);

//handles moderator case decisions

router.post(
    "/moderation/:id/action",
    requireModerator,
    moderator.updateCase
);

//renders the help page

router.get(
    "/help",
    (req, res) => {
        res.render("help", {
            pageTitle:
                "Help | BIDBASH"
        });
    }
);

//renders the about page

router.get(
    "/about",
    (req, res) => {
        res.render("about", {
            pageTitle:
                "About Us | BIDBASH"
        });
    }
);

//renders the privacy page

router.get(
    "/privacy",
    (req, res) => {
        res.render("privacy", {
            pageTitle:
                "Privacy Policy | BIDBASH"
        });
    }
);

//renders the terms page

router.get(
    "/terms",
    (req, res) => {
        res.render("terms", {
            pageTitle:
                "Terms & Conditions | BIDBASH"
        });
    }
);

module.exports = router;