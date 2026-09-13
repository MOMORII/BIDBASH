//loads auction services

const auctionService =
    require("../services/auction");

const moderationService =
    require("../services/moderation");

//renders an auction page

function show(
    req,
    res
) {
    const auction =
        auctionService.getById(
            req.params.id
        );

    if (!auction) {
        return res.status(404).send(
            "Auction not found."
        );
    }

    res.render("auction", {
        pageTitle:
            `${auction.title} - BIDBASH`,

        auction
    });
}

//reports a listing for moderator review

function reportListing(
    req,
    res
) {
    if (!req.session.user) {
        return res.status(401).json({
            success: false,

            status:
                "not-authenticated",

            message:
                "You must be signed in to report a listing."
        });
    }

    const result =
        moderationService
            .createReport({
                listingId:
                    req.params.id,

                reporterId:
                    req.session.user.id,

                reportType:
                    req.body.reportType,

                reason:
                    req.body.reason,

                description:
                    req.body.description
            });

    if (!result.success) {
        if (
            result.status ===
            "not-found"
        ) {
            return res.status(404).json(
                result
            );
        }

        return res.status(400).json(
            result
        );
    }

    res.status(201).json(
        result
    );
}

module.exports = {
    show,
    reportListing
};