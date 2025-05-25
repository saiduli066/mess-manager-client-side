import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
    Home,
    UtensilsCrossed,
    Users,
    PlusCircle,
    BarChart3,
    User,
    Menu,
    X
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const navItems = [
    { to: '/home', label: 'Home', icon: <Home className="h-5 w-5" /> },
    { to: '/add-meal', label: 'Add Meal Count', icon: <UtensilsCrossed className="h-5 w-5" /> },
    { to: '/add-member', label: 'Add Member', icon: <Users className="h-5 w-5" /> },
    { to: '/add-deposit', label: 'Add Deposit', icon: <PlusCircle className="h-5 w-5" /> },
    { to: '/reports', label: 'Reports', icon: <BarChart3 className="h-5 w-5" /> },
    { to: '/profile', label: 'My Profile', icon: <User className="h-5 w-5" /> },
];

const Sidebar = () => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <>
            {/* Mobile Toggle Button */}
            <button
                className="md:hidden fixed top-4 left-4 z-[999] p-2 bg-[#0F1729] rounded-md"
                onClick={() => setIsOpen(true)}
            >
                <Menu className="h-6 w-6 text-white" />
            </button>

            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/50 z-40 md:hidden"
                    onClick={() => setIsOpen(false)}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed md:relative inset-y-0 left-0 w-64 bg-[#0F1729] text-white z-50 transform ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
                    } transition-transform duration-300 ease-in-out`}
            >
                <div className="h-full flex flex-col">

                    {/* Sidebar Header */}
                    <div className="p-4 text-xl font-bold border-b border-white/10 flex justify-between items-center">
                        <span>MM <span className="text-[#7E22CE]">Mess Manager</span></span>
                        <button
                            className="md:hidden p-1"
                            onClick={() => setIsOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </button>
                    </div>

                    {/* Navigation Links */}
                    <nav className="flex-1 overflow-y-auto px-2 py-4 flex flex-col gap-2">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.to}
                                to={item.to}
                                onClick={() => setIsOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium ${isActive ? 'bg-white/10' : 'hover:bg-white/10'
                                    }`
                                }
                            >
                                <span className='text-[#9333EA]'>{item.icon}</span>   
                                {item.label}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Profile Section */}
                    <div className="p-4 border-t border-white/10">
                        <div className="flex items-center gap-3 mb-3">
                            <img
                                src="https://i.pravatar.cc/40"
                                alt="Profile"
                                className="w-8 h-8 rounded-full"
                            />
                            <div>
                                <p className="text-sm font-medium">John Doe</p>
                                <p className="text-xs text-gray-400">Admin</p>
                            </div>
                        </div>
                        <Button variant="outline" className="w-full text-black">
                            Logout
                        </Button>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;