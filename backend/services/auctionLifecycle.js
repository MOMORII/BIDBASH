//loads database services

const db =
    require("../database/db");

const notificationService =
    require("./notification");

//formats future sqlite dates

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

//loads active auctions that have expired

function getExpiredAuctions() {
    return db.prepare(`
        SELECT
            auctions.auction_id,
            auctions.listing_id,
            auctions.current_highest_bid,
            auctions.end_time,

            listings.seller_id,
            listings.title,
            listings.starting_price

        FROM auctions

        JOIN listings
            ON listings.listing_id =
                auctions.listing_id

        WHERE
            auctions.status =
                'active'

            AND datetime(
                auctions.end_time
            ) <= datetime(
                'now'
            )
    `).all();
}

//loads the winning bid

function getWinningBid(
    auctionId
) {
    return db.prepare(`
        SELECT
            bid_id,
            bidder_id,
            amount

        FROM bids

        WHERE
            auction_id = ?
            AND status = 'winning'

        ORDER BY
            amount DESC,
            placed_at ASC,
            bid_id ASC

        LIMIT 1
    `).get(
        Number(
            auctionId
        )
    );
}

//creates an order for a completed auction

function createOrder(
    auction,
    winningBid
) {
    const existingOrder =
        db.prepare(`
            SELECT
                order_id

            FROM orders

            WHERE
                auction_id = ?
        `).get(
            auction.auction_id
        );

    if (existingOrder) {
        return existingOrder.order_id;
    }

    const paymentDeadline =
        new Date();

    paymentDeadline.setDate(
        paymentDeadline.getDate() +
        3
    );

    const result =
        db.prepare(`
            INSERT INTO orders (
                auction_id,
                buyer_id,
                seller_id,
                final_amount,
                payment_deadline,
                status
            )

            VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                'awaiting-payment'
            )
        `).run(
            auction.auction_id,
            winningBid.bidder_id,
            auction.seller_id,
            Number(
                winningBid.amount
            ),
            formatDate(
                paymentDeadline
            )
        );

    return Number(
        result.lastInsertRowid
    );
}

//completes one expired auction

const completeAuctionTransaction =
    db.transaction(
        auction => {
            const winningBid =
                getWinningBid(
                    auction.auction_id
                );

            //ends auctions without bids

            if (!winningBid) {
                db.prepare(`
                    UPDATE auctions

                    SET
                        status = 'ended'

                    WHERE
                        auction_id = ?
                `).run(
                    auction.auction_id
                );

                db.prepare(`
                    UPDATE listings

                    SET
                        status = 'ended'

                    WHERE
                        listing_id = ?
                `).run(
                    auction.listing_id
                );

                notificationService
                    .createNotification({
                        userId:
                            auction.seller_id,

                        type:
                            "general",

                        title:
                            "Auction Ended",

                        message:
                            `${auction.title} ended without receiving a successful bid.`,

                        auctionId:
                            auction.auction_id,

                        orderId:
                            null
                    });

                return {
                    auctionId:
                        auction.auction_id,

                    result:
                        "unsold"
                };
            }

            //marks the winning bid

            db.prepare(`
                UPDATE bids

                SET
                    status = 'won'

                WHERE
                    bid_id = ?
            `).run(
                winningBid.bid_id
            );

            //marks all remaining bids as lost

            db.prepare(`
                UPDATE bids

                SET
                    status = 'lost'

                WHERE
                    auction_id = ?
                    AND bid_id != ?
            `).run(
                auction.auction_id,
                winningBid.bid_id
            );

            //ends the auction

            db.prepare(`
                UPDATE auctions

                SET
                    status = 'ended',
                    current_highest_bid = ?

                WHERE
                    auction_id = ?
            `).run(
                Number(
                    winningBid.amount
                ),
                auction.auction_id
            );

            //marks the listing as sold

            db.prepare(`
                UPDATE listings

                SET
                    status = 'sold'

                WHERE
                    listing_id = ?
            `).run(
                auction.listing_id
            );

            //creates the purchase order

            const orderId =
                createOrder(
                    auction,
                    winningBid
                );

            //notifies the winner

            notificationService
                .createNotification({
                    userId:
                        winningBid.bidder_id,

                    type:
                        "auction_won",

                    title:
                        "You Won!",

                    message:
                        `You won ${auction.title} for £${Number(
                            winningBid.amount
                        ).toFixed(2)}.`,

                    auctionId:
                        auction.auction_id,

                    orderId
                });

            //notifies the seller

            notificationService
                .createNotification({
                    userId:
                        auction.seller_id,

                    type:
                        "general",

                    title:
                        "Auction Sold",

                    message:
                        `${auction.title} sold for £${Number(
                            winningBid.amount
                        ).toFixed(2)}.`,

                    auctionId:
                        auction.auction_id,

                    orderId
                });

            //loads losing bidders

            const losingBidders =
                db.prepare(`
                    SELECT DISTINCT
                        bidder_id

                    FROM bids

                    WHERE
                        auction_id = ?
                        AND bidder_id != ?
                `).all(
                    auction.auction_id,
                    winningBid.bidder_id
                );

            //notifies losing bidders

            losingBidders.forEach(
                bidder => {
                    notificationService
                        .createNotification({
                            userId:
                                bidder.bidder_id,

                            type:
                                "auction_lost",

                            title:
                                "Auction Ended",

                            message:
                                `${auction.title} has ended with another bidder winning.`,

                            auctionId:
                                auction.auction_id,

                            orderId:
                                null
                        });
                }
            );

            return {
                auctionId:
                    auction.auction_id,

                result:
                    "sold",

                winnerId:
                    winningBid.bidder_id,

                orderId
            };
        }
    );

//processes all expired auctions

function processExpiredAuctions() {
    const expiredAuctions =
        getExpiredAuctions();

    return expiredAuctions.map(
        auction =>
            completeAuctionTransaction(
                auction
            )
    );
}

module.exports = {
    processExpiredAuctions
};