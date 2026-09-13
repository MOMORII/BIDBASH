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

//validates report types

function validateReportType(
    reportType
) {
    const allowedTypes = [
        "prohibited",
        "counterfeit",
        "misleading",
        "unsafe",
        "restricted"
    ];

    return allowedTypes.includes(
        reportType
    );
}

//assigns risk based on report type

function getRiskLevel(
    reportType
) {
    if (
        reportType ===
        "prohibited"
    ) {
        return "high";
    }

    if (
        reportType ===
        "restricted"
    ) {
        return "high";
    }

    if (
        reportType ===
        "counterfeit"
    ) {
        return "medium";
    }

    if (
        reportType ===
        "unsafe"
    ) {
        return "medium";
    }

    return "low";
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

//loads a listing for reporting

function getListingForReport(
    listingId
) {
    return db.prepare(`
        SELECT
            listing_id,
            seller_id,
            title,
            status

        FROM listings

        WHERE
            listing_id = ?
    `).get(
        Number(
            listingId
        )
    );
}

//checks whether the user already has an open report

function getExistingReport(
    listingId,
    reporterId
) {
    return db.prepare(`
        SELECT
            report_id,
            moderation_case_id,
            status

        FROM reports

        WHERE
            listing_id = ?
            AND reporter_id = ?
            AND status IN (
                'submitted',
                'reviewing'
            )

        ORDER BY
            submitted_at DESC

        LIMIT 1
    `).get(
        Number(
            listingId
        ),
        Number(
            reporterId
        )
    );
}

//creates a report and moderation case

const createReportTransaction =
    db.transaction(
        ({
            listingId,
            reporterId,
            reportType,
            reason,
            description
        }) => {
            const listing =
                getListingForReport(
                    listingId
                );

            if (!listing) {
                return {
                    success: false,
                    status:
                        "not-found",
                    message:
                        "The listing could not be found."
                };
            }

            if (
                listing.status ===
                    "removed"
            ) {
                return {
                    success: false,
                    status:
                        "unavailable",
                    message:
                        "This listing is no longer available for reporting."
                };
            }

            if (
                Number(
                    listing.seller_id
                ) ===
                Number(
                    reporterId
                )
            ) {
                return {
                    success: false,
                    status:
                        "own-listing",
                    message:
                        "You cannot report your own listing."
                };
            }

            if (
                !validateReportType(
                    reportType
                )
            ) {
                return {
                    success: false,
                    status:
                        "invalid-type",
                    message:
                        "Please select a valid report type."
                };
            }

            const cleanReason =
                String(
                    reason ||
                    ""
                )
                    .trim();

            const cleanDescription =
                String(
                    description ||
                    ""
                )
                    .trim();

            if (!cleanReason) {
                return {
                    success: false,
                    status:
                        "missing-reason",
                    message:
                        "Please provide a reason for the report."
                };
            }

            const existingReport =
                getExistingReport(
                    listingId,
                    reporterId
                );

            if (existingReport) {
                return {
                    success: false,
                    status:
                        "already-reported",
                    message:
                        "You already have an active report for this listing."
                };
            }

            const riskLevel =
                getRiskLevel(
                    reportType
                );

            //creates the moderation case

            const caseResult =
                db.prepare(`
                    INSERT INTO moderation_cases (
                        listing_id,
                        moderator_id,
                        flag_reason,
                        report_type,
                        risk_level,
                        evidence,
                        additional_notes,
                        status
                    )

                    VALUES (
                        ?,
                        NULL,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        'awaiting'
                    )
                `).run(
                    Number(
                        listingId
                    ),
                    cleanReason,
                    reportType,
                    riskLevel,
                    "User-submitted report.",
                    cleanDescription ||
                        null
                );

            const caseId =
                Number(
                    caseResult
                        .lastInsertRowid
                );

            //creates the linked user report

            const reportResult =
                db.prepare(`
                    INSERT INTO reports (
                        listing_id,
                        reporter_id,
                        moderation_case_id,
                        reason,
                        description,
                        status
                    )

                    VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        'reviewing'
                    )
                `).run(
                    Number(
                        listingId
                    ),
                    Number(
                        reporterId
                    ),
                    caseId,
                    cleanReason,
                    cleanDescription ||
                        null
                );

            return {
                success: true,

                status:
                    "reported",

                message:
                    "The listing has been reported for moderator review.",

                reportId:
                    Number(
                        reportResult
                            .lastInsertRowid
                    ),

                caseId,

                listingId:
                    Number(
                        listingId
                    ),

                riskLevel
            };
        }
    );

//submits a listing report

function createReport({
    listingId,
    reporterId,
    reportType,
    reason,
    description = null
}) {
    return createReportTransaction({
        listingId:
            Number(
                listingId
            ),

        reporterId:
            Number(
                reporterId
            ),

        reportType:
            String(
                reportType ||
                ""
            )
                .trim()
                .toLowerCase(),

        reason,

        description
    });
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
    validateReportType,
    getCases,
    getCaseById,
    createReport,
    updateCase
};