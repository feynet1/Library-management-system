import React from 'react';
import { Bell, Search, UserCircle, Sun, Moon, Menu } from 'lucide-react';
import useTheme from '../../hooks/useTheme';
import useAuth from '../../hooks/useAuth';

const Header = ({ title, onMenuClick }) => {
    const { isDark, toggleTheme } = useTheme();
    const { profile } = useAuth();

    const userName = profile?.full_name || 'User';
    const userEmail = profile?.email || '';

    return (
        <header className="sticky top-0 z-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between transition-colors duration-300">
            <div className="flex items-center gap-3">
                {onMenuClick && (
                    <button
                        onClick={onMenuClick}
                        className="md:hidden p-2 -ml-2 rounded-lg text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                        aria-label="Open menu"
                    >
                        <Menu className="w-6 h-6" />
                    </button>
                )}
                <h1 className="text-xl sm:text-2xl font-bold text-text dark:text-slate-100">{title || 'Admin Dashboard'}</h1>
            </div>

            <div className="flex items-center gap-3">
                {/* Search */}
                <div className="hidden sm:flex items-center bg-gray-50 dark:bg-gray-800 rounded-lg px-3 py-2 gap-2 border border-gray-200 dark:border-gray-700 focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all duration-200">
                    <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search..."
                        className="bg-transparent outline-none text-sm text-text dark:text-slate-200 placeholder:text-gray-400 dark:placeholder:text-gray-500 w-40"
                        aria-label="Search"
                    />
                </div>

                {/* Dark mode toggle */}
                <button
                    onClick={toggleTheme}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark
                        ? <Sun className="w-5 h-5 text-amber-400" />
                        : <Moon className="w-5 h-5 text-gray-500" />
                    }
                </button>

                {/* Notification */}
                <button
                    className="relative p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    aria-label="Notifications"
                >
                    <Bell className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                    <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>

                {/* Avatar */}
                <div className="flex items-center gap-2">
                    <UserCircle className="w-8 h-8 text-gray-400 dark:text-gray-500" />
                    <div className="hidden md:block">
                        <p className="text-sm font-medium text-text dark:text-slate-200 leading-tight">{userName}</p>
                        <p className="text-xs text-gray-400 dark:text-gray-500">{userEmail}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
