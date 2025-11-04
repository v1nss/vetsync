import { Link, useLocation } from 'react-router-dom';
import { FaRegHeart } from 'react-icons/fa';
import { RiHomeLine, RiMessageLine, RiCalendar2Line, RiListSettingsLine } from "react-icons/ri";
import { useAuth } from "../context/AuthContext";

function MobileNavBar() {
    const location = useLocation();
    const navItems = [
        { to: '/dashboard', icon: <RiHomeLine className="h-6 w-6" />, label: 'Home' },
        { to: '/inbox', icon: <RiMessageLine className="h-6 w-6" />, label: 'Inbox' },
        { to: '/appointment', icon: <RiCalendar2Line className="h-6 w-6" />, label: 'Appointment' },
        { to: '/settings', icon: <RiListSettingsLine className="h-6 w-6" />, label: 'Settings' },
    ];

    return (
        <div>
            <header className="px-4 py-2 sm:hidden shadow-md bg-white flex items-center justify-between h-16">
                <img src="/vetsync-logo-wname.png" alt="VetSync Logo" className="h-8" />
                <button aria-label="Favorites" className="p-2">
                    <FaRegHeart className="h-6 w-6 text-gray-600 hover:text-primary" />
                </button>
            </header>

            <nav className="fixed bottom-4 left-4 right-4 z-40 rounded-2xl bg-white border-t border-gray-200 shadow flex justify-around items-center h-16 sm:hidden">
                {navItems.map((item) => {
                    const active = location.pathname === item.to || location.pathname.startsWith(item.to + '/');
                    return (
                        <Link
                            key={item.to}
                            to={item.to}
                            aria-label={item.label}
                            className={`flex flex-col items-center justify-center text-xs font-medium px-2 pt-2 pb-1 transition-colors duration-150 ${active ? 'text-primary' : 'text-gray-500'}`}
                        >
                            {item.icon}
                            <span className="mt-1">{item.label}</span>
                        </Link>
                    );
                })}
            </nav>
        </div>
    );
}

export default function Navbar() {
    const { isAuthenticated, logout } = useAuth();

    if (isAuthenticated) {
        return (
            <>
                <nav className="sticky top-0 z-30 bg-white shadow-md hidden sm:block">
                    <div className="mx-auto px-base sm:px-large lg:px-custom-large">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="shrink-0 flex items-center">
                                    <img className="h-8 w-auto" src="/vetsync-logo-wname.png" alt="VetSync Logo" />
                                </div>
                            </div>
                            <div className="flex items-center">
                                <Link to="/dashboard" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                                    Dashboard
                                </Link>
                                <Link to="/profile" className="ml-4 text-gray-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                                    Profile
                                </Link>
                                <button onClick={() => logout()} className="ml-4 bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#FEA08E] transition">
                                    Logout
                                </button>
                            </div>
                        </div>
                    </div>
                </nav>
                {/* Mobile bottom nav */}
                <MobileNavBar />
            </>
        );
    }

    // Public (unauthenticated) navbar
    return (
        <>
            <nav className="sticky top-0 z-30 bg-white shadow-md">
                <div className="mx-auto px-base sm:px-large lg:px-custom-large">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="shrink-0 flex items-center">
                                <img className="h-8 w-auto" src="/vetsync-logo-wname.png" alt="VetSync Logo" />
                            </div>
                        </div>
                        <div className="flex items-center">
                            <Link to="/login" className="text-gray-800 hover:text-primary px-3 py-2 rounded-md text-sm font-medium">
                                Login
                            </Link>
                            <Link to="/register" className="ml-4 bg-primary text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#FEA08E] transition">
                                Sign Up
                            </Link>
                        </div>
                    </div>
                </div>
            </nav>
        </>
    );
}