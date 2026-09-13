//loads database services

const db =
    require("../database/db");

const notificationService =
    require("./notification");

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

//formats completed auction dates

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

//loads an auction for bidding

function getAuctionForBid(
    auctionId
) {
    return db.prepare(`
        SELECT
            auctions.auction_id,
            auctions.current_highest_bid,
            auctions.end_time,
            auctions.status AS auction_status,

            listings.listing_id,
            listings.seller_id,
            listings.title,
            listings.starting_price,
            listings.bid_increment,
            listings.status AS listing_status

        FROM auctions

        JOIN listings
            ON listings.listing_id =
                auctions.listing_id

        WHERE
            auctions.auction_id = ?
    `).get(
        Number(auctionId)
    );
}

//loads the current winning bid

function getHighestBid(
    auctionId
) {
    return db.prepare(`
        SELECT
            bid_id,
            auction_id,
            bidder_id,
            amount,
            placed_at,
            status

        FROM bids

        WHERE
            auction_id = ?
            AND status = 'winning'

        ORDER BY
            amount DESC,
            placed_at ASC

        LIMIT 1
    `).get(
        Number(auctionId)
    );
}

//maps database bids for the dashboard

function mapDashboardBid(
    row
) {
    const latestBid =
        Number(
            row.amount
        );

    const finalBid =
        Number(
            row.current_highest_bid ??
            row.amount ??
            row.starting_price
        );

    const finalAmount =
        row.final_amount === null ||
        row.final_amount === undefined
            ? finalBid
            : Number(
                row.final_amount
            );

    let outcome =
        null;

    if (
        row.bid_status ===
        "won"
    ) {
        outcome =
            "Won";
    }

    if (
        row.bid_status ===
            "lost" ||
        row.bid_status ===
            "outbid"
    ) {
        outcome =
            "Lost";
    }

    return {
        id:
            row.bid_id,

        auctionId:
            row.auction_id,

        listingId:
            row.listing_id,

        orderId:
            row.order_id ||
            null,

        title:
            row.title,

        category:
            row.category,

        seller:
            row.seller,

        userBid:
            latestBid,

        latestBid:
            latestBid,

        currentBid:
            finalBid,

        finalBid:
            finalBid,

        finalAmount:
            finalAmount,

        bidStatus:
            row.bid_status,

        status:
            row.bid_status,

        outcome:
            outcome,

        auctionStatus:
            row.auction_status,

        paymentStatus:
            row.payment_status
                ? row.payment_status
                : "Pending",

        fulfilmentStatus:
            row.fulfilment_status
                ? row.fulfilment_status
                : "Awaiting Payment",

        trackingReference:
            row.tracking_reference ||
            null,

        timeRemaining:
            row.auction_status ===
            "active"
                ? formatTimeRemaining(
                    row.end_time
                )
                : "Ended",

        completedAt:
            row.auction_status ===
            "ended"
                ? formatCompletedDate(
                    row.end_time
                )
                : null,

        imagePath:
            row.image_path ||
            null
    };
}

//returns bids belonging to one user

function getUserBids(
    userId
) {
    const rows =
        db.prepare(`
            SELECT
                bids.bid_id,
                bids.auction_id,
                bids.bidder_id,
                bids.amount,
                bids.placed_at,
                bids.status AS bid_status,

                auctions.status AS auction_status,
                auctions.current_highest_bid,
                auctions.end_time,

                listings.listing_id,
                listings.title,
                listings.starting_price,

                categories.name AS category,

                seller.username AS seller,

                orders.order_id,
                orders.final_amount,
                orders.status AS order_status,

                payments.status AS payment_status,

                fulfilments.status AS fulfilment_status,
                fulfilments.tracking_reference,

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

            FROM bids

            JOIN auctions
                ON auctions.auction_id =
                    bids.auction_id

            JOIN listings
                ON listings.listing_id =
                    auctions.listing_id

            JOIN categories
                ON categories.category_id =
                    listings.category_id

            JOIN users AS seller
                ON seller.user_id =
                    listings.seller_id

            LEFT JOIN orders
                ON orders.auction_id =
                    auctions.auction_id

            LEFT JOIN payments
                ON payments.order_id =
                    orders.order_id

            LEFT JOIN fulfilments
                ON fulfilments.order_id =
                    orders.order_id

            WHERE
                bids.bidder_id = ?

                AND bids.bid_id = (
                    SELECT
                        latest_bid.bid_id

                    FROM bids AS latest_bid

                    WHERE
                        latest_bid.bidder_id =
                            bids.bidder_id
                        AND latest_bid.auction_id =
                            bids.auction_id

                    ORDER BY
                        latest_bid.placed_at DESC,
                        latest_bid.bid_id DESC

                    LIMIT 1
                )

            ORDER BY
                bids.placed_at DESC,
                bids.bid_id DESC
        `).all(
            Number(userId)
        );

    const mappedBids =
        rows.map(
            mapDashboardBid
        );

    return {
        active:
            mappedBids.filter(
                bid =>
                    bid.auctionStatus ===
                    "active"
            ),

        successful:
            mappedBids.filter(
                bid =>
                    bid.status ===
                        "won" &&
                    bid.orderId !==
                        null
            ),

        history:
            mappedBids.filter(
                bid =>
                    bid.auctionStatus ===
                        "ended" &&
                    !(
                        bid.status ===
                            "won" &&
                        bid.orderId !==
                            null
                    )
            )
    };
}

//performs the bid transaction

const placeBidTransaction =
    db.transaction(
        ({
            userId,
            auctionId,
            amount,
            expectedCurrentBid
        }) => {
            const auction =
                getAuctionForBid(
                    auctionId
                );

            if (!auction) {
                return {
                    success: false,
                    status:
                        "not-found",
                    message:
                        "The auction could not be found."
                };
            }

            if (
                auction.auction_status !==
                    "active" ||
                auction.listing_status !==
                    "active"
            ) {
                return {
                    success: false,
                    status:
                        "ended",
                    message:
                        "This auction is no longer accepting bids."
                };
            }

            const endTime =
                new Date(
                    auction.end_time.replace(
                        " ",
                        "T"
                    )
                );

            if (
                endTime.getTime() <=
                Date.now()
            ) {
                return {
                    success: false,
                    status:
                        "ended",
                    message:
                        "This auction has ended."
                };
            }

            if (
                Number(
                    auction.seller_id
                ) ===
                Number(userId)
            ) {
                return {
                    success: false,
                    status:
                        "own-listing",
                    message:
                        "You cannot bid on your own listing."
                };
            }

            const numericAmount =
                Number(
                    amount
                );

            if (
                !Number.isFinite(
                    numericAmount
                ) ||
                numericAmount <= 0
            ) {
                return {
                    success: false,
                    status:
                        "invalid",
                    message:
                        "Enter a valid bid amount."
                };
            }

            const currentBid =
                Number(
                    auction.current_highest_bid ??
                    auction.starting_price
                );

            const bidIncrement =
                Number(
                    auction.bid_increment
                );

            const minimumBid =
                currentBid +
                bidIncrement;

            const expectedBid =
                Number(
                    expectedCurrentBid
                );

            const bidChanged =
                Number.isFinite(
                    expectedBid
                ) &&
                currentBid >
                    expectedBid;

            if (
                numericAmount <
                minimumBid
            ) {
                if (bidChanged) {
                    return {
                        success: false,
                        status:
                            "outbid",
                        message:
                            "Another bidder placed a higher bid while you were confirming.",
                        currentBid,
                        minimumBid
                    };
                }

                if (
                    numericAmount <=
                    currentBid
                ) {
                    return {
                        success: false,
                        status:
                            "below-current",
                        message:
                            `Your bid must be higher than the current bid of £${currentBid.toFixed(2)}.`,
                        currentBid,
                        minimumBid
                    };
                }

                return {
                    success: false,
                    status:
                        "increment-too-low",
                    message:
                        `Your bid is higher than the current bid, but does not meet the required £${bidIncrement.toFixed(2)} increment.`,
                    currentBid,
                    minimumBid,
                    bidIncrement
                };
            }

            const previousHighestBid =
                getHighestBid(
                    auctionId
                );

            if (
                previousHighestBid
            ) {
                db.prepare(`
                    UPDATE bids

                    SET
                        status = 'outbid'

                    WHERE
                        bid_id = ?
                `).run(
                    previousHighestBid.bid_id
                );
            }

            const result =
                db.prepare(`
                    INSERT INTO bids (
                        auction_id,
                        bidder_id,
                        amount,
                        status
                    )

                    VALUES (
                        ?,
                        ?,
                        ?,
                        'winning'
                    )
                `).run(
                    Number(auctionId),
                    Number(userId),
                    numericAmount
                );

            db.prepare(`
                UPDATE auctions

                SET
                    current_highest_bid = ?

                WHERE
                    auction_id = ?
            `).run(
                numericAmount,
                Number(auctionId)
            );

            notificationService
                .createNotification({
                    userId:
                        Number(userId),

                    type:
                        "bid_accepted",

                    title:
                        "Bid Accepted",

                    message:
                        `Your £${numericAmount.toFixed(2)} bid on ${auction.title} was accepted.`,

                    auctionId:
                        Number(
                            auctionId
                        ),

                    orderId:
                        null
                });

            if (
                previousHighestBid &&
                Number(
                    previousHighestBid
                        .bidder_id
                ) !==
                    Number(userId)
            ) {
                notificationService
                    .createNotification({
                        userId:
                            previousHighestBid
                                .bidder_id,

                        type:
                            "outbid",

                        title:
                            "You've Been Outbid",

                        message:
                            `A higher bid has been placed on ${auction.title}.`,

                        auctionId:
                            Number(
                                auctionId
                            ),

                        orderId:
                            null
                    });
            }

            return {
                success: true,

                status:
                    "accepted",

                message:
                    "Your bid has been accepted.",

                bid: {
                    id:
                        Number(
                            result.lastInsertRowid
                        ),

                    userId:
                        Number(
                            userId
                        ),

                    auctionId:
                        Number(
                            auctionId
                        ),

                    amount:
                        numericAmount,

                    status:
                        "winning"
                },

                auction: {
                    currentBid:
                        numericAmount,

                    minimumBid:
                        numericAmount +
                        bidIncrement
                }
            };
        }
    );

//validates and places a bid

function placeBid({
    userId,
    auctionId,
    amount,
    expectedCurrentBid
}) {
    return placeBidTransaction({
        userId:
            Number(
                userId
            ),

        auctionId:
            Number(
                auctionId
            ),

        amount,

        expectedCurrentBid
    });
}

module.exports = {
    placeBid,
    getHighestBid,
    getUserBids
};