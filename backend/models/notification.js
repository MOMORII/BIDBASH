//represents shared notification information
class Notification {
    constructor({
        id,
        userId,
        message,
        type,
        createdAt,
        isRead = false
    }) {
        this.id = id;
        this.userId = userId;
        this.message = message;
        this.type = type;
        this.createdAt = createdAt;
        this.isRead = isRead;
    }
}

//represents bidding-related notifications
class BidNotification extends Notification {
    constructor(data) {
        super({
            ...data,
            type: "bid"
        });
    }
}

//represents order-related notifications
class OrderNotification extends Notification {
    constructor(data) {
        super({
            ...data,
            type: "order"
        });
    }
}

//represents moderation-related notifications
class ModerationNotification extends Notification {
    constructor(data) {
        super({
            ...data,
            type: "moderation"
        });
    }
}

module.exports = {
    Notification,
    BidNotification,
    OrderNotification,
    ModerationNotification
};