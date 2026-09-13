//loads temporary bid and auction data

const mockBids =
    require("../data/mockBids");

const mockAuctions =
    require("../data/mockAuctions");

const notificationService =
    require("./notification");

//finds an auction by id

function getAuctionById(auctionId) {
    return mockAuctions.find(
        auction =>
            Number(auction.id) ===
            Number(auctionId)
    );
}

//finds the current highest bid

function getHighestBid(auctionId) {
    const auctionBids =
        mockBids.filter(
            bid =>
                Number(bid.auctionId) ===
                Number(auctionId)
        );

    if (!auctionBids.length) {
        return null;
    }

    return auctionBids.reduce(
        (highest, bid) => {
            return bid.amount >
                highest.amount
                ? bid
                : highest;
        }
    );
}

//validates and places a bid

function placeBid({
    userId,
    auctionId,
    amount
}) {
    const auction =
        getAuctionById(auctionId);

    if (!auction) {
        return {
            success: false,
            status: "not-found",
            message:
                "The auction could not be found."
        };
    }

    if (
        auction.status &&
        auction.status !== "active"
    ) {
        return {
            success: false,
            status: "ended",
            message:
                "This auction is no longer accepting bids."
        };
    }

    const numericAmount =
        Number(amount);

    if (
        !Number.isFinite(
            numericAmount
        ) ||
        numericAmount <= 0
    ) {
        return {
            success: false,
            status: "invalid",
            message:
                "Enter a valid bid amount."
        };
    }

    const currentHighestBid =
        getHighestBid(auctionId);

    const currentBid =
        currentHighestBid
            ? currentHighestBid.amount
            : Number(
                auction.currentBid || 0
            );

    const minimumBid =
        currentBid + 1;

    if (
        numericAmount <
        minimumBid
    ) {
        return {
            success: false,
            status: "too-low",
            message:
                `Your bid must be at least £${minimumBid.toFixed(2)}.`,
            currentBid,
            minimumBid
        };
    }

    const previousHighestBid =
        currentHighestBid;

    const newBid = {
        id:
            mockBids.length + 1,
        userId:
            Number(userId),
        auctionId:
            Number(auctionId),
        amount:
            numericAmount,
        createdAt:
            new Date(),
        status:
            "active"
    };

    mockBids.push(newBid);

    auction.currentBid =
        numericAmount;

    notificationService
        .createNotification({
            userId:
                Number(userId),
            type:
                "bid_accepted",
            title:
                "Bid Accepted",
            message:
                `Your £${numericAmount.toFixed(2)} bid on ${auction.title} was accepted.`,
            auctionId:
                Number(auctionId),
            orderId:
                null
        });

    if (
        previousHighestBid &&
        previousHighestBid.userId !==
            Number(userId)
    ) {
        notificationService
            .createNotification({
                userId:
                    previousHighestBid.userId,
                type:
                    "outbid",
                title:
                    "You've Been Outbid",
                message:
                    `A higher bid has been placed on ${auction.title}.`,
                auctionId:
                    Number(auctionId),
                orderId:
                    null
            });
    }

    return {
        success: true,
        status: "accepted",
        message:
            "Your bid has been accepted.",
        bid: newBid,
        auction: {
            currentBid:
                numericAmount,
            minimumBid:
                numericAmount + 1
        }
    };
}

module.exports = {
    placeBid,
    getHighestBid
};