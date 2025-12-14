// src/components/Footer.tsx

import React from 'react';

const Footer: React.FC = () => {
    return (
        <footer className="bg-white border-t border-gray-200 py-3 mt-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-start gap-8">
                    <div className="text-sm text-gray-600">
                        © Optimus 2020. All Rights Reserved
                    </div>
                    
                    <a 
                        href="/privacy-policy" 
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                    >
                        Privacy Policy
                    </a>
                    <a 
                        href="/terms-and-conditions" 
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                    >
                        T&C
                    </a>
                    <a 
                        href="/help" 
                        className="text-sm text-blue-600 hover:text-blue-700 hover:underline transition-colors cursor-pointer"
                    >
                        Help
                    </a>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
