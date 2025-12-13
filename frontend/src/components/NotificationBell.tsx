// src/components/NotificationBell.tsx

import React, { useState, useEffect, useRef } from 'react';
import { INotification } from '../types/User';

interface NotificationBellProps {
    notifications: INotification[];
}

const NotificationBell: React.FC<NotificationBellProps> = ({ notifications }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const notificationRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (notificationRef.current && !notificationRef.current.contains(event.target as Node)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
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
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 max-h-96 overflow-y-auto z-50">
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
    );
};

export default NotificationBell;
