const bids = require("../data/mockBids");

//returns bidding activity belonging to one user
function getByUserId(userId) {
    return bids.filter(
        bid => bid.userId === Number(userId)
    );
}

//separates bidding activity into dashboard sections
function groupUserBids(userId) {
    const userBids = getByUserId(userId);

    return {
        active: userBids.filter(
            bid => bid.status === "active"
        ),

        successful: userBids.filter(
            bid => bid.status === "successful"
        ),

        history: userBids.filter(
            bid => bid.status === "history"
        )
    };
}

module.exports = {
    getByUserId,
    groupUserBids
};