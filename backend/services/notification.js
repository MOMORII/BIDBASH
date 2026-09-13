//loads temporary notification data

const notifications =
    require("../data/mockNotifications");

//creates a notification

function createNotification({
    userId,
    type,
    title,
    message,
    auctionId = null,
    orderId = null
}) {
    const notification = {
        id:
            notifications.length + 1,
        userId:
            Number(userId),
        type,
        title,
        message,
        auctionId,
        orderId,
        read: false,
        createdAt:
            new Date()
    };

    notifications.push(
        notification
    );

    return notification;
}

//returns unread notifications

function getUnreadNotifications(
    userId
) {
    return notifications.filter(
        notification =>
            notification.userId ===
                Number(userId) &&
            !notification.read
    );
}

//finds one notification

function getNotificationById(
    id
) {
    return notifications.find(
        notification =>
            notification.id ===
            Number(id)
    );
}

//marks a notification as read

function markAsRead(
    id,
    userId
) {
    const notification =
        getNotificationById(id);

    if (
        !notification ||
        notification.userId !==
            Number(userId)
    ) {
        return null;
    }

    notification.read = true;

    return notification;
}

module.exports = {
    createNotification,
    getUnreadNotifications,
    getNotificationById,
    markAsRead
};