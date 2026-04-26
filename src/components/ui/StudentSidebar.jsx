import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    BookOpen,
    BookMarked,
    Search,
    LogOut,
    ChevronLeft,
    ChevronRight,
    GraduationCap,
} from 'lucide-react';
import { signOut } from '../../auth';

const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, path: '/student/dashboard' },
    { label: 'View Books', icon: BookOpen, path: '/student/books' },
    { label: 'My Issued Books', icon: BookMarked, path: '/student/issued' },
    { label: 'Search Books', icon: Search, path: '/student/search' },
];

const StudentSidebar = ({ collapsed, setCollapsed, mobileOpen, setMobileOpen }) => {
    const navigate = useNavigate();

    const handleLogout = async () => {
        await signOut();
        navigate('/login');
    };

    return (
        <>
            {mobileOpen && (
                <div 
                    className="fixed inset-0 bg-black/50 z-30 md:hidden transition-opacity" 
                    onClick={() => setMobileOpen(false)}
                />
            )}
            <aside
                className={`fixed top-0 left-0 h-screen bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 shadow-sm flex flex-col transition-all duration-300 z-40 ${mobileOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'} ${collapsed ? 'md:w-20' : 'md:w-64'} w-64`}
                aria-label="Student sidebar navigation"
        >
            {/* Brand */}
            <div className="flex items-center gap-3 px-5 py-5 border-b border-gray-100 dark:border-gray-700">
                <GraduationCap className="w-8 h-8 text-primary flex-shrink-0" />
                {!collapsed && (
                    <span className="text-lg font-bold text-text dark:text-slate-100 whitespace-nowrap">
                        Library Student
                    </span>
                )}
            </div>

            {/* Navigation */}
            <nav className="flex-1 py-4 overflow-y-auto" aria-label="Student navigation">
                <ul className="space-y-1 px-3">
                    {navItems.map((item) => (
                        <li key={item.path}>
                            <NavLink
                                to={item.path}
                                onClick={() => setMobileOpen(false)}
                                className={({ isActive }) =>
                                    `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${isActive
                                        ? 'bg-primary/10 text-primary dark:bg-primary/20'
                                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-text dark:hover:text-slate-100'
                                    }`
                                }
                                aria-label={item.label}
                            >
                                <item.icon className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                                {!collapsed && <span>{item.label}</span>}
                            </NavLink>
                        </li>
                    ))}
                </ul>
            </nav>

            {/* Footer */}
            <div className="border-t border-gray-100 dark:border-gray-700 p-3 space-y-1">
                <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm font-medium text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-all duration-200 group"
                    aria-label="Logout"
                >
                    <LogOut className="w-5 h-5 flex-shrink-0 transition-transform duration-200 group-hover:scale-110" />
                    {!collapsed && <span>Logout</span>}
                </button>

                <button
                    onClick={() => setCollapsed(!collapsed)}
                    className="flex items-center justify-center w-full py-2 rounded-lg text-gray-400 dark:text-gray-500 hover:bg-gray-50 dark:hover:bg-gray-800 hover:text-text dark:hover:text-slate-100 transition-all duration-200"
                    aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
                >
                    {collapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}
                </button>
            </div>
        </aside>
        </>
    );
};

export default StudentSidebar;
