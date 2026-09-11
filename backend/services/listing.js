const listings = require("../data/mockListings");

//returns all temporary listings belonging to one seller
function getBySellerId(sellerId) {
    return listings.filter(
        listing => listing.sellerId === Number(sellerId)
    );
}

//separates seller listings into dashboard sections
function groupSellerListings(sellerId) {
    const sellerListings = getBySellerId(sellerId);

    return {
        active: sellerListings.filter(
            listing => listing.status === "active"
        ),

        successful: sellerListings.filter(
            listing => listing.status === "sold"
        ),

        history: sellerListings.filter(
            listing => listing.status === "history"
        )
    };
}

module.exports = {
    getBySellerId,
    groupSellerListings
};