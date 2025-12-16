
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile, fetchNotifications } from '../../api/sessionApi';
import { IUserProfile, INotification } from '../../types/User';
import Logo from './Logo';
import SearchBar from './SearchBar';
import NotificationBell from './NotificationBell';
import ProfileDropdown from './ProfileDropdown';

interface NavbarProps {
    toggleSidebar: () => void;
    activeModule: 'lead' | 'marketing' | 'campaigns' | 'studio';
    setActiveModule: (module: 'lead' | 'marketing' | 'campaigns' | 'studio') => void;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
    
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, activeModule, setActiveModule, searchQuery = '', onSearchChange }) => {
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [notifications, setNotifications] = useState<INotification[]>([]);
    const navigate = useNavigate();

    // Module navigation routes
    const moduleRoutes = {
        lead: '/',
        marketing: '/marketing',
        campaigns: '/campaigns',
        studio: '/studio',
    };

    const handleModuleChange = (module: 'lead' | 'marketing' | 'campaigns' | 'studio') => {
        setActiveModule(module);
        navigate(moduleRoutes[module]); 
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

    return (
        <header className="bg-white border-b shadow-sm" style={{ height: '64px' }}>
            <div className="flex items-center justify-between h-full">
                
                {/* Left side: Logo (Desktop), Hamburger (Mobile) */}
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

                    {/* Module Navigation - Hidden on mobile, shown on desktop */}
                    <div className="hidden md:flex items-center space-x-1 ml-6">
                        <button
                            onClick={() => handleModuleChange('lead')}
                            className={`px-4 py-5 text-sm font-medium transition-colors relative whitespace-nowrap ${
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
                            className={`px-4 py-5 text-sm font-medium transition-colors relative whitespace-nowrap ${
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
                            className={`px-4 py-5 text-sm font-medium transition-colors relative whitespace-nowrap ${
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
                            className={`px-4 py-5 text-sm font-medium transition-colors relative whitespace-nowrap ${
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

                {/* Search Bar - Always visible */}
                <SearchBar 
                    value={searchQuery} 
                    onChange={(value) => onSearchChange?.(value)} 
                    placeholder="Search"
                />

                {/* Right Side: Notifications, Profile */}
                <div className="flex items-center space-x-2 md:space-x-4 pr-3 md:pr-6">
                    {/* Notification Bell */}
                    <NotificationBell notifications={notifications} />

                    {/* Profile Dropdown */}
                    <ProfileDropdown userProfile={userProfile} />
                </div>
            </div>
        </header>
    );
};

export default Navbar;