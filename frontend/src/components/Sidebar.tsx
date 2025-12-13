// src/components/Sidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';

// Define Props for the Sidebar component
interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const location = useLocation();
    const navItems = [
        { name: 'Dashboard', path: '/', icon: '📊' },
        { name: 'Transactions', path: '/transactions', icon: '📝' },
        { name: 'Agents', path: '/agents', icon: '👤' },
        { name: 'Settings', path: '/settings', icon: '⚙️' },
    ];

    return (
        <>
            {/* 1. Mobile Overlay */}
            <div 
                className={`fixed inset-0 z-20 bg-gray-900/50 md:hidden transition-opacity ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`} 
                onClick={toggleSidebar}
            ></div>

            {/* 2. Main Sidebar */}
            <div className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-800 text-white transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                
                <div className="flex items-center justify-center h-20 border-b border-gray-700">
                    <h1 className="text-2xl font-bold text-indigo-400">DASHBOARD</h1>
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map(item => (
                        <Link 
                            key={item.name} 
                            to={item.path}
                            className={`flex items-center p-3 rounded-lg transition-colors duration-200 ${location.pathname === item.path ? 'bg-indigo-600 text-white shadow-lg' : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
                            onClick={toggleSidebar}
                        >
                            <span className="mr-3 text-lg">{item.icon}</span>
                            {item.name}
                        </Link>
                    ))}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;