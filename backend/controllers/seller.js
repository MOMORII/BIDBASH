const listingService = require("../services/listing");

//redirects the seller shortcut to the current user's dashboard
function redirectToDashboard(req, res) {
    res.redirect(
        `/users/${req.session.user.id}/listings`
    );
}

//renders the seller-specific my listings dashboard
function dashboard(req, res) {
    const groupedListings =
        listingService.groupSellerListings(req.params.id);

    res.render("listings", {
        pageTitle: "My Listings - BIDBASH",
        listings: groupedListings
    });
}

module.exports = {
    redirectToDashboard,
    dashboard
};