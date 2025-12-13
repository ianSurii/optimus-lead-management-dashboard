// src/components/Layout.tsx

import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import BannerMessage from './BannerMessage';
import { fetchBanner } from '../api/sessionApi';
import { IBanner } from '../types/User';

// Define the props for Layout (children are React nodes)
interface LayoutProps {
    children: React.ReactNode;
    searchQuery?: string;
    onSearchChange?: (query: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, searchQuery = '', onSearchChange }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [banner, setBanner] = useState<IBanner | null>(null);
    const [bannerLoading, setBannerLoading] = useState(true);
    const [activeModule, setActiveModule] = useState<'lead' | 'marketing' | 'campaigns' | 'studio'>('lead');

    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    useEffect(() => {
        const loadBanner = async () => {
            try {
                const bannerData = await fetchBanner();
                setBanner(bannerData);
            } catch (error) {
                console.error('Failed to load banner:', error);
            } finally {
                setBannerLoading(false);
            }
        };

        loadBanner();
    }, []);

    const showBanner = !bannerLoading && banner && banner.active;
    const bannerHeight = showBanner ? 36 : 0;

    return (
        <div className="flex h-screen bg-gray-50" style={{ paddingTop: `${bannerHeight}px` }}>
            {/* Banner appears at the very top - fixed position, full width */}
            {showBanner && <BannerMessage banner={banner} />}
            
            {/* Navbar - fixed position, full width, above sidebar */}
            <div className="fixed top-0 left-0 right-0 z-50" style={{ marginTop: `${bannerHeight}px` }}>
                <Navbar 
                    toggleSidebar={toggleSidebar} 
                    activeModule={activeModule} 
                    setActiveModule={setActiveModule}
                    searchQuery={searchQuery}
                    onSearchChange={onSearchChange}
                />
            </div>
            
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} activeModule={activeModule} />
            
            <div 
                className="flex flex-col flex-1 overflow-y-auto md:ml-64"
                style={{ paddingTop: '64px' }}
            >
                <main className="flex-1 p-4" style={{backgroundColor:"#F6F6F8"}}>
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;