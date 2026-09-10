//validates whether a moderation decision is recognised
function validateDecision(decision) {
    const allowedDecisions = [
        "approve",
        "changes_required",
        "remove"
    ];

    return allowedDecisions.includes(decision);
}

module.exports = {
    validateDecision
};