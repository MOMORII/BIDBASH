//represents payment information linked to an order
class Payment {
    constructor({
        id,
        orderId,
        amount,
        paymentDate = null,
        status
    }) {
        this.id = id;
        this.orderId = orderId;
        this.amount = amount;
        this.paymentDate = paymentDate;
        this.status = status;
    }
}

module.exports = Payment;