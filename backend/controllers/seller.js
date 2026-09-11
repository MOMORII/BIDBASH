const listingService = require("../services/listing");

//redirects the seller shortcut to the current user's dashboard
function redirectToDashboard(req, res) {
    res.redirect(
        `/users/${req.session.user.id}/listings`
    );
}

//renders the user-specific my listings dashboard
function dashboard(req, res) {
    const groupedListings =
        listingService.groupSellerListings(req.params.id);

    res.render("listings", {
        pageTitle: "My Listings - BIDBASH",
        listings: groupedListings,
        openCreateListing: false,
        listingError: null,
        listingMessage: null
    });
}

//validates temporary listing input before database storage exists
function create(req, res) {
    const groupedListings =
        listingService.groupSellerListings(req.session.user.id);

    const {
        title,
        category,
        condition,
        description,
        startingPrice,
        bidIncrement
    } = req.body;

    //rejects incomplete listing submissions
    if (
        !title ||
        !category ||
        !condition ||
        !description ||
        !startingPrice ||
        !bidIncrement
    ) {
        return res.status(400).render("listings", {
            pageTitle: "My Listings - BIDBASH",
            listings: groupedListings,
            openCreateListing: true,
            listingError: "Please complete all required listing fields.",
            listingMessage: null
        });
    }

    //confirms validation without saving before sqlite exists
    res.render("listings", {
        pageTitle: "My Listings - BIDBASH",
        listings: groupedListings,
        openCreateListing: true,
        listingError: null,
        listingMessage:
            "Listing details are valid. Database storage will be enabled when SQLite is connected."
    });
}

module.exports = {
    redirectToDashboard,
    dashboard,
    create
};