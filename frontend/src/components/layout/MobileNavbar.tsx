import React from 'react';

export function MobileNavbar(handleModuleChange: (module: "lead" | "marketing" | "campaigns" | "studio") => void, activeModule: string) {
    return <div className="md:hidden bg-white border-b shadow-sm overflow-x-auto mb-4">
        <div className="flex items-center space-x-1 px-4 min-w-max">
            <button
                onClick={() => handleModuleChange('lead')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeModule === 'lead' ? 'text-gray-900' : 'text-gray-500'}`}
            >
                Lead Management
                {activeModule === 'lead' && (
                    <span className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#5058FD' }}></span>
                )}
            </button>
            <button
                onClick={() => handleModuleChange('marketing')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeModule === 'marketing' ? 'text-gray-900' : 'text-gray-500'}`}
            >
                Marketing Automation
                {activeModule === 'marketing' && (
                    <span className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#5058FD' }}></span>
                )}
            </button>
            <button
                onClick={() => handleModuleChange('campaigns')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeModule === 'campaigns' ? 'text-gray-900' : 'text-gray-500'}`}
            >
                Campaigns
                {activeModule === 'campaigns' && (
                    <span className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#5058FD' }}></span>
                )}
            </button>
            <button
                onClick={() => handleModuleChange('studio')}
                className={`px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap ${activeModule === 'studio' ? 'text-gray-900' : 'text-gray-500'}`}
            >
                Studio
                {activeModule === 'studio' && (
                    <span className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#5058FD' }}></span>
                )}
            </button>
        </div>
    </div>;
}
