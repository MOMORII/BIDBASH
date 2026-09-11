//stores temporary bidding data until sqlite is connected
const bids = [
    {
        id: 1,
        userId: 1,
        auctionId: 1,
        title: "Retro Handheld Console",
        userBid: 90,
        currentBid: 90,
        timeRemaining: "2h 14m",
        bidStatus: "winning",
        status: "active"
    },

    {
        id: 2,
        userId: 1,
        auctionId: 2,
        title: "Vintage Camera",
        userBid: 115,
        currentBid: 120,
        timeRemaining: "5h 40m",
        bidStatus: "outbid",
        status: "active"
    },

    {
        id: 3,
        userId: 1,
        auctionId: 3,
        title: "Mechanical Keyboard",
        finalAmount: 96,
        paymentStatus: "Paid",
        fulfilmentStatus: "Awaiting Dispatch",
        status: "successful"
    },

    {
        id: 4,
        userId: 1,
        auctionId: 4,
        title: "Collectible Figure",
        latestBid: 49,
        finalBid: 58,
        outcome: "Lost",
        completedAt: "06 September 2026",
        status: "history"
    },

    {
        id: 5,
        userId: 1,
        auctionId: 5,
        title: "Wireless Headphones",
        latestBid: 76,
        finalBid: 76,
        outcome: "Won",
        completedAt: "02 September 2026",
        status: "history"
    }
];

module.exports = bids;