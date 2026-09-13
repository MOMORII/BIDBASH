//loads temporary moderation cases

const moderationCases =
    require("../data/mockModerationCases");

const moderationService =
    require("../services/moderation");

//sorts moderation cases by risk

function sortByRisk(cases) {
    const priorities = {
        high: 1,
        medium: 2,
        low: 3
    };

    return [...cases].sort((a, b) => {
        return priorities[a.riskLevel] -
            priorities[b.riskLevel];
    });
}

//renders the moderation dashboard

function dashboard(req, res) {
    const cases =
        sortByRisk(moderationCases);

    res.render("moderator", {
        pageTitle: "Moderation Dashboard - BIDBASH",
        cases
    });
}

//updates a temporary moderation case

function updateCase(req, res) {
    const moderationCase =
        moderationCases.find(
            item => item.id === req.params.id
        );

    if (!moderationCase) {
        return res.status(404).send(
            "Moderation case not found."
        );
    }

    const action =
        req.body.action;

    if (!moderationService.validateDecision(action)) {
        return res.status(400).send(
            "Invalid moderation action."
        );
    }

    if (action === "approve") {
        moderationCase.status =
            "approved";
    }

    if (action === "request-change") {
        moderationCase.status =
            "changes-requested";
    }

    if (action === "remove") {
        moderationCase.status =
            "removed";
    }

    res.redirect("/moderation");
}

module.exports = {
    dashboard,
    updateCase
};