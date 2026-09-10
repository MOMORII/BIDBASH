//represents an order created after a successful auction
class Order {
    constructor({
        id,
        auctionId,
        buyerId,
        sellerId,
        finalAmount,
        createdAt,
        paymentDeadline,
        status
    }) {
        this.id = id;
        this.auctionId = auctionId;
        this.buyerId = buyerId;
        this.sellerId = sellerId;
        this.finalAmount = finalAmount;
        this.createdAt = createdAt;
        this.paymentDeadline = paymentDeadline;
        this.status = status;
    }
}

module.exports = Order;