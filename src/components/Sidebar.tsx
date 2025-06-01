import { NavLink } from 'react-router-dom';
import logo from '../assets/UM-LOGO-1.svg';
import {
    Home,
    UtensilsCrossed,
    Users,
    PlusCircle,
    BarChart3,
    User,
    X,
    Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/store/useAuthStore';

const navItems = [
    { to: '/home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { to: '/add-meal', label: 'Add Meal Count', icon: <UtensilsCrossed className="h-5 w-5" /> },
    { to: '/add-member', label: 'Add Member', icon: <Users className="h-5 w-5" /> },
    { to: '/add-deposit', label: 'Add Deposit', icon: <PlusCircle className="h-5 w-5" /> },
    { to: '/reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5" /> },
    { to: '/profile', label: 'My Profile', icon: <User className="h-5 w-5" /> },
];
type SidebarProps = {
    isOpen: boolean;
    onClose: () => void;
};

const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
    const { logout, isLoggingOut, authUser } = useAuthStore();

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
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={onClose}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-white/10' : 'hover:bg-white/10'
                                    }`
                                }
                            >
                                <span className="text-[#9333EA]">{item.icon}</span>
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Profile Section */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <img src={authUser?.image} alt="Profile" className="w-8 h-8 rounded-full" />
                            <div>
                                <p className="text-sm font-medium">{authUser?.name}</p>
                                <p className="text-xs text-gray-400">{authUser?.email}</p>
                            </div>
                        </div>
                        <Button
                            disabled={isLoggingOut}
                            onClick={logout}
                            variant="outline"
                            className="w-full cursor-pointer text-black"
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
  