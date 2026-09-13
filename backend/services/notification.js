//loads the bidbash database

const db =
    require("../database/db");

//creates a notification

function createNotification({
    userId,
    type,
    title,
    message,
    auctionId = null,
    orderId = null
}) {
    const result =
        db.prepare(`
            INSERT INTO notifications (
                user_id,
                auction_id,
                order_id,
                title,
                message,
                notification_type,
                is_read
            )

            VALUES (
                ?,
                ?,
                ?,
                ?,
                ?,
                ?,
                0
            )
        `).run(
            Number(userId),
            auctionId === null
                ? null
                : Number(
                    auctionId
                ),
            orderId === null
                ? null
                : Number(
                    orderId
                ),
            title,
            message,
            type
        );

    return getNotificationById(
        result.lastInsertRowid
    );
}

//returns unread notifications

function getUnreadNotifications(
    userId
) {
    return db.prepare(`
        SELECT
            notification_id,
            user_id,
            auction_id,
            order_id,
            title,
            message,
            notification_type,
            created_at,
            is_read

        FROM notifications

        WHERE
            user_id = ?
            AND is_read = 0

        ORDER BY
            created_at DESC,
            notification_id DESC
    `).all(
        Number(userId)
    ).map(
        mapNotification
    );
}

//finds one notification

function getNotificationById(
    id
) {
    const row =
        db.prepare(`
            SELECT
                notification_id,
                user_id,
                auction_id,
                order_id,
                title,
                message,
                notification_type,
                created_at,
                is_read

            FROM notifications

            WHERE
                notification_id = ?
        `).get(
            Number(id)
        );

    return mapNotification(
        row
    );
}

//marks a notification as read

function markAsRead(
    id,
    userId
) {
    const result =
        db.prepare(`
            UPDATE notifications

            SET
                is_read = 1

            WHERE
                notification_id = ?
                AND user_id = ?
        `).run(
            Number(id),
            Number(userId)
        );

    if (
        result.changes === 0
    ) {
        return null;
    }

    return getNotificationById(
        id
    );
}

//maps database notifications

function mapNotification(
    row
) {
    if (!row) {
        return null;
    }

    return {
        id:
            row.notification_id,

        userId:
            row.user_id,

        auctionId:
            row.auction_id,

        orderId:
            row.order_id,

        title:
            row.title,

        message:
            row.message,

        type:
            row.notification_type,

        read:
            Boolean(
                row.is_read
            ),

        createdAt:
            row.created_at
    };
}

module.exports = {
    createNotification,
    getUnreadNotifications,
    getNotificationById,
    markAsRead
};