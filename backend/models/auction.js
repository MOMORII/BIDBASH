//represents an auction linked to a listing
class Auction {
    constructor({
        id,
        listingId,
        startTime,
        endTime,
        currentHighestBid = null,
        status
    }) {
        this.id = id;
        this.listingId = listingId;
        this.startTime = startTime;
        this.endTime = endTime;
        this.currentHighestBid = currentHighestBid;
        this.status = status;
    }
}

module.exports = Auction;