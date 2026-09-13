//validates whether a moderation decision is recognised

function validateDecision(decision) {
    const allowedDecisions = [
        "approve",
        "request-change",
        "remove"
    ];

    return allowedDecisions.includes(decision);
}

module.exports = {
    validateDecision
};