//represents an individual auction bid
class Bid {
    constructor({
        id,
        auctionId,
        bidderId,
        amount,
        placedAt,
        status
    }) {
        this.id = id;
        this.auctionId = auctionId;
        this.bidderId = bidderId;
        this.amount = amount;
        this.placedAt = placedAt;
        this.status = status;
    }
}

module.exports = Bid;