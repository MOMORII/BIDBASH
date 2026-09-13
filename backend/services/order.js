//loads database services

const db =
    require("../database/db");

const notificationService =
    require("./notification");

//loads an order for its buyer

function getBuyerOrder(
    orderId,
    buyerId
) {
    return db.prepare(`
        SELECT
            orders.order_id,
            orders.auction_id,
            orders.buyer_id,
            orders.seller_id,
            orders.final_amount,
            orders.payment_deadline,
            orders.status,

            listings.title

        FROM orders

        JOIN auctions
            ON auctions.auction_id =
                orders.auction_id

        JOIN listings
            ON listings.listing_id =
                auctions.listing_id

        WHERE
            orders.order_id = ?
            AND orders.buyer_id = ?
    `).get(
        Number(orderId),
        Number(buyerId)
    );
}

//loads an order for its seller

function getSellerOrder(
    orderId,
    sellerId
) {
    return db.prepare(`
        SELECT
            orders.order_id,
            orders.auction_id,
            orders.buyer_id,
            orders.seller_id,
            orders.final_amount,
            orders.payment_deadline,
            orders.status,

            listings.title

        FROM orders

        JOIN auctions
            ON auctions.auction_id =
                orders.auction_id

        JOIN listings
            ON listings.listing_id =
                auctions.listing_id

        WHERE
            orders.order_id = ?
            AND orders.seller_id = ?
    `).get(
        Number(orderId),
        Number(sellerId)
    );
}

//records payment for a won auction

const payOrderTransaction =
    db.transaction(
        ({
            orderId,
            buyerId
        }) => {
            const order =
                getBuyerOrder(
                    orderId,
                    buyerId
                );

            if (!order) {
                return {
                    success: false,
                    status:
                        "not-found",
                    message:
                        "The order could not be found."
                };
            }

            if (
                order.status ===
                    "paid" ||
                order.status ===
                    "processing" ||
                order.status ===
                    "completed"
            ) {
                return {
                    success: false,
                    status:
                        "already-paid",
                    message:
                        "This order has already been paid."
                };
            }

            if (
                order.status !==
                "awaiting-payment"
            ) {
                return {
                    success: false,
                    status:
                        "unavailable",
                    message:
                        "This order cannot currently be paid."
                };
            }

            //records the successful payment

            db.prepare(`
                INSERT INTO payments (
                    order_id,
                    amount,
                    payment_date,
                    status
                )

                VALUES (
                    ?,
                    ?,
                    CURRENT_TIMESTAMP,
                    'paid'
                )

                ON CONFLICT(order_id)
                DO UPDATE SET
                    amount =
                        excluded.amount,
                    payment_date =
                        CURRENT_TIMESTAMP,
                    status =
                        'paid'
            `).run(
                order.order_id,
                Number(
                    order.final_amount
                )
            );

            //updates the order state

            db.prepare(`
                UPDATE orders

                SET
                    status = 'paid'

                WHERE
                    order_id = ?
            `).run(
                order.order_id
            );

            //prepares fulfilment for the seller

            db.prepare(`
                INSERT INTO fulfilments (
                    order_id,
                    status
                )

                VALUES (
                    ?,
                    'awaiting-dispatch'
                )

                ON CONFLICT(order_id)
                DO UPDATE SET
                    status =
                        'awaiting-dispatch'
            `).run(
                order.order_id
            );

            //notifies the seller

            notificationService
                .createNotification({
                    userId:
                        order.seller_id,

                    type:
                        "payment_received",

                    title:
                        "Payment Received",

                    message:
                        `Payment of £${Number(
                            order.final_amount
                        ).toFixed(2)} has been received for ${order.title}.`,

                    auctionId:
                        order.auction_id,

                    orderId:
                        order.order_id
                });

            return {
                success: true,
                status:
                    "paid",

                message:
                    "Payment completed successfully.",

                order: {
                    id:
                        order.order_id,

                    auctionId:
                        order.auction_id,

                    amount:
                        Number(
                            order.final_amount
                        ),

                    paymentStatus:
                        "paid",

                    fulfilmentStatus:
                        "awaiting-dispatch"
                }
            };
        }
    );

//marks an order as paid

function payOrder({
    orderId,
    buyerId
}) {
    return payOrderTransaction({
        orderId:
            Number(orderId),

        buyerId:
            Number(buyerId)
    });
}

//marks a paid order as dispatched

const dispatchOrderTransaction =
    db.transaction(
        ({
            orderId,
            sellerId,
            trackingReference
        }) => {
            const order =
                getSellerOrder(
                    orderId,
                    sellerId
                );

            if (!order) {
                return {
                    success: false,
                    status:
                        "not-found",
                    message:
                        "The order could not be found."
                };
            }

            if (
                order.status !==
                    "paid" &&
                order.status !==
                    "processing"
            ) {
                return {
                    success: false,
                    status:
                        "not-paid",
                    message:
                        "The order must be paid before it can be dispatched."
                };
            }

            const fulfilment =
                db.prepare(`
                    SELECT
                        fulfilment_id,
                        status

                    FROM fulfilments

                    WHERE
                        order_id = ?
                `).get(
                    order.order_id
                );

            if (
                fulfilment &&
                (
                    fulfilment.status ===
                        "dispatched" ||
                    fulfilment.status ===
                        "delivered"
                )
            ) {
                return {
                    success: false,
                    status:
                        "already-dispatched",
                    message:
                        "This order has already been dispatched."
                };
            }

            //updates fulfilment details

            db.prepare(`
                INSERT INTO fulfilments (
                    order_id,
                    tracking_reference,
                    dispatched_at,
                    status
                )

                VALUES (
                    ?,
                    ?,
                    CURRENT_TIMESTAMP,
                    'dispatched'
                )

                ON CONFLICT(order_id)
                DO UPDATE SET
                    tracking_reference =
                        excluded.tracking_reference,
                    dispatched_at =
                        CURRENT_TIMESTAMP,
                    status =
                        'dispatched'
            `).run(
                order.order_id,
                trackingReference ||
                    null
            );

            //updates the order state

            db.prepare(`
                UPDATE orders

                SET
                    status = 'processing'

                WHERE
                    order_id = ?
            `).run(
                order.order_id
            );

            //notifies the buyer

            notificationService
                .createNotification({
                    userId:
                        order.buyer_id,

                    type:
                        "item_dispatched",

                    title:
                        "Item Dispatched",

                    message:
                        `${order.title} has been marked as dispatched.`,

                    auctionId:
                        order.auction_id,

                    orderId:
                        order.order_id
                });

            return {
                success: true,
                status:
                    "dispatched",

                message:
                    "The order has been marked as dispatched.",

                order: {
                    id:
                        order.order_id,

                    auctionId:
                        order.auction_id,

                    trackingReference:
                        trackingReference ||
                        null,

                    fulfilmentStatus:
                        "dispatched"
                }
            };
        }
    );

//dispatches a seller order

function dispatchOrder({
    orderId,
    sellerId,
    trackingReference
}) {
    return dispatchOrderTransaction({
        orderId:
            Number(orderId),

        sellerId:
            Number(sellerId),

        trackingReference:
            trackingReference
                ? trackingReference.trim()
                : null
    });
}

//completes a delivered buyer order

const completeOrderTransaction =
    db.transaction(
        ({
            orderId,
            buyerId
        }) => {
            const order =
                getBuyerOrder(
                    orderId,
                    buyerId
                );

            if (!order) {
                return {
                    success: false,
                    status:
                        "not-found",
                    message:
                        "The order could not be found."
                };
            }

            if (
                order.status ===
                "completed"
            ) {
                return {
                    success: false,
                    status:
                        "already-completed",
                    message:
                        "This order has already been completed."
                };
            }

            if (
                order.status !==
                "processing"
            ) {
                return {
                    success: false,
                    status:
                        "not-dispatched",
                    message:
                        "The order must be dispatched before delivery can be confirmed."
                };
            }

            const fulfilment =
                db.prepare(`
                    SELECT
                        fulfilment_id,
                        status

                    FROM fulfilments

                    WHERE
                        order_id = ?
                `).get(
                    order.order_id
                );

            if (!fulfilment) {
                return {
                    success: false,
                    status:
                        "missing-fulfilment",
                    message:
                        "Fulfilment information could not be found."
                };
            }

            if (
                fulfilment.status !==
                "dispatched"
            ) {
                return {
                    success: false,
                    status:
                        "not-dispatched",
                    message:
                        "This item has not been marked as dispatched."
                };
            }

            //marks fulfilment as delivered

            db.prepare(`
                UPDATE fulfilments

                SET
                    status = 'delivered',
                    completed_at =
                        CURRENT_TIMESTAMP

                WHERE
                    order_id = ?
            `).run(
                order.order_id
            );

            //completes the order

            db.prepare(`
                UPDATE orders

                SET
                    status = 'completed'

                WHERE
                    order_id = ?
            `).run(
                order.order_id
            );

            //notifies the seller

            notificationService
                .createNotification({
                    userId:
                        order.seller_id,

                    type:
                        "general",

                    title:
                        "Delivery Confirmed",

                    message:
                        `The buyer confirmed delivery of ${order.title}.`,

                    auctionId:
                        order.auction_id,

                    orderId:
                        order.order_id
                });

            return {
                success: true,

                status:
                    "completed",

                message:
                    "Delivery confirmed successfully.",

                order: {
                    id:
                        order.order_id,

                    auctionId:
                        order.auction_id,

                    orderStatus:
                        "completed",

                    fulfilmentStatus:
                        "delivered"
                }
            };
        }
    );

//confirms buyer delivery

function completeOrder({
    orderId,
    buyerId
}) {
    return completeOrderTransaction({
        orderId:
            Number(orderId),

        buyerId:
            Number(buyerId)
    });
}

module.exports = {
    getBuyerOrder,
    getSellerOrder,
    payOrder,
    dispatchOrder,
    completeOrder
};