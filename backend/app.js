const express = require("express");
const path = require("path");
const session = require("express-session");

const routes = require("./routes");

const app = express();
const PORT = 3000;

const {
    processExpiredAuctions
} = require("./middleware/auctionLifecycle");

//configures pug templates
app.set(
    "views",
    path.join(__dirname, "../frontend/views")
);

app.set("view engine", "pug");

//exposes static frontend assets
app.use(
    express.static(
        path.join(__dirname, "../frontend/static")
    )
);

//reads submitted form data
app.use(express.urlencoded({ extended: false }));

//reads json request bodies
app.use(express.json());

//creates temporary development sessions
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

//makes session data available to pug templates
app.use((req, res, next) => {
    res.locals.user = req.session.user || null;
    res.locals.ageConfirmed = req.session.ageConfirmed || false;

    next();
});

app.use(
    processExpiredAuctions
);

//registers all bidbash routes
app.use("/", routes);

//starts the development server
app.listen(PORT, () => {
    console.log(
        `BIDBASH is running at http://localhost:${PORT}`
    );
});