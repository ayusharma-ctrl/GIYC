"use server"
import prisma from "@/lib/prisma";

// returns users notifications
export async function fetchNotifications(userId: string) {
    return await prisma.notification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' }
    })
}

// Mark a notification as read by ID
export async function markNotificationAsRead(userId: string, notificationId: string) {
    return await prisma.notification.update({
        where: { id: notificationId, userId },
        data: { isRead: true },
    });
}

// Delete a notification by ID
export async function deleteNotificationById(userId: string, notificationId: string) {
    return await prisma.notification.delete({
        where: { id: notificationId, userId },
    });
}

// Delete all notifications for a specific user
export async function deleteAllNotifications(userId: string) {
    return await prisma.notification.deleteMany({
        where: { userId },
    });
}