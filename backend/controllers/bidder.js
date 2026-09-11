const biddingService = require("../services/bidding");

//renders the user-specific my bids dashboard
function dashboard(req, res) {
    const groupedBids =
        biddingService.groupUserBids(req.params.id);

    res.render("bids", {
        pageTitle: "My Bids - BIDBASH",
        bids: groupedBids
    });
}

module.exports = {
    dashboard
};