//loads the bidbash database

const db =
    require("../database/db");

//formats moderation dates

function formatDate(
    dateValue
) {
    if (!dateValue) {
        return "Not available";
    }

    const date =
        new Date(
            dateValue.replace(
                " ",
                "T"
            )
        );

    return date.toLocaleDateString(
        "en-GB",
        {
            day:
                "2-digit",
            month:
                "short",
            year:
                "numeric"
        }
    );
}

//validates whether a moderation decision is recognised

function validateDecision(
    decision
) {
    const allowedDecisions = [
        "approve",
        "request-change",
        "remove"
    ];

    return allowedDecisions.includes(
        decision
    );
}

//maps a moderation case for the dashboard

function mapModerationCase(
    row
) {
    return {
        id:
            String(
                row.case_id
            ),

        listingId:
            row.listing_id,

        title:
            row.title,

        category:
            row.category,

        seller:
            row.seller,

        memberSince:
            formatDate(
                row.seller_created_at
            ),

        sellerListings:
            Number(
                row.seller_listings ||
                0
            ),

        feedbackScore:
            "Not available",

        flagReason:
            row.flag_reason,

        reportedBy:
            row.reporter ||
            "System",

        reportedAt:
            formatDate(
                row.submitted_at ||
                row.created_at
            ),

        riskLevel:
            row.risk_level,

        reportType:
            row.report_type,

        status:
            row.case_status,

        additionalNotes:
            row.additional_notes ||
            "No additional notes were supplied.",

        evidence:
            row.evidence ||
            "No evidence recorded.",

        imagePath:
            row.image_path ||
            null
    };
}

//loads moderation cases from the database

function getCases() {
    const rows =
        db.prepare(`
            SELECT
                moderation_cases.case_id,
                moderation_cases.listing_id,
                moderation_cases.moderator_id,
                moderation_cases.flag_reason,
                moderation_cases.report_type,
                moderation_cases.risk_level,
                moderation_cases.evidence,
                moderation_cases.additional_notes,
                moderation_cases.status AS case_status,
                moderation_cases.created_at,
                moderation_cases.reviewed_at,
                moderation_cases.decision_notes,

                listings.title,
                listings.status AS listing_status,

                categories.name AS category,

                seller.username AS seller,
                seller.created_at AS seller_created_at,

                reports.report_id,
                reports.reason AS report_reason,
                reports.description AS report_description,
                reports.submitted_at,
                reports.status AS report_status,

                reporter.username AS reporter,

                (
                    SELECT
                        COUNT(*)

                    FROM listings AS seller_listing

                    WHERE
                        seller_listing.seller_id =
                            listings.seller_id
                ) AS seller_listings,

                (
                    SELECT
                        listing_images.file_path

                    FROM listing_images

                    WHERE
                        listing_images.listing_id =
                            listings.listing_id

                    ORDER BY
                        listing_images.display_order ASC

                    LIMIT 1
                ) AS image_path

            FROM moderation_cases

            JOIN listings
                ON listings.listing_id =
                    moderation_cases.listing_id

            JOIN categories
                ON categories.category_id =
                    listings.category_id

            JOIN users AS seller
                ON seller.user_id =
                    listings.seller_id

            LEFT JOIN reports
                ON reports.moderation_case_id =
                    moderation_cases.case_id

            LEFT JOIN users AS reporter
                ON reporter.user_id =
                    reports.reporter_id

            WHERE
                reports.report_id IS NULL
                OR reports.report_id = (
                    SELECT
                        MIN(
                            linked_report.report_id
                        )

                    FROM reports AS linked_report

                    WHERE
                        linked_report.moderation_case_id =
                            moderation_cases.case_id
                )

            ORDER BY
                CASE
                    moderation_cases.risk_level

                    WHEN 'high'
                        THEN 1

                    WHEN 'medium'
                        THEN 2

                    WHEN 'low'
                        THEN 3

                    ELSE 4
                END,

                moderation_cases.created_at ASC,
                moderation_cases.case_id ASC
        `).all();

    return rows.map(
        mapModerationCase
    );
}

//loads one moderation case

function getCaseById(
    caseId
) {
    return db.prepare(`
        SELECT
            case_id,
            listing_id,
            moderator_id,
            flag_reason,
            report_type,
            risk_level,
            evidence,
            additional_notes,
            status,
            created_at,
            reviewed_at,
            decision_notes

        FROM moderation_cases

        WHERE
            case_id = ?
    `).get(
        Number(
            caseId
        )
    );
}

//updates a moderation decision

const updateCaseTransaction =
    db.transaction(
        ({
            caseId,
            moderatorId,
            decision,
            decisionNotes
        }) => {
            if (
                !validateDecision(
                    decision
                )
            ) {
                return {
                    success: false,
                    status:
                        "invalid-decision",
                    message:
                        "Invalid moderation action."
                };
            }

            const moderationCase =
                getCaseById(
                    caseId
                );

            if (!moderationCase) {
                return {
                    success: false,
                    status:
                        "not-found",
                    message:
                        "Moderation case not found."
                };
            }

            let caseStatus =
                null;

            let reportStatus =
                null;

            let listingStatus =
                null;

            if (
                decision ===
                "approve"
            ) {
                caseStatus =
                    "approved";

                reportStatus =
                    "dismissed";
            }

            if (
                decision ===
                "request-change"
            ) {
                caseStatus =
                    "changes-requested";

                reportStatus =
                    "resolved";

                listingStatus =
                    "changes-requested";
            }

            if (
                decision ===
                "remove"
            ) {
                caseStatus =
                    "removed";

                reportStatus =
                    "resolved";

                listingStatus =
                    "removed";
            }

            //updates the moderation case

            db.prepare(`
                UPDATE moderation_cases

                SET
                    moderator_id = ?,
                    status = ?,
                    reviewed_at =
                        CURRENT_TIMESTAMP,
                    decision_notes = ?

                WHERE
                    case_id = ?
            `).run(
                Number(
                    moderatorId
                ),
                caseStatus,
                decisionNotes ||
                    null,
                Number(
                    caseId
                )
            );

            //updates linked reports

            db.prepare(`
                UPDATE reports

                SET
                    status = ?

                WHERE
                    moderation_case_id = ?
            `).run(
                reportStatus,
                Number(
                    caseId
                )
            );

            //updates listing moderation status

            if (listingStatus) {
                db.prepare(`
                    UPDATE listings

                    SET
                        status = ?,
                        updated_at =
                            CURRENT_TIMESTAMP

                    WHERE
                        listing_id = ?
                        AND status NOT IN (
                            'sold',
                            'ended'
                        )
                `).run(
                    listingStatus,
                    moderationCase.listing_id
                );
            }

            //restores approved listings where appropriate

            if (
                decision ===
                "approve"
            ) {
                db.prepare(`
                    UPDATE listings

                    SET
                        status = 'active',
                        updated_at =
                            CURRENT_TIMESTAMP

                    WHERE
                        listing_id = ?
                        AND status =
                            'changes-requested'
                `).run(
                    moderationCase.listing_id
                );
            }

            //cancels active auctions for removed listings

            if (
                decision ===
                "remove"
            ) {
                db.prepare(`
                    UPDATE auctions

                    SET
                        status = 'cancelled'

                    WHERE
                        listing_id = ?
                        AND status = 'active'
                `).run(
                    moderationCase.listing_id
                );
            }

            return {
                success: true,

                caseId:
                    Number(
                        caseId
                    ),

                listingId:
                    moderationCase.listing_id,

                status:
                    caseStatus
            };
        }
    );

//applies a moderation decision

function updateCase({
    caseId,
    moderatorId,
    decision,
    decisionNotes = null
}) {
    return updateCaseTransaction({
        caseId:
            Number(
                caseId
            ),

        moderatorId:
            Number(
                moderatorId
            ),

        decision,

        decisionNotes
    });
}

module.exports = {
    validateDecision,
    getCases,
    getCaseById,
    updateCase
};