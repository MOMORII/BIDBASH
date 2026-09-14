const express =
    require("express");

const multer =
    require("multer");

const path =
    require("path");

const auction =
    require("./controllers/auction");

const auth =
    require("./controllers/auth");

const seller =
    require("./controllers/seller");

const bidder =
    require("./controllers/bidder");

const moderator =
    require("./controllers/moderator");

const auctionService =
    require("./services/auction");

const {
    requireLogin,
    requireModerator,
    requireOwnUser
} = require("./middleware/auth");

const {
    requireAgeConfirmation
} = require("./middleware/ageGate");

const router =
    express.Router();

//stores uploaded listing images

const listingImageStorage =
    multer.diskStorage({
        destination: (
            req,
            file,
            callback
        ) => {
            callback(
                null,
                path.join(
                    __dirname,
                    "../frontend/static/uploads"
                )
            );
        },

        filename: (
            req,
            file,
            callback
        ) => {
            const extension =
                path.extname(
                    file.originalname
                )
                    .toLowerCase();

            const filename =
                `listing-${Date.now()}-${Math.round(
                    Math.random() *
                    1000000
                )}${extension}`;

            callback(
                null,
                filename
            );
        }
    });

//validates uploaded listing images

function listingImageFilter(
    req,
    file,
    callback
) {
    const allowedExtensions = [
        ".jpg",
        ".jpeg",
        ".png",
        ".webp"
    ];

    const allowedMimeTypes = [
        "image/jpeg",
        "image/png",
        "image/webp"
    ];

    const extension =
        path.extname(
            file.originalname
        )
            .toLowerCase();

    if (
        !allowedExtensions.includes(
            extension
        ) ||
        !allowedMimeTypes.includes(
            file.mimetype
        )
    ) {
        return callback(
            new Error(
                "Only JPG, JPEG, PNG and WEBP images are allowed."
            )
        );
    }

    callback(
        null,
        true
    );
}

//handles listing image uploads

const uploadListingImage =
    multer({
        storage:
            listingImageStorage,

        fileFilter:
            listingImageFilter,

        limits: {
            fileSize:
                5 *
                1024 *
                1024
        }
    });

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

//renders the homepage

router.get(
    "/",
    (req, res) => {
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
                auctionService
                    .getFeatured(),

            endingSoonAuctions:
                auctionService
                    .getEndingSoon()
        });
    }
);

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

//creates authenticated listings

router.post(
    "/listings/new",
    requireLogin,
    uploadListingImage.single(
        "listingImage"
    ),
    seller.create
);

//updates active seller listings

router.post(
    "/api/listings/:id/edit",
    requireLogin,
    uploadListingImage.single(
        "listingImage"
    ),
    seller.updateListing
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

//pays a won auction order

router.post(
    "/api/orders/:id/pay",
    requireLogin,
    bidder.payOrder
);

//dispatches a paid seller order

router.post(
    "/api/orders/:id/dispatch",
    requireLogin,
    seller.dispatchOrder
);

//confirms delivery of a dispatched order

router.post(
    "/api/orders/:id/complete",
    requireLogin,
    bidder.completeOrder
);

//reports a listing for moderator review

router.post(
    "/api/listings/:id/report",
    requireLogin,
    auction.reportListing
);

module.exports =
    router;