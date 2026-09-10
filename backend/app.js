const session = require("express-session");
const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

// i am importing the authentication middleware used to protect routes
const {
    requireLogin,
    requireModerator
} = require("./middleware/auth");

// tells express where the pug templates are stored
app.set(
    "views",
    path.join(__dirname, "../frontend/views")
);

// tells express to use pug as the template engine for frontend pages
app.set("view engine", "pug");

// exposes frontend assets such as css, javascript and images
app.use(
    express.static(
        path.join(__dirname, "../frontend/static")
    )
);

// i am allowing express to read submitted form data
app.use(express.urlencoded({ extended: false }));

// i am allowing express to read json request bodies
app.use(express.json());

// i am creating temporary login sessions during development
app.use(
    session({
        secret: "bidbash-development-secret",
        resave: false,
        saveUninitialized: false,
        cookie: {
            httpOnly: true
        }
    })
);
// i am using temporary users until sqlite authentication is implemented
const users = {
    user: {
        username: "user",
        password: "test123",
        role: "user"
    },

    moderator: {
        username: "moderator",
        password: "mod123",
        role: "moderator"
    }
};

// renders the bidbash homepage, so it can display on the webpages
app.get("/", (req, res) => {
    res.render("index", {
        pageTitle: "BIDBASH"
    });
});

// this starts the local development server
app.listen(PORT, () => {
    console.log(
        `BIDBASH is running at http://localhost:${PORT}`
    );
});

// renders the browse auctions page
app.get("/browse", (req, res) => {
    res.render("browse", {
        pageTitle: "Browse Auctions - BIDBASH"
    });
});

// renders the auction details page
app.get("/auction/:id", (req, res) => {
    const auction = auctions[req.params.id];

    // i am returning a not found response when the auction id does not exist
    if (!auction) {
        return res.status(404).send("Auction not found.");
    }

    res.render("auction", {
        pageTitle: `${auction.title} - BIDBASH`,
        auction: auction
    });
});

// i am storing temporary auction data before connecting sqlite
const auctions = {
    1: {
        title: "Retro Handheld Console",
        category: "Electronics",
        condition: "Used - Good",
        brand: "Nintendo",
        seller: "PixelVault",
        description: "A well-kept retro handheld console with light cosmetic wear.",
        currentBid: "£85.00",
        minimumBid: "£90.00",
        timeRemaining: "2h 14m",
        bidCount: 8,
        activeBidders: 4
    },

    2: {
        title: "Vintage Camera",
        category: "Collectibles",
        condition: "Used - Good",
        brand: "Canon",
        seller: "LensMarket",
        description: "A vintage camera in working condition with minor cosmetic wear.",
        currentBid: "£120.00",
        minimumBid: "£125.00",
        timeRemaining: "5h 40m",
        bidCount: 12,
        activeBidders: 6
    },

    3: {
        title: "Mechanical Keyboard",
        category: "Electronics",
        condition: "Used - Very Good",
        brand: "Keychron",
        seller: "KeyLab",
        description: "A mechanical keyboard with tactile switches and minimal wear.",
        currentBid: "£62.00",
        minimumBid: "£67.00",
        timeRemaining: "1d 3h",
        bidCount: 5,
        activeBidders: 3
    },

    4: {
        title: "Collectible Figure",
        category: "Collectibles",
        condition: "Used - Good",
        brand: "Unknown",
        seller: "RetroShelf",
        description: "A collectible display figure in good condition.",
        currentBid: "£44.00",
        minimumBid: "£49.00",
        timeRemaining: "18m",
        bidCount: 16,
        activeBidders: 7
    },

    5: {
        title: "Wireless Headphones",
        category: "Electronics",
        condition: "Used - Very Good",
        brand: "Sony",
        seller: "SoundHub",
        description: "Wireless headphones with light cosmetic wear and working controls.",
        currentBid: "£71.00",
        minimumBid: "£76.00",
        timeRemaining: "29m",
        bidCount: 6,
        activeBidders: 4
    }
};

// i am restricting the seller page to authenticated users
app.get("/sell", requireLogin, (req, res) => {
    res.send(
        `Seller page accessible. Logged in as ${req.session.user.username}.`
    );
});

// i am restricting moderation tools to moderator accounts
app.get("/moderation", requireModerator, (req, res) => {
    res.send(
        `Moderation dashboard accessible. Logged in as ${req.session.user.username}.`
    );
});

// renders a temporary login page route
// i am displaying the login form
app.get("/login", (req, res) => {
    res.render("login", {
        pageTitle: "Login - BIDBASH"
    });
});

// i am checking whether the current visitor may submit a bid
app.post("/api/bids", requireLogin, (req, res) => {
    res.json({
        message: "Authenticated bid request accepted for testing."
    });
});

// i am checking submitted login details against temporary users
app.post("/login", (req, res) => {
    const { username, password } = req.body;
    const user = users[username];

    // i am rejecting login details that do not match a development account
    if (!user || user.password !== password) {
        return res.status(401).render("login", {
            pageTitle: "Login - BIDBASH",
            error: "Incorrect username or password."
        });
    }

    // i am storing only the session information needed for access control
    req.session.user = {
        username: user.username,
        role: user.role
    };

    res.redirect("/");
});

// i am ending the authenticated user session
app.post("/logout", (req, res) => {
    req.session.destroy(() => {
        res.redirect("/");
    });
});