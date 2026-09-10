//renders the temporary moderator area
function dashboard(req, res) {
    res.render("moderator/dashboard", {
        pageTitle: "Moderation Dashboard - BIDBASH"
    });
}

module.exports = {
    dashboard
};