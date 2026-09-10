const auctions = require("../data/mockAuctions");

//returns one auction using its id
function getById(id) {
    return auctions[id] || null;
}

//returns all temporary auctions
function getAll() {
    return Object.values(auctions);
}

module.exports = {
    getById,
    getAll
};