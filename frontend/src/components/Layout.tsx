// src/components/Layout.tsx

import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';

// Placeholder data adhering to the defined types
const profilePlaceholder = { name: 'Ian Surii', branch: 'Downtown Central', avatarUrl: '' };
const notificationsPlaceholder = [{ id: 1, message: 'New leads arrived.' }, { id: 2, message: 'Monthly report ready.' }];

// Define the props for Layout (children are React nodes)
interface LayoutProps {
    children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);

    return (
        <div className="flex h-screen bg-gray-50">
            
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
            
            <div className="flex flex-col flex-1 overflow-y-auto md:ml-64">
                
                <Navbar 
                    toggleSidebar={toggleSidebar} 
                    profileData={profilePlaceholder} 
                    notifications={notificationsPlaceholder} 
                />
                
                <main className="flex-1 p-4 sm:p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;