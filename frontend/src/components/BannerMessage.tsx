// src/components/BannerMessage.tsx

import React from 'react';

// Define the component's props interface
interface BannerMessageProps {
    message?: string;
}

// Use React.FC (Function Component) and pass the Props interface
const BannerMessage: React.FC<BannerMessageProps> = ({ message }) => {
    return (
        <div className="p-4 mb-6 text-indigo-900 bg-indigo-100 border-l-4 border-indigo-500 rounded-lg" role="alert">
            <p className="font-bold">Welcome Back, Ian Surii!</p>
            <p className="text-sm">{message || "Review today's performance and address pending leads."}</p>
        </div>
    );
};

export default BannerMessage;