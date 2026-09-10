//validates a bid against basic auction requirements
function validateBid(auction, amount) {
    const numericAmount = Number(amount);

    //rejects invalid numeric input
    if (!Number.isFinite(numericAmount)) {
        return {
            valid: false,
            message: "A valid bid amount is required."
        };
    }

    //rejects amounts below the minimum valid bid
    if (numericAmount < auction.minimumBid) {
        return {
            valid: false,
            message:
                `The minimum valid bid is £${auction.minimumBid.toFixed(2)}.`
        };
    }

    return {
        valid: true,
        amount: numericAmount
    };
}

module.exports = {
    validateBid
};