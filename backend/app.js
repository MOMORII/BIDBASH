const express = require("express");
const path = require("path");

const app = express();
const PORT = 3000;

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