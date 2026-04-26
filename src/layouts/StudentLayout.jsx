import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import StudentSidebar from '../components/ui/StudentSidebar';
import Header from '../components/ui/Header';

const StudentLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const [mobileOpen, setMobileOpen] = useState(false);

    return (
        <div className="flex min-h-screen bg-background dark:bg-gray-950 transition-colors duration-300">
            <StudentSidebar 
                collapsed={collapsed} 
                setCollapsed={setCollapsed} 
                mobileOpen={mobileOpen} 
                setMobileOpen={setMobileOpen} 
            />
            <div className={`flex-1 transition-all duration-300 flex flex-col min-w-0 ${collapsed ? 'md:ml-20' : 'md:ml-64'} ml-0`}>
                <Header title="Student Dashboard" onMenuClick={() => setMobileOpen(true)} />
                <main className="flex-1 p-4 sm:p-6 max-w-[1200px] w-full mx-auto animate-fade-in overflow-x-hidden">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default StudentLayout;
