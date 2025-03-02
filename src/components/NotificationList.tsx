"use client";

import { Notification } from "@/lib/types";
import { formatDistanceToNow } from "date-fns";
import { Check, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";

interface NotificationListProps {
    notifications: Notification[];
    onMarkAsRead: (id: string) => void;
    onDelete: (id: string) => void;
}

export function NotificationList({
    notifications,
    onMarkAsRead,
    onDelete
}: NotificationListProps) {
    if (notifications.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[300px] text-muted-foreground">
                <div className="text-4xl mb-2">🔔</div>
                <p>No notifications yet</p>
            </div>
        );
    }

    return (
        <div className="mt-2 space-y-4 max-h-[80vh] overflow-y-auto px-2">
            <AnimatePresence initial={false}>
                {notifications.map((notification) => (
                    <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                        animate={{ opacity: 1, height: "auto", marginBottom: 16 }}
                        exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                        transition={{ duration: 0.2 }}
                        className={`p-4 rounded-lg border ${notification.isRead ? "bg-background" : "bg-primary/5 border-primary/20"
                            }`}
                    >
                        <div className="flex gap-3">
                            <div className="text-2xl">{notification.icon}</div>
                            <div className="flex-1">
                                <div className="flex justify-between items-start">
                                    <h3 className="font-medium">{notification.message}</h3>
                                    <div className="flex gap-1">
                                        {!notification.isRead && (
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                className="h-6 w-6 text-green-500 cursor-pointer"
                                                onClick={() => onMarkAsRead(notification.id)}
                                                title="Mark as read"
                                            >
                                                <Check className="h-4 w-4" />
                                            </Button>
                                        )}
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive cursor-pointer"
                                            onClick={() => onDelete(notification.id)}
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                                <p className="text-sm text-muted-foreground mt-1">
                                    {notification.message}
                                </p>
                                <p className="text-xs text-muted-foreground mt-2">
                                    {formatDistanceToNow(notification.createdAt, { addSuffix: true })}
                                </p>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}