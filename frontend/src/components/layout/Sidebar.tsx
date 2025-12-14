// src/components/Sidebar.tsx

import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import Logo from './Logo';

// Define Props for the Sidebar component
interface SidebarProps {
    isOpen: boolean;
    toggleSidebar: () => void;
    activeModule: 'lead' | 'marketing' | 'campaigns' | 'studio';
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar, activeModule }) => {
    const location = useLocation();
    
    // Define menu items for each module
    const menusByModule = {
        lead: [
            { name: 'Dashboard', path: '/', badge: null, badgeColor: null },
            { name: 'Assigned Leads', path: '/assigned-by-me', badge: 200, badgeColor: 'bg-[#23E9B2]' },
            { name: 'Leads Assigned by Me', path: '/assigned-by-reps', badge: 20, badgeColor: 'bg-[#3EC9E7]' },
            { name: 'Upload Leads', path: '/upload-leads', badge: null, badgeColor: null },
            { name: 'Leads Follow-up', path: '/leads-followup', badge: null, badgeColor: null },
            { name: 'Add Leads', path: '/add-leads', badge: null, badgeColor: null },
        ],
        marketing: [
            { name: 'Marketing Automation', path: '/marketing', badge: null, badgeColor: null },
            { name: 'Email Campaigns', path: '/marketing/email', badge: 8, badgeColor: 'bg-blue-500' },
            { name: 'Analytics', path: '/marketing/analytics', badge: null, badgeColor: null },
            { name: 'Templates', path: '/marketing/templates', badge: null, badgeColor: null },
        ],
        campaigns: [
            { name: 'Campaigns', path: '/campaigns', badge: null, badgeColor: null },
            { name: 'Active Campaigns', path: '/campaigns/active', badge: 5, badgeColor: 'bg-green-500' },
            { name: 'Drafts', path: '/campaigns/drafts', badge: 3, badgeColor: 'bg-gray-500' },
            { name: 'Analytics', path: '/campaigns/analytics', badge: null, badgeColor: null },
        ],
        studio: [
            { name: 'Studio', path: '/studio', badge: null, badgeColor: null },
            { name: 'Projects', path: '/studio/projects', badge: null, badgeColor: null },
            { name: 'Assets', path: '/studio/assets', badge: null, badgeColor: null },
            { name: 'Templates', path: '/studio/templates', badge: null, badgeColor: null },
        ],
    };

    const navItems = menusByModule[activeModule];

    return (
        <>
            {/* 1. Mobile Overlay */}
            <div 
                className={`fixed inset-0 z-20 bg-gray-900/50 md:hidden transition-opacity ${isOpen ? 'opacity-100 block' : 'opacity-0 hidden'}`} 
                onClick={toggleSidebar}
            ></div>

            {/* 2. Main Sidebar */}
            <div 
                className={`fixed left-0 z-30 w-64 bg-white transition-transform duration-300 ease-in-out md:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
                style={{ top: '100px', bottom: 0 }}
            >
                
                {/* Logo and Brand - matching navbar height, visible only on mobile */}
                <div className="flex items-center justify-center border-b border-gray-200 md:hidden" style={{ height: '64px', backgroundColor: '#525BFE' }}>
                    <Logo />
                </div>

                <nav className="p-4 space-y-2">
                    {navItems.map(item => {
                        const isActive = location.pathname === item.path;
                        
                        return (
                            <Link 
                                key={item.name} 
                                to={item.path}
                                className={`flex items-center justify-between p-3 rounded-lg transition-colors duration-200 ${
                                    isActive 
                                        ? 'text-black font-medium' 
                                        : 'hover:bg-gray-50'
                                }`}
                                style={{ color: isActive ? '#000000' : '#B7BBBB' }}
                                onClick={toggleSidebar}
                            >
                                <div className="flex items-center">
                                    <span className="text-sm">{item.name}</span>
                                </div>
                                
                                {/* Badge for counts */}
                                {item.badge !== null && (
                                    <span className={`${item.badgeColor} text-white text-xs font-semibold px-2.5 py-0.5 rounded-full`}>
                                        {item.badge}
                                    </span>
                                )}
                            </Link>
                        );
                    })}
                </nav>
            </div>
        </>
    );
};

export default Sidebar;