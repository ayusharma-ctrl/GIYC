"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Globe, Bell, Sun, Moon } from "lucide-react";
import { motion } from "framer-motion";
import { useTheme } from "next-themes";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Notification } from "@/lib/types";
import { NotificationList } from "@/components/NotificationList";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/store";
import { logout } from "@/app/actions/auth";
import { signOut } from "@/store/slices/authSlice";
import { deleteAllNotifications, deleteNotificationById, fetchNotifications, markNotificationAsRead } from "@/app/actions/notification";
import { toast } from "sonner";

export function Header() {
    const { isAuthenticated } = useSelector((state: RootState) => state.auth);
    const [scrolled, setScrolled] = useState(false);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);
    const [notifications, setNotifications] = useState<Notification[]>([]);

    const { userId } = useSelector((state: RootState) => state.auth);

    const dispatch = useDispatch();

    const getNotifications = async () => {
        if (!userId) return;
        const data = await fetchNotifications(userId);
        if (data?.length > 0) {
            setNotifications(data);
        }
    }

    useEffect(() => {
        getNotifications();
    }, []);

    // Count unread notifications
    const unreadCount = notifications.filter(n => !n.isRead).length;

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);


    // method to delete all notifications
    const handleClearAll = async () => {
        if (!userId) return;
        setNotifications([]);
        await deleteAllNotifications(userId);
    };


    // mark as read
    const handleMarkAsRead = async (id: string) => {
        if (!userId) return;
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, isRead: true }
                    : notification
            )
        );
        await markNotificationAsRead(userId, id);
        toast.success("Marked as Read");
    };


    // handle delete notification
    const handleDelete = async (id: string) => {
        if (!userId) return;
        setNotifications(prev =>
            prev.filter(notification => notification.id !== id)
        );
        await deleteNotificationById(userId, id);
    };


    // method to signout user and redirect
    const handleSignout = async () => {
        dispatch(signOut());
        await logout();
    }

    return (
        <motion.header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-background/80 backdrop-blur-md shadow-md" : "bg-transparent"
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 15 }}
        >
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-2">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.8 }}
                    >
                        <Globe className="h-8 w-8 text-primary" />
                    </motion.div>
                    <motion.span
                        className="font-bold text-xl tracking-tight"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        GIYC
                    </motion.span>
                </Link>

                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-center gap-3"
                >
                    {mounted && (
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="text-primary cursor-pointer mt-1.5 -mr-1"
                        >
                            {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                        </Button>
                    )}

                    {isAuthenticated && (
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="ghost" size="icon" className="relative cursor-pointer mt-2">
                                    <Bell className="h-5 w-5" />
                                    {unreadCount > 0 && (
                                        <Badge
                                            className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 bg-primary text-primary-foreground"
                                        >
                                            {unreadCount}
                                        </Badge>
                                    )}
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="w-[350px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle className="flex justify-between items-center mt-8">
                                        <span>Notifications ({notifications.length}) </span>
                                        {notifications.length > 0 && (
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={handleClearAll}
                                                className="text-xs cursor-pointer"
                                            >
                                                Clear all
                                            </Button>
                                        )}
                                    </SheetTitle>
                                </SheetHeader>
                                <NotificationList
                                    notifications={notifications}
                                    onMarkAsRead={handleMarkAsRead}
                                    onDelete={handleDelete}
                                />
                            </SheetContent>
                        </Sheet>
                    )}


                    <Button
                        asChild
                        variant="outline"
                        className="font-medium ml-2 cursor-pointer"
                        onClick={isAuthenticated ? handleSignout : () => { }}
                    >
                        {isAuthenticated ? <span>Sign Out</span> : (
                            <Link href="/auth">Sign In</Link>
                        )}
                    </Button>
                </motion.div>
            </div>
        </motion.header>
    );
}