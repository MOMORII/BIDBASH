const auctionService = require("../services/auction");
const bidService = require("../services/bid");

//renders the selected auction page
function show(req, res) {
    const auction = auctionService.getById(req.params.id);

    //rejects unknown auction ids
    if (!auction) {
        return res.status(404).send("Auction not found.");
    }

    res.render("auction", {
        pageTitle: `${auction.title} - BIDBASH`,
        auction
    });
}

//handles authenticated bid requests
function placeBid(req, res) {
    const auction = auctionService.getById(req.body.auctionId);

    //rejects bids for unknown auctions
    if (!auction) {
        return res.status(404).json({
            error: "Auction not found."
        });
    }

    const result = bidService.validateBid(
        auction,
        req.body.amount
    );

    //rejects invalid bid amounts
    if (!result.valid) {
        return res.status(400).json({
            error: result.message
        });
    }

    res.json({
        message: "Bid accepted for development testing.",
        amount: result.amount
    });
}

module.exports = {
    show,
    placeBid
};