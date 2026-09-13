//loads auction lifecycle services

const auctionLifecycleService =
    require("../services/auctionLifecycle");

//processes expired auctions before requests continue

function processExpiredAuctions(
    req,
    res,
    next
) {
    try {
        auctionLifecycleService
            .processExpiredAuctions();

        next();
    } catch (error) {
        console.error(
            "Failed to process expired auctions:",
            error
        );

        next();
    }
}

module.exports = {
    processExpiredAuctions
};