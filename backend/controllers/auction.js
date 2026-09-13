//loads auction services

const auctionService =
    require("../services/auction");

//renders an auction page

function show(req, res) {
    const auction =
        auctionService.getById(
            req.params.id
        );

    if (!auction) {
        return res.status(404).send(
            "Auction not found."
        );
    }

    res.render("auction", {
        pageTitle:
            `${auction.title} - BIDBASH`,
        auction
    });
}

module.exports = {
    show
};