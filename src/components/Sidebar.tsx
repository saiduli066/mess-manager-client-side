import { NavLink } from 'react-router-dom';
import logo from '../assets/UM-LOGO-1.svg';
import {
    Home,
    // UtensilsCrossed,
    Users,
    PlusCircle,
    BarChart3,
    User,
    X,
    Loader2,
    UserCog2,
    // Settings2Icon,
    ShoppingCart,
    CalendarDays,
    CookingPotIcon,
    WarehouseIcon,
    Bell,
    Receipt,

} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';
import { Avatar, AvatarFallback } from './ui/avatar';
import { useState, useEffect } from 'react';
import { axiosInstance } from '@/lib/axios';

// Navigation items with optional adminOnly flag
const navItems = [
    // Primary Navigation - Most frequently used
    { to: '/home', label: 'Home', icon: <Home className="h-5 w-5" />, adminOnly: false },
    { to: '/my-meal-stat', label: 'My Meal Stats', icon: <CalendarDays className="h-5 w-5" />, adminOnly: false },
    { to: '/add-deposit', label: 'Add Deposit', icon: <PlusCircle className="h-5 w-5" />, adminOnly: false },

    // Mess Management - Admin and general
    { to: '/turn-meal-on/off', label: 'Add Meal', icon: <CookingPotIcon className="h-5 w-5" />, adminOnly: true },
    { to: '/bazar-notes', label: 'Bazar Notes', icon: <ShoppingCart className="h-5 w-5" />, adminOnly: false },
    { to: '/bills', label: 'Bills', icon: <Receipt className="h-5 w-5" />, adminOnly: false },
    { to: '/records', label: 'Records', icon: <BarChart3 className="h-5 w-5" />, adminOnly: false },

    // Member Management
    { to: '/add-member', label: 'Add Member', icon: <Users className="h-5 w-5" />, adminOnly: false },
    { to: '/admin-panel', label: 'Admin Panel', icon: <UserCog2 className="h-5 w-5" />, adminOnly: true },

    // Personal & Settings
    { to: '/my-mess', label: 'My Mess', icon: <WarehouseIcon className="h-5 w-5" />, adminOnly: false },
    { to: '/profile', label: 'My Profile', icon: <User className="h-5 w-5" />, adminOnly: false },
    { to: '/notification', label: 'Notifications', icon: <Bell className="h-5 w-5" />, adminOnly: false },
    // { to: '/settings', label: 'Settings', icon: <Settings2Icon className="h-5 w-5" />, adminOnly: false }, 
];
type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { logout, isLoggingOut, authUser } = useAuthStore();
    const [unreadCount, setUnreadCount] = useState(0);

    // Check if user is admin
    const isAdmin = authUser?.role === 'admin';

    // Filter navigation items based on user role
    const visibleNavItems = navItems.filter(item => !item.adminOnly || isAdmin);

    useEffect(() => {
        const fetchUnreadCount = async () => {
            try {
                const response = await axiosInstance.get("/notifications/unread-count");
                setUnreadCount(response.data.count);
            } catch (error) {
                console.error("Error fetching unread count:", error);
            }
        };

        if (authUser) {
            fetchUnreadCount();
            // Refresh count every 30 seconds
            const interval = setInterval(fetchUnreadCount, 30000);

            // Listen for notification read events
            const handleNotificationRead = () => {
                fetchUnreadCount();
            };
            window.addEventListener('notificationRead', handleNotificationRead);

            return () => {
                clearInterval(interval);
                window.removeEventListener('notificationRead', handleNotificationRead);
            };
        }
    }, [authUser]);

    return (
        <>
            {/* Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={onClose}
                    aria-hidden="true"
                />
            )}

            <aside
                className={`fixed md:relative inset-y-0 left-0 w-64 bg-[#0F1729] text-white z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    } transition-transform duration-300 ease-in-out`}
            >
                <div className="h-full flex flex-col">
                    {/* Sidebar Header */}
                    <div className="p-4 text-xl font-bold border-b border-white/10 flex justify-between items-center">
                        {/* Logo and Brand Name */}
                        <div className="flex items-center gap-2">
                            <img className="w-10 h-10 rounded-full" src={logo} alt="logo" />
                            <span>
                                Un<span className="text-purple-500">Mess</span>
                            </span>
                        </div>

                        {/* Mobile Close Button */}
                        <button className="md:hidden p-1" onClick={onClose} aria-label="Close sidebar">
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* NavLinks */}
                    <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-2">
                        {visibleNavItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-white/10' : 'hover:bg-white/10'
                                    }`
                                }
                            >
                                <span className="text-[#9333EA] relative">
                                    {item.icon}
                                    {item.to === '/notification' && unreadCount > 0 && (
                                        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                                            {unreadCount > 9 ? '9+' : unreadCount}
                                        </span>
                                    )}
                                </span>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Profile Section */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <div className='ring-1 text-purple-600 rounded-full'>
                                {
                                    authUser?.image ? <>
                                        <img src={authUser?.image} alt="Profile" className="w-8 h-8 rounded-full" />
                                    </> : <Avatar>
                                        <AvatarFallback className="flex items-center justify-center w-full h-full bg-muted text-muted-foreground">
                                            <User className="w-10 h-10 text-gray-400" />
                                        </AvatarFallback></Avatar>
                                } </div>
                            <div>
                                <p className="text-sm font-medium">{authUser?.name}</p>
                                <p className="text-xs text-gray-400">{authUser?.email}</p>
                            </div>
                        </div>
                        <Button
                            disabled={isLoggingOut}
                            onClick={logout}
                            className="w-full cursor-pointer bg-[#FF6347] hover:bg-[#E5533D] text-white border-0"
                        >
                            {isLoggingOut ? (
                                <>
                                    <Loader2 className="animate-spin mr-2" /> Loading...
                                </>
                            ) : (
                                <>Logout</>
                            )}
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
