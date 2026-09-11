//stores temporary seller listing data until sqlite is connected
const listings = [
    {
        id: 1,
        sellerId: 1,
        title: "Retro Handheld Console",
        currentBid: 85,
        bidCount: 8,
        timeRemaining: "2h 14m",
        status: "active"
    },

    {
        id: 2,
        sellerId: 1,
        title: "Vintage Camera",
        currentBid: 120,
        bidCount: 12,
        timeRemaining: "5h 40m",
        status: "active"
    },

    {
        id: 3,
        sellerId: 1,
        title: "Mechanical Keyboard",
        finalAmount: 96,
        buyer: "KeyHunter",
        fulfilmentStatus: "Awaiting Dispatch",
        status: "sold"
    },

    {
        id: 4,
        sellerId: 1,
        title: "Retro Game Collection",
        finalAmount: 72,
        outcome: "Sold",
        completedAt: "04 September 2026",
        status: "history"
    },

    {
        id: 5,
        sellerId: 1,
        title: "Vintage Desk Lamp",
        finalAmount: null,
        outcome: "Unsold",
        completedAt: "28 August 2026",
        status: "history"
    }
];

module.exports = listings;