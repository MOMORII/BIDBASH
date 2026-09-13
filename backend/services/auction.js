//loads the bidbash database

const db =
    require("../database/db");

//formats remaining auction time

function formatTimeRemaining(
    endTime
) {
    const end =
        new Date(
            endTime.replace(
                " ",
                "T"
            )
        );

    const now =
        new Date();

    const difference =
        end.getTime() -
        now.getTime();

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
            formatTimeRemaining(
                row.end_time
            ),

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
                auctions.current_highest_bid DESC,
                auctions.end_time ASC

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

            ORDER BY
                auctions.end_time ASC

            LIMIT 8
        `).all();

    return rows.map(
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
                auctions.current_highest_bid DESC,
                auctions.end_time ASC
            `;
            break;

        case "ending-soon":
            orderBy = `
                auctions.end_time ASC
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