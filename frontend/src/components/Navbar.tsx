// src/components/Navbar.tsx

import React from 'react';

// Define the types for the data passed to Navbar
interface ProfileData {
    name: string;
    branch: string;
    avatarUrl: string;
}

interface Notification {
    id: number;
    message: string;
}

interface NavbarProps {
    toggleSidebar: () => void;
    profileData: ProfileData;
    notifications: Notification[];
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, profileData, notifications }) => {
    return (
        <header className="flex items-center justify-between h-20 px-6 bg-white border-b shadow-md sticky top-0 z-10">
            
            {/* Left side: Hamburger (Mobile) and Dashboard Title */}
            <div className="flex items-center space-x-4">
                <button 
                    className="text-gray-600 focus:outline-none md:hidden"
                    onClick={toggleSidebar}
                >
                    ☰
                </button>
                <h2 className="text-xl font-semibold text-gray-800 hidden sm:block">Branch Manager Dashboard</h2>
            </div>
            
            {/* Right Side: Notifications and Profile */}
            <div className="flex items-center space-x-6">
                
                {/* Notification Bell */}
                <button className="relative text-gray-500 hover:text-indigo-600 transition focus:outline-none">
                    {/* SVG icon for bell */}
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.674 6.702 6 9.351 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v2a3 3 0 11-6 0v-2m6 0H9" /></svg>
                    {notifications.length > 0 && (
                        <span className="absolute top-0 right-0 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white transform translate-x-1/2 -translate-y-1/2 bg-red-600 rounded-full">
                            {notifications.length}
                        </span>
                    )}
                </button>

                {/* Profile Data */}
                <div className="flex items-center space-x-3">
                    <div className="hidden text-right text-sm sm:block">
                        <p className="font-medium text-gray-800">{profileData.name}</p>
                        <p className="text-gray-500">{profileData.branch}</p>
                    </div>
                    <img 
                        src={profileData.avatarUrl || 'https://via.placeholder.com/40'} 
                        alt="Profile" 
                        className="w-10 h-10 rounded-full object-cover border-2 border-indigo-500"
                    />
                </div>
            </div>
        </header>
    );
};

export default Navbar;