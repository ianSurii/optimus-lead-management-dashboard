// src/components/ProfileDropdown.tsx

import React, { useState, useEffect, useRef } from 'react';
import { IUserProfile } from '../types/User';

interface ProfileDropdownProps {
    userProfile: IUserProfile | null;
}

const ProfileDropdown: React.FC<ProfileDropdownProps> = ({ userProfile }) => {
    const [showProfile, setShowProfile] = useState(false);
    const profileRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
                setShowProfile(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={profileRef}>
            <button
                className="flex items-center space-x-3 focus:outline-none"
                onClick={() => setShowProfile(!showProfile)}
            >
                <img 
                    src='/profile.jpeg'
                    alt="Profile" 
                    className="w-10 h-10 rounded-full object-cover border-2 border-gray-300"
                    loading="eager"
                />
                {userProfile && (
                    <span className="hidden md:inline text-sm text-gray-500">
                        {userProfile.first_name} {userProfile.last_name}
                    </span>
                )}
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Profile Dropdown */}
            {showProfile && userProfile && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50">
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
    );
};

export default ProfileDropdown;
