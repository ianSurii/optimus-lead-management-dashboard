// src/components/Navbar.tsx

import React, { useState, useEffect, useRef } from 'react';
import { fetchUserProfile, fetchNotifications } from '../api/sessionApi';
import { IUserProfile, INotification } from '../types/User';
import Logo from './Logo';

interface NavbarProps {
    toggleSidebar: () => void;
    activeModule: 'lead' | 'marketing' | 'campaigns' | 'studio';
    setActiveModule: (module: 'lead' | 'marketing' | 'campaigns' | 'studio') => void;
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, activeModule, setActiveModule }) => {
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');

    const notificationRef = useRef<HTMLDivElement>(null);
    const profileRef = useRef<HTMLDivElement>(null);

    // Module navigation routes
    const moduleRoutes = {
        lead: '/',
        marketing: '/marketing',
        campaigns: '/campaigns',
        studio: '/studio',
    };

    const handleModuleChange = (module: 'lead' | 'marketing' | 'campaigns' | 'studio') => {
        setActiveModule(module);
        window.location.href = moduleRoutes[module];
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                const [profile, notifs] = await Promise.all([
                    fetchUserProfile(),
                    fetchNotifications()
                ]);
                setUserProfile(profile);
                setNotifications(notifs);
            } catch (error) {
                console.error('Failed to load navbar data:', error);
            }
        };
        loadData();
    }, []);

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <header className="bg-white border-b shadow-sm" style={{ height: '64px' }}>
            <div className="flex items-center justify-between h-full">
                
                {/* Left side: Logo (Desktop), Hamburger (Mobile) and Module Navigation */}
                <div className="flex items-center h-full">
                    <button 
                        className="text-gray-600 focus:outline-none md:hidden ml-6"
                        onClick={toggleSidebar}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="hidden md:flex items-center h-full" style={{ backgroundColor: '#525BFE', width: '256px', paddingLeft: '24px' }}>
                        <Logo />
                    </div>

                    {/* Module Navigation */}
                    <div className="hidden md:flex items-center space-x-1 ml-6">
                        <button
                            onClick={() => handleModuleChange('lead')}
                            className={`px-4 py-5 text-sm font-medium transition-colors relative ${
                                activeModule === 'lead'
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Lead Management
                            {activeModule === 'lead' && (
                                <span className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#5058FD' }}></span>
                            )}
                        </button>
                        <button
                            onClick={() => handleModuleChange('marketing')}
                            className={`px-4 py-5 text-sm font-medium transition-colors relative ${
                                activeModule === 'marketing'
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Marketing Automation
                            {activeModule === 'marketing' && (
                                <span className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#5058FD' }}></span>
                            )}
                        </button>
                        <button
                            onClick={() => handleModuleChange('campaigns')}
                            className={`px-4 py-5 text-sm font-medium transition-colors relative ${
                                activeModule === 'campaigns'
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Campaigns
                            {activeModule === 'campaigns' && (
                                <span className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#5058FD' }}></span>
                            )}
                        </button>
                        <button
                            onClick={() => handleModuleChange('studio')}
                            className={`px-4 py-5 text-sm font-medium transition-colors relative ${
                                activeModule === 'studio'
                                    ? 'text-gray-900'
                                    : 'text-gray-500 hover:text-gray-700'
                            }`}
                        >
                            Studio
                            {activeModule === 'studio' && (
                                <span className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#5058FD' }}></span>
                            )}
                        </button>
                    </div>
                </div>

                {/* Search Bar - centered between nav items and right side */}
                <div className="flex-1 flex items-center justify-center px-6">
                    <div className="flex items-center bg-gray-100 rounded-full px-4 py-2 w-full max-w-2xl">
                        <svg className="w-4 h-4 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                        <input 
                            type="text"
                            placeholder="Search..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="bg-transparent border-none outline-none text-sm text-gray-700 placeholder-gray-400 w-full"
                        />
                    </div>
                </div>

                {/* Right Side: Notifications, Profile */}
                <div className="flex items-center space-x-4 pr-6">

                    {/* Notification Bell */}
                    <div className="relative" ref={notificationRef}>
                        <button 
                            className="relative text-gray-500 hover:text-gray-700 transition focus:outline-none"
                            onClick={() => setShowNotifications(!showNotifications)}
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.674 6.702 6 9.351 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v2a3 3 0 11-6 0v-2m6 0H9" />
                            </svg>
                            {unreadCount > 0 && (
                                <span className="absolute -top-1 -right-1 inline-flex items-center justify-center w-5 h-5 text-xs font-bold text-white bg-red-600 rounded-full">
                                    {unreadCount}
                                </span>
                            )}
                        </button>

                        {/* Notifications Dropdown */}
                        {showNotifications && (
                            <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto">
                                <div className="px-4 py-2 border-b border-gray-200">
                                    <h3 className="text-sm font-semibold text-gray-800">Notifications</h3>
                                </div>
                                {notifications.length > 0 ? (
                                    notifications.map((notif) => (
                                        <a
                                            key={notif.id}
                                            href={notif.link}
                                            className={`block px-4 py-3 hover:bg-gray-50 transition ${!notif.read ? 'bg-blue-50' : ''}`}
                                        >
                                            <div className="flex items-start">
                                                <span className="text-xl mr-3">{notif.type === 'alert' ? '🔔' : '📬'}</span>
                                                <div className="flex-1">
                                                    <p className="text-sm text-gray-800">{notif.message}</p>
                                                    <p className="text-xs text-gray-500 mt-1">
                                                        {new Date(notif.timestamp).toLocaleString()}
                                                    </p>
                                                </div>
                                                {!notif.read && (
                                                    <span className="w-2 h-2 bg-blue-600 rounded-full ml-2 mt-1"></span>
                                                )}
                                            </div>
                                        </a>
                                    ))
                                ) : (
                                    <div className="px-4 py-6 text-center text-gray-500 text-sm">
                                        No notifications
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Profile Dropdown */}
                    <div className="relative" ref={profileRef}>
                        <button
                            className="flex items-center space-x-3 focus:outline-none"
                            onClick={() => setShowProfile(!showProfile)}
                        >
                            <img 
                                src='/logo-sm.png'
                                alt="Profile" 
                                className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                                loading="eager"
                                // onError={(e) => {
                                //     (e.target as HTMLImageElement).src = 'https://via.placeholder.com/40';
                                // }}
                            />
                            {userProfile && (
                                <span className="text-sm text-gray-500">
                                    {userProfile.first_name} {userProfile.last_name}
                                </span>
                            )}
                            <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                      

                        {/* Profile Dropdown */}
                        {showProfile && userProfile && (
                            <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2">
                                <div className="px-4 py-3 border-b border-gray-200">
                                    <p className="font-semibold text-gray-800">
                                        {userProfile.first_name} {userProfile.last_name}
                                    </p>
                                    <p className="text-sm text-gray-500">{userProfile.role}</p>
                                    <p className="text-xs text-gray-400 mt-1">ID: {userProfile.user_id}</p>
                                </div>
                                <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    View Profile
                                </a>
                                <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
                                    Settings
                                </a>
                                <button className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-50">
                                    Sign Out
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Navbar;