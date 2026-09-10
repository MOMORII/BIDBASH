//represents delivery and fulfilment information
class Fulfilment {
    constructor({
        id,
        orderId,
        shippingAddress = null,
        trackingReference = null,
        dispatchedAt = null,
        completedAt = null,
        status
    }) {
        this.id = id;
        this.orderId = orderId;
        this.shippingAddress = shippingAddress;
        this.trackingReference = trackingReference;
        this.dispatchedAt = dispatchedAt;
        this.completedAt = completedAt;
        this.status = status;
    }
}

module.exports = Fulfilment;