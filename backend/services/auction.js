//loads the bidbash database

const db =
    require("../database/db");

//sets static demo auction durations

const demoTimes = {
    1: "2h 14m",
    2: "5h 40m",
    3: "1d 3h",
    4: "18m",
    5: "29m",
    6: "42m",
    7: "1h 10m",
    8: "3h 25m",
    9: "11m",
    10: "56m",
    11: "7h 20m",
    12: "24m",

    13: "1d 8h",
    14: "2d 4h",
    15: "2d 18h",
    16: "3d 7h",
    17: "3d 19h",
    18: "4d 6h",
    19: "4d 18h",
    20: "5d 2h",
    21: "5d 13h",
    22: "5d 22h",
    23: "6d 8h",
    24: "6d 18h",

    28: "6d 23h"
};

//stores matching demo durations in minutes for sorting

const demoTimeMinutes = {
    1: 134,
    2: 340,
    3: 1620,
    4: 18,
    5: 29,
    6: 42,
    7: 70,
    8: 205,
    9: 11,
    10: 56,
    11: 440,
    12: 24,

    13: 1920,
    14: 3120,
    15: 3960,
    16: 4740,
    17: 5460,
    18: 6120,
    19: 6840,
    20: 7320,
    21: 7980,
    22: 8520,
    23: 9120,
    24: 9720,

    28: 10020
};

//formats remaining auction time

function formatTimeRemaining(
    endTime
) {
    if (!endTime) {
        return "Not started";
    }

    const end =
        new Date(
            endTime.replace(
                " ",
                "T"
            )
        );

    const difference =
        end.getTime() -
        Date.now();

    if (
        difference <= 0
    ) {
        return "Ended";
    }

    const totalMinutes =
        Math.floor(
            difference /
            60000
        );

    const days =
        Math.floor(
            totalMinutes /
            1440
        );

    const hours =
        Math.floor(
            (
                totalMinutes %
                1440
            ) /
            60
        );

    const minutes =
        totalMinutes %
        60;

    if (days > 0) {
        return `${days}d ${hours}h`;
    }

    if (hours > 0) {
        return `${hours}h ${minutes}m`;
    }

    return `${minutes}m`;
}

//returns sortable remaining time in minutes

function getSortMinutes(
    row
) {
    if (
        demoTimeMinutes[
            row.auction_id
        ] !== undefined
    ) {
        return demoTimeMinutes[
            row.auction_id
        ];
    }

    if (!row.end_time) {
        return Number.MAX_SAFE_INTEGER;
    }

    const end =
        new Date(
            row.end_time.replace(
                " ",
                "T"
            )
        );

    return Math.max(
        0,
        Math.floor(
            (
                end.getTime() -
                Date.now()
            ) /
            60000
        )
    );
}

//maps database rows for the frontend

function mapAuction(
    row
) {
    if (!row) {
        return null;
    }

    const currentBid =
        Number(
            row.current_highest_bid ??
            row.starting_price
        );

    const bidIncrement =
        Number(
            row.bid_increment
        );

    return {
        id:
            row.auction_id,

        listingId:
            row.listing_id,

        sellerId:
            row.seller_id,

        title:
            row.title,

        description:
            row.description,

        condition:
            row.condition,

        brand:
            row.brand ||
            "Not specified",

        seller:
            row.seller,

        category:
            row.category,

        currentBid,

        minimumBid:
            currentBid +
            bidIncrement,

        bidIncrement,

        timeRemaining:
            row.auction_status ===
            "active"
                ? (
                    demoTimes[
                        row.auction_id
                    ] ||
                    formatTimeRemaining(
                        row.end_time
                    )
                )
                : "Ended",

        startTime:
            row.start_time,

        endTime:
            row.end_time,

        bidCount:
            Number(
                row.bid_count ||
                0
            ),

        activeBidders:
            Number(
                row.active_bidders ||
                0
            ),

        status:
            row.auction_status,

        listingStatus:
            row.listing_status,

        deliveryInfo:
            row.delivery_info,

        returnInfo:
            row.return_info,

        createdAt:
            row.created_at,

        imagePath:
            row.image_path ||
            null
    };
}

//loads the common auction query

function getAuctionQuery() {
    return `
        SELECT
            auctions.auction_id,
            auctions.listing_id,
            auctions.start_time,
            auctions.end_time,
            auctions.current_highest_bid,
            auctions.status AS auction_status,

            listings.seller_id,
            listings.title,
            listings.description,
            listings.condition,
            listings.brand,
            listings.starting_price,
            listings.bid_increment,
            listings.delivery_info,
            listings.return_info,
            listings.status AS listing_status,
            listings.created_at,

            categories.name AS category,

            users.username AS seller,

            (
                SELECT
                    COUNT(*)

                FROM bids

                WHERE
                    bids.auction_id =
                        auctions.auction_id
            ) AS bid_count,

            (
                SELECT
                    COUNT(
                        DISTINCT bids.bidder_id
                    )

                FROM bids

                WHERE
                    bids.auction_id =
                        auctions.auction_id
            ) AS active_bidders,

            (
                SELECT
                    listing_images.file_path

                FROM listing_images

                WHERE
                    listing_images.listing_id =
                        listings.listing_id

                ORDER BY
                    listing_images.display_order
                    ASC

                LIMIT 1
            ) AS image_path

        FROM auctions

        JOIN listings
            ON listings.listing_id =
                auctions.listing_id

        JOIN categories
            ON categories.category_id =
                listings.category_id

        JOIN users
            ON users.user_id =
                listings.seller_id
    `;
}

//returns one auction

function getById(
    id
) {
    const row =
        db.prepare(`
            ${getAuctionQuery()}

            WHERE
                auctions.auction_id = ?
        `).get(
            Number(
                id
            )
        );

    return mapAuction(
        row
    );
}

//returns featured auctions

function getFeatured() {
    const rows =
        db.prepare(`
            ${getAuctionQuery()}

            WHERE
                auctions.status = 'active'
                AND listings.status = 'active'

            ORDER BY
                bid_count DESC,
                auctions.current_highest_bid DESC

            LIMIT 8
        `).all();

    return rows.map(
        mapAuction
    );
}

//returns auctions ending soon

function getEndingSoon() {
    const rows =
        db.prepare(`
            ${getAuctionQuery()}

            WHERE
                auctions.status = 'active'
                AND listings.status = 'active'
        `).all();

    rows.sort(
        (first, second) =>
            getSortMinutes(first) -
            getSortMinutes(second)
    );

    return rows
        .slice(
            0,
            8
        )
        .map(
            mapAuction
        );
}

//returns browse auctions

function browse({
    sort = "default",
    category = "all",
    search = ""
}) {
    const conditions = [
        "auctions.status = 'active'",
        "listings.status = 'active'"
    ];

    const parameters = [];

    if (
        category &&
        category !== "all"
    ) {
        conditions.push(
            "LOWER(categories.name) = ?"
        );

        parameters.push(
            category.toLowerCase()
        );
    }

    if (
        search.trim()
    ) {
        const searchValue =
            `%${search
                .trim()
                .toLowerCase()}%`;

        conditions.push(`
            (
                LOWER(listings.title)
                    LIKE ?
                OR LOWER(listings.description)
                    LIKE ?
                OR LOWER(
                    COALESCE(
                        listings.brand,
                        ''
                    )
                )
                    LIKE ?
                OR LOWER(categories.name)
                    LIKE ?
                OR LOWER(users.username)
                    LIKE ?
            )
        `);

        parameters.push(
            searchValue,
            searchValue,
            searchValue,
            searchValue,
            searchValue
        );
    }

    let orderBy;

    switch (
        sort
    ) {
        case "featured":
            orderBy = `
                bid_count DESC,
                auctions.current_highest_bid DESC
            `;
            break;

        case "ending-soon":
            orderBy = `
                auctions.auction_id ASC
            `;
            break;

        case "newest":
            orderBy = `
                listings.created_at DESC
            `;
            break;

        case "price-low":
            orderBy = `
                COALESCE(
                    auctions.current_highest_bid,
                    listings.starting_price
                ) ASC
            `;
            break;

        case "price-high":
            orderBy = `
                COALESCE(
                    auctions.current_highest_bid,
                    listings.starting_price
                ) DESC
            `;
            break;

        default:
            orderBy = `
                auctions.auction_id DESC
            `;
    }

    const rows =
        db.prepare(`
            ${getAuctionQuery()}

            WHERE
                ${conditions.join(
                    " AND "
                )}

            ORDER BY
                ${orderBy}
        `).all(
            ...parameters
        );

    if (
        sort ===
        "ending-soon"
    ) {
        rows.sort(
            (first, second) =>
                getSortMinutes(first) -
                getSortMinutes(second)
        );
    }

    return rows.map(
        mapAuction
    );
}

module.exports = {
    getById,
    getFeatured,
    getEndingSoon,
    browse
};