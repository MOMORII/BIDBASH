//loads moderation services

const moderationService =
    require("../services/moderation");

//renders the moderation dashboard

function dashboard(
    req,
    res
) {
    const cases =
        moderationService
            .getCases();

    res.render("moderator", {
        pageTitle:
            "Moderation Dashboard - BIDBASH",

        cases
    });
}

//updates a moderation case

function updateCase(
    req,
    res
) {
    if (!req.session.user) {
        return res.status(401).send(
            "You must be signed in."
        );
    }

    const action =
        req.body.action;

    const result =
        moderationService
            .updateCase({
                caseId:
                    req.params.id,

                moderatorId:
                    req.session.user.id,

                decision:
                    action,

                decisionNotes:
                    req.body.decisionNotes ||
                    null
            });

    if (!result.success) {
        if (
            result.status ===
            "not-found"
        ) {
            return res.status(404).send(
                result.message
            );
        }

        return res.status(400).send(
            result.message
        );
    }

    res.redirect(
        "/moderation"
    );
}

module.exports = {
    dashboard,
    updateCase
};