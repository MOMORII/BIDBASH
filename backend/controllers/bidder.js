//loads bidding services

const biddingService =
    require("../services/bidding");

const notificationService =
    require("../services/notification");

const orderService =
    require("../services/order");

//renders the user's bidding dashboard

function dashboard(
    req,
    res
) {
    const userId =
        Number(
            req.params.id
        );

    const bids =
        biddingService
            .getUserBids(
                userId
            );

    res.render("bids", {
        pageTitle:
            "My Bids - BIDBASH",

        bids
    });
}

//places a bid

function placeBid(
    req,
    res
) {
    if (!req.session.user) {
        return res.status(401).json({
            error:
                "You must be signed in to place a bid."
        });
    }

    const result =
        biddingService.placeBid({
            userId:
                req.session.user.id,

            auctionId:
                req.body.auctionId,

            amount:
                req.body.amount,

            expectedCurrentBid:
                req.body.expectedCurrentBid
        });

    if (!result.success) {
        return res.status(400).json(
            result
        );
    }

    res.json(
        result
    );
}

//returns unread notifications

function getNotifications(
    req,
    res
) {
    if (!req.session.user) {
        return res.status(401).json({
            notifications: []
        });
    }

    const notifications =
        notificationService
            .getUnreadNotifications(
                req.session.user.id
            );

    res.json({
        notifications
    });
}

//marks a notification as read

function readNotification(
    req,
    res
) {
    if (!req.session.user) {
        return res.sendStatus(
            401
        );
    }

    const notification =
        notificationService
            .markAsRead(
                req.params.id,
                req.session.user.id
            );

    if (!notification) {
        return res.sendStatus(
            404
        );
    }

    res.json({
        success: true
    });
}

//pays a won auction order

function payOrder(
    req,
    res
) {
    if (!req.session.user) {
        return res.status(401).json({
            error:
                "You must be signed in to pay for an order."
        });
    }

    const result =
        orderService.payOrder({
            orderId:
                req.params.id,

            buyerId:
                req.session.user.id
        });

    if (!result.success) {
        return res.status(400).json(
            result
        );
    }

    res.json(
        result
    );
}

module.exports = {
    dashboard,
    placeBid,
    getNotifications,
    readNotification,
    payOrder
};