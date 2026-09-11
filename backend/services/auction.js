const auctions = require("../data/mockAuctions");

//returns one auction using its id
function getById(id) {
    return auctions[id] || null;
}

//returns all temporary auctions
function getAll() {
    return Object.values(auctions);
}

//returns auctions selected for the featured section
function getFeatured() {
    return getAll().filter(
        auction => auction.featured
    );
}

//returns auctions ordered by the shortest remaining time
function getEndingSoon() {
    return getAll()
        .slice()
        .sort(
            (first, second) =>
                first.minutesRemaining - second.minutesRemaining
        );
}

//filters and sorts auctions using browse query options
function browse({
    sort = "default",
    category = "all"
} = {}) {
    let results = getAll();

    //filters auctions by category
    if (category !== "all") {
        results = results.filter(
            auction => auction.category === category
        );
    }

    //sorts featured auctions before non-featured auctions
    if (sort === "featured") {
        results.sort((first, second) => {
            if (first.featured === second.featured) {
                return second.createdOrder - first.createdOrder;
            }

            return Number(second.featured) - Number(first.featured);
        });
    }

    //sorts auctions by shortest remaining time
    if (sort === "ending-soon") {
        results.sort(
            (first, second) =>
                first.minutesRemaining - second.minutesRemaining
        );
    }

    //sorts auctions by newest temporary listing order
    if (sort === "newest") {
        results.sort(
            (first, second) =>
                second.createdOrder - first.createdOrder
        );
    }

    //sorts auctions by lowest current bid
    if (sort === "price-low") {
        results.sort(
            (first, second) =>
                first.currentBid - second.currentBid
        );
    }

    //sorts auctions by highest current bid
    if (sort === "price-high") {
        results.sort(
            (first, second) =>
                second.currentBid - first.currentBid
        );
    }

    return results;
}

module.exports = {
    getById,
    getAll,
    getFeatured,
    getEndingSoon,
    browse
};