// src/components/Logo.tsx

import React from 'react';

const Logo: React.FC = () => {
    return (
        <div className="flex items-center space-x-2 ">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1e3a8a 0%, #6366f1 50%, #8b5cf6 100%)' }}>
                <span className="text-2xl font-bold text-white">O</span>
            </div>
            <h1 className="text-xl font-bold text-white">optimus</h1>
        </div>
    );
};

export default Logo;
