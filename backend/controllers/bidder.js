//loads temporary bid data

const mockBids =
    require("../data/mockBids");

const biddingService =
    require("../services/bidding");

const notificationService =
    require("../services/notification");

//renders the user's bidding dashboard

function dashboard(req, res) {
    const userId =
        Number(req.params.id);

    const userBids =
        mockBids.filter(
            bid =>
                Number(bid.userId) ===
                userId
        );

    const bids = {
        active:
            userBids.filter(
                bid =>
                    bid.status ===
                    "active"
            ),

        successful:
            userBids.filter(
                bid =>
                    bid.status ===
                    "successful"
            ),

        history:
            userBids.filter(
                bid =>
                    bid.status ===
                    "history"
            )
    };

    res.render("bids", {
        pageTitle:
            "My Bids - BIDBASH",
        bids
    });
}

//places a bid

function placeBid(req, res) {
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
                req.body.amount
        });

    if (!result.success) {
        return res.status(400).json(
            result
        );
    }

    res.json(result);
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
        return res.sendStatus(401);
    }

    const notification =
        notificationService
            .markAsRead(
                req.params.id,
                req.session.user.id
            );

    if (!notification) {
        return res.sendStatus(404);
    }

    res.json({
        success: true
    });
}

module.exports = {
    dashboard,
    placeBid,
    getNotifications,
    readNotification
};