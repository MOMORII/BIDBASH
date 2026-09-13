//loads the bidbash database

const db =
    require("../database/db");

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

//formats completed dates

function formatCompletedDate(
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
                "long",
            year:
                "numeric"
        }
    );
}

//formats dashboard status text

function formatStatus(
    status
) {
    if (!status) {
        return null;
    }

    return status
        .split("-")
        .map(
            word =>
                word.charAt(0)
                    .toUpperCase() +
                word.slice(1)
        )
        .join(" ");
}

//maps database listings for the dashboard

function mapSellerListing(
    row
) {
    const currentBid =
        Number(
            row.current_highest_bid ??
            row.starting_price
        );

    const finalAmount =
        row.final_amount === null ||
        row.final_amount === undefined
            ? (
                row.auction_status ===
                "ended"
                    ? currentBid
                    : null
            )
            : Number(
                row.final_amount
            );

    return {
        id:
            row.listing_id,

        auctionId:
            row.auction_id,

        orderId:
            row.order_id ||
            null,

        sellerId:
            row.seller_id,

        title:
            row.title,

        category:
            row.category,

        condition:
            row.condition,

        brand:
            row.brand,

        startingPrice:
            Number(
                row.starting_price
            ),

        currentBid:
            currentBid,

        bidCount:
            Number(
                row.bid_count ||
                0
            ),

        timeRemaining:
            row.auction_status ===
            "active"
                ? formatTimeRemaining(
                    row.end_time
                )
                : "Ended",

        finalAmount:
            finalAmount,

        buyer:
            row.buyer ||
            null,

        paymentStatus:
            row.payment_status
                ? formatStatus(
                    row.payment_status
                )
                : "Awaiting Payment",

        fulfilmentStatus:
            row.fulfilment_status
                ? formatStatus(
                    row.fulfilment_status
                )
                : "Awaiting Payment",

        rawPaymentStatus:
            row.payment_status ||
            null,

        rawFulfilmentStatus:
            row.fulfilment_status ||
            null,

        trackingReference:
            row.tracking_reference ||
            null,

        outcome:
            row.order_id
                ? "Sold"
                : (
                    row.auction_status ===
                    "ended"
                        ? "Unsold"
                        : null
                ),

        completedAt:
            row.auction_status ===
            "ended"
                ? formatCompletedDate(
                    row.end_time
                )
                : null,

        status:
            row.listing_status,

        listingStatus:
            row.listing_status,

        auctionStatus:
            row.auction_status,

        imagePath:
            row.image_path ||
            null
    };
}

//returns all listings belonging to one seller

function getBySellerId(
    sellerId
) {
    const rows =
        db.prepare(`
            SELECT
                listings.listing_id,
                listings.seller_id,
                listings.title,
                listings.description,
                listings.condition,
                listings.brand,
                listings.starting_price,
                listings.bid_increment,
                listings.status AS listing_status,
                listings.created_at,

                categories.name AS category,

                auctions.auction_id,
                auctions.current_highest_bid,
                auctions.start_time,
                auctions.end_time,
                auctions.status AS auction_status,

                orders.order_id,
                orders.final_amount,
                orders.status AS order_status,

                payments.status AS payment_status,

                buyer.username AS buyer,

                fulfilments.status AS fulfilment_status,
                fulfilments.tracking_reference,

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
                        listing_images.file_path
                    FROM listing_images
                    WHERE
                        listing_images.listing_id =
                            listings.listing_id
                    ORDER BY
                        listing_images.display_order ASC
                    LIMIT 1
                ) AS image_path

            FROM listings

            JOIN categories
                ON categories.category_id =
                    listings.category_id

            LEFT JOIN auctions
                ON auctions.listing_id =
                    listings.listing_id

            LEFT JOIN orders
                ON orders.auction_id =
                    auctions.auction_id

            LEFT JOIN payments
                ON payments.order_id =
                    orders.order_id

            LEFT JOIN users AS buyer
                ON buyer.user_id =
                    orders.buyer_id

            LEFT JOIN fulfilments
                ON fulfilments.order_id =
                    orders.order_id

            WHERE
                listings.seller_id = ?

            ORDER BY
                listings.created_at DESC,
                listings.listing_id DESC
        `).all(
            Number(
                sellerId
            )
        );

    return rows.map(
        mapSellerListing
    );
}

//separates seller listings into dashboard sections

function groupSellerListings(
    sellerId
) {
    const sellerListings =
        getBySellerId(
            sellerId
        );

    return {
        active:
            sellerListings.filter(
                listing =>
                    listing.listingStatus !==
                        "sold" &&
                    listing.auctionStatus ===
                        "active"
            ),

        successful:
            sellerListings.filter(
                listing =>
                    listing.outcome ===
                        "Sold"
            ),

        history:
            sellerListings.filter(
                listing =>
                    listing.auctionStatus ===
                        "ended" &&
                    listing.outcome !==
                        "Sold"
            )
    };
}

//finds a category by name

function getCategoryByName(
    category
) {
    return db.prepare(`
        SELECT
            category_id,
            name

        FROM categories

        WHERE
            LOWER(name) =
            LOWER(?)
    `).get(
        category
    );
}

//creates a seller listing and auction

const createListingTransaction =
    db.transaction(
        ({
            sellerId,
            title,
            category,
            condition,
            description,
            brand,
            startingPrice,
            bidIncrement,
            deliveryInfo,
            returnInfo
        }) => {
            const categoryRecord =
                getCategoryByName(
                    category
                );

            if (!categoryRecord) {
                return {
                    success: false,
                    message:
                        "Please select a valid listing category."
                };
            }

            const listingResult =
                db.prepare(`
                    INSERT INTO listings (
                        seller_id,
                        category_id,
                        title,
                        description,
                        condition,
                        brand,
                        starting_price,
                        bid_increment,
                        delivery_info,
                        return_info,
                        status
                    )

                    VALUES (
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        ?,
                        'active'
                    )
                `).run(
                    Number(
                        sellerId
                    ),
                    categoryRecord.category_id,
                    title,
                    description,
                    condition,
                    brand ||
                        null,
                    Number(
                        startingPrice
                    ),
                    Number(
                        bidIncrement
                    ),
                    deliveryInfo ||
                        "Standard UK delivery available.",
                    returnInfo ||
                        "Returns accepted within 14 days."
                );

            const listingId =
                Number(
                    listingResult
                        .lastInsertRowid
                );

            const startTime =
                new Date();

            const endTime =
                new Date();

            endTime.setDate(
                endTime.getDate() +
                7
            );

            function formatDate(
                date
            ) {
                return date
                    .toISOString()
                    .replace(
                        "T",
                        " "
                    )
                    .slice(
                        0,
                        19
                    );
            }

            const auctionResult =
                db.prepare(`
                    INSERT INTO auctions (
                        listing_id,
                        start_time,
                        end_time,
                        current_highest_bid,
                        status
                    )

                    VALUES (
                        ?,
                        ?,
                        ?,
                        NULL,
                        'active'
                    )
                `).run(
                    listingId,
                    formatDate(
                        startTime
                    ),
                    formatDate(
                        endTime
                    )
                );

            return {
                success: true,

                listingId,

                auctionId:
                    Number(
                        auctionResult
                            .lastInsertRowid
                    )
            };
        }
    );

//creates a new listing

function create({
    sellerId,
    title,
    category,
    condition,
    description,
    brand = null,
    startingPrice,
    bidIncrement,
    deliveryInfo = null,
    returnInfo = null
}) {
    return createListingTransaction({
        sellerId,
        title,
        category,
        condition,
        description,
        brand,
        startingPrice,
        bidIncrement,
        deliveryInfo,
        returnInfo
    });
}

module.exports = {
    getBySellerId,
    groupSellerListings,
    create
};