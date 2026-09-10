//represents an auction listing
class Listing {
    constructor({
        id,
        sellerId,
        categoryId,
        title,
        description,
        condition,
        brand = null,
        startingPrice,
        bidIncrement,
        deliveryInfo = null,
        returnInfo = null,
        status
    }) {
        this.id = id;
        this.sellerId = sellerId;
        this.categoryId = categoryId;
        this.title = title;
        this.description = description;
        this.condition = condition;
        this.brand = brand;
        this.startingPrice = startingPrice;
        this.bidIncrement = bidIncrement;
        this.deliveryInfo = deliveryInfo;
        this.returnInfo = returnInfo;
        this.status = status;
    }
}

module.exports = Listing;