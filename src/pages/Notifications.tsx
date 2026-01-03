/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Bell,
    CheckCircle,
    AlertCircle,
    DollarSign,
    Receipt,
    Users,
    UtensilsCrossed,
    Clock,
    Filter,
    Calendar,
    CalendarDays,
    CheckCheck,
    Check,
} from "lucide-react";
import { axiosInstance } from "@/lib/axios";
import { toast } from "sonner";

interface NotificationData {
    performedBy?: {
        _id: string;
        name: string;
        image?: string;
    };
    amount?: number;
    billId?: string;
    billName?: string;
    entryType?: string;
}

interface Notification {
    _id: string;
    userId: string;
    messId: string;
    type: string;
    title: string;
    message: string;
    data?: NotificationData;
    isRead: boolean;
    createdAt: string;
}

interface Period {
    month: number;
    year: number;
    count: number;
    label: string;
    value: string;
}

const Notifications = () => {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [periods, setPeriods] = useState<Period[]>([]);
    const [selectedFilter, setSelectedFilter] = useState<string>("thisWeek");
    const [isLoading, setIsLoading] = useState(true);
    const [unreadCount, setUnreadCount] = useState(0);

    useEffect(() => {
        fetchPeriods();
        fetchNotifications("thisWeek");
        fetchUnreadCount();
    }, []);

    const fetchPeriods = async () => {
        try {
            const response = await axiosInstance.get("/notifications/periods");
            setPeriods(response.data);
        } catch (error) {
            console.error("Error fetching periods:", error);
        }
    };

    const fetchNotifications = async (filter: string) => {
        try {
            setIsLoading(true);
            const response = await axiosInstance.get(
                `/notifications?filter=${filter}`
            );
            setNotifications(response.data);
            setUnreadCount(0); // Reset unread count as all are marked read

            // Show info toast if no notifications found for this filter
            if (response.data.length === 0) {
                const filterName = filter === "today"
                    ? "today"
                    : filter === "thisWeek"
                        ? "this week"
                        : filter === "thisMonth"
                            ? "this month"
                            : "this period";
                toast.info(`No notifications found for ${filterName}`);
            }
        } catch (error: any) {
            console.error("Error fetching notifications:", error);
            console.error("Error response:", error?.response?.data);
            console.error("Error status:", error?.response?.status);
            const errorMessage = error?.response?.data?.error || error?.response?.data?.message || "Failed to load notifications. Please try again.";
            toast.error(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUnreadCount = async () => {
        try {
            const response = await axiosInstance.get("/notifications/unread-count");
            setUnreadCount(response.data.count);
        } catch (error) {
            console.error("Error fetching unread count:", error);
        }
    };

    const handleFilterChange = (value: string) => {
        setSelectedFilter(value);
        fetchNotifications(value);
    };

    const handleMarkAllAsRead = async () => {
        try {
            await axiosInstance.patch("/api/v1/notifications/mark-all-read");
            setNotifications((prev) =>
                prev.map((notif) => ({ ...notif, isRead: true }))
            );
            setUnreadCount(0);
            toast.success("All notifications marked as read");
        } catch (error) {
            console.error("Error marking all as read:", error);
            toast.error("Failed to mark all as read");
        }
    };

    const markNotificationAsRead = async (notificationId: string) => {
        try {
            await axiosInstance.patch(`/notifications/${notificationId}/read`);
            // Update local state
            setNotifications((prev) =>
                prev.map((notif) =>
                    notif._id === notificationId ? { ...notif, isRead: true } : notif
                )
            );
            // Update unread count
            setUnreadCount((prev) => Math.max(0, prev - 1));
            // Emit custom event to update sidebar count
            window.dispatchEvent(new CustomEvent('notificationRead'));
            toast.success("Notification marked as read");
        } catch (error: any) {
            toast.error("Failed to mark notification as read");
            console.error("Error marking notification as read:", error);
        }
    };

    const getTypeIcon = (type: string) => {
        switch (type) {
            case "meal_entry":
                return <UtensilsCrossed className="w-5 h-5 text-[#9D47DE]" />;
            case "deposit":
                return <DollarSign className="w-5 h-5 text-green-500" />;
            case "bill_created":
            case "bill_updated":
                return <Receipt className="w-5 h-5 text-blue-500" />;
            case "bill_payment":
                return <CheckCircle className="w-5 h-5 text-green-500" />;
            case "member_added":
            case "member_removed":
                return <Users className="w-5 h-5 text-orange-500" />;
            case "system":
                return <AlertCircle className="w-5 h-5 text-yellow-500" />;
            default:
                return <Bell className="w-5 h-5 text-gray-500" />;
        }
    };

    const formatTimestamp = (timestamp: string) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now.getTime() - date.getTime();
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        return date.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
        });
    };

    return (
        <div className="mx-2 my-1 min-h-screen p-1 md:p-2"
            style={{
                background: "linear-gradient(to bottom, #0F1729, #1A2332)",
            }}
        >
            <Card
                className="w-full shadow-2xl border-[#7E22CE]/30 rounded-2xl"
                style={{
                    backgroundColor: "#1A2332",
                    borderColor: "rgba(126, 34, 206, 0.3)",
                }}
            >
                <CardHeader className="border-b border-[#7E22CE]/20">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <CardTitle className="flex items-center gap-2 text-xl font-bold text-white">
                            <Bell className="w-6 h-6 text-[#7E22CE]" />
                            Notifications
                            {unreadCount > 0 && (
                                <span className="ml-2 px-2 py-1 text-xs bg-[#7E22CE] text-white rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </CardTitle>

                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-[#9D47DE]" />
                                <Select value={selectedFilter} onValueChange={handleFilterChange}>
                                    <SelectTrigger
                                        className="w-[180px] bg-[#0F1729] border-[#7E22CE]/30 text-white"
                                        style={{
                                            backgroundColor: "#0F1729",
                                            borderColor: "rgba(126, 34, 206, 0.3)",
                                        }}
                                    >
                                        <SelectValue placeholder="Filter by period" />
                                    </SelectTrigger>
                                    <SelectContent
                                        className="bg-[#1A2332] border-[#7E22CE]/30 text-white"
                                        style={{
                                            backgroundColor: "#1A2332",
                                            borderColor: "rgba(126, 34, 206, 0.3)",
                                        }}
                                    >
                                        <SelectItem
                                            value="today"
                                            className="hover:bg-[#7E22CE]/20 focus:bg-[#7E22CE]/20"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Calendar className="w-4 h-4" />
                                                Today
                                            </div>
                                        </SelectItem>
                                        <SelectItem
                                            value="thisWeek"
                                            className="hover:bg-[#7E22CE]/20 focus:bg-[#7E22CE]/20"
                                        >
                                            <div className="flex items-center gap-2">
                                                <Clock className="w-4 h-4" />
                                                This Week
                                            </div>
                                        </SelectItem>
                                        <SelectItem
                                            value="thisMonth"
                                            className="hover:bg-[#7E22CE]/20 focus:bg-[#7E22CE]/20"
                                        >
                                            <div className="flex items-center gap-2">
                                                <CalendarDays className="w-4 h-4" />
                                                This Month
                                            </div>
                                        </SelectItem>
                                        {periods.map((period) => (
                                            <SelectItem
                                                key={period.value}
                                                value={period.value}
                                                className="hover:bg-[#7E22CE]/20 focus:bg-[#7E22CE]/20"
                                            >
                                                {period.label} ({period.count})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            {unreadCount > 0 && (
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={handleMarkAllAsRead}
                                    className="border-[#7E22CE] text-[#7E22CE] hover:bg-[#7E22CE] hover:text-white"
                                >
                                    Mark all read
                                </Button>
                            )}
                        </div>
                    </div>
                </CardHeader>

                <CardContent className="pt-6">
                    {isLoading ? (
                        <div className="text-center py-16">
                            <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#7E22CE]"></div>
                            <p className="mt-4 text-gray-400">Loading notifications...</p>
                        </div>
                    ) : notifications.length === 0 ? (
                        <div className="text-center py-16">
                            <Bell className="w-16 h-16 mx-auto text-gray-600 mb-4" />
                            <p className="text-xl text-gray-400 mb-2">No notifications</p>
                            <p className="text-sm text-gray-500">
                                {selectedFilter === "today"
                                    ? "No notifications today!"
                                    : selectedFilter === "thisWeek"
                                        ? "You're all caught up for this week!" : selectedFilter === "thisMonth"
                                            ? "No notifications this month!" : "No notifications for this period"}
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {notifications.map((notif) => (
                                <Card
                                    key={notif._id}
                                    className={`p-4 border transition-all duration-200 hover:shadow-lg ${notif.isRead
                                        ? "bg-[#0F1729]/50 border-[#7E22CE]/10"
                                        : "bg-[#1A2332] border-[#7E22CE]/30 shadow-md"
                                        }`}
                                    style={{
                                        backgroundColor: notif.isRead
                                            ? "rgba(15, 23, 41, 0.5)"
                                            : "#1A2332",
                                        borderColor: notif.isRead
                                            ? "rgba(126, 34, 206, 0.1)"
                                            : "rgba(126, 34, 206, 0.3)",
                                    }}
                                >
                                    <div className="flex items-start gap-4">
                                        <div className="mt-1">{getTypeIcon(notif.type)}</div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-start justify-between gap-2 mb-1">
                                                <h3
                                                    className={`font-semibold ${notif.isRead ? "text-gray-400" : "text-white"
                                                        }`}
                                                >
                                                    {notif.title}
                                                </h3>
                                                <div className="flex items-center gap-2">
                                                    {!notif.isRead ? (
                                                        <>
                                                            <Button
                                                                size="sm"
                                                                variant="ghost"
                                                                onClick={() => markNotificationAsRead(notif._id)}
                                                                className="h-6 px-2 hover:bg-[#7E22CE]/20 text-[#9D47DE] hover:text-[#7E22CE]"
                                                                title="Mark as read"
                                                            >
                                                                <Check className="w-4 h-4" />
                                                            </Button>
                                                            <div className="w-2 h-2 bg-[#7E22CE] rounded-full flex-shrink-0 mt-1"></div>
                                                        </>
                                                    ) : (
                                                        <CheckCheck className="w-4 h-4 text-gray-500" />
                                                    )}
                                                </div>
                                            </div>
                                            <p
                                                className={`text-sm mb-2 ${notif.isRead ? "text-gray-500" : "text-gray-300"
                                                    }`}
                                            >
                                                {notif.message}
                                            </p>
                                            <div className="flex items-center gap-2 text-xs text-gray-500">
                                                <Clock className="w-3 h-3" />
                                                {formatTimestamp(notif.createdAt)}
                                            </div>
                                        </div>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default Notifications;
