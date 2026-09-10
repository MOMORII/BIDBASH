//stores temporary auction data until sqlite is connected
const auctions = {
    1: {
        id: 1,
        title: "Retro Handheld Console",
        category: "Electronics",
        condition: "Used - Good",
        brand: "Nintendo",
        seller: "PixelVault",
        description:
            "A well-kept retro handheld console with light cosmetic wear.",
        currentBid: 85,
        minimumBid: 90,
        timeRemaining: "2h 14m",
        bidCount: 8,
        activeBidders: 4
    },

    2: {
        id: 2,
        title: "Vintage Camera",
        category: "Collectibles",
        condition: "Used - Good",
        brand: "Canon",
        seller: "LensMarket",
        description:
            "A vintage camera in working condition with minor cosmetic wear.",
        currentBid: 120,
        minimumBid: 125,
        timeRemaining: "5h 40m",
        bidCount: 12,
        activeBidders: 6
    },

    3: {
        id: 3,
        title: "Mechanical Keyboard",
        category: "Electronics",
        condition: "Used - Very Good",
        brand: "Keychron",
        seller: "KeyLab",
        description:
            "A mechanical keyboard with tactile switches and minimal wear.",
        currentBid: 62,
        minimumBid: 67,
        timeRemaining: "1d 3h",
        bidCount: 5,
        activeBidders: 3
    },

    4: {
        id: 4,
        title: "Collectible Figure",
        category: "Collectibles",
        condition: "Used - Good",
        brand: "Unknown",
        seller: "RetroShelf",
        description:
            "A collectible display figure in good condition.",
        currentBid: 44,
        minimumBid: 49,
        timeRemaining: "18m",
        bidCount: 16,
        activeBidders: 7
    },

    5: {
        id: 5,
        title: "Wireless Headphones",
        category: "Electronics",
        condition: "Used - Very Good",
        brand: "Sony",
        seller: "SoundHub",
        description:
            "Wireless headphones with light cosmetic wear and working controls.",
        currentBid: 71,
        minimumBid: 76,
        timeRemaining: "29m",
        bidCount: 6,
        activeBidders: 4
    }
};

module.exports = auctions;