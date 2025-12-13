// src/components/RankingsTable.tsx

import React, { useState } from 'react';
import { abbreviateNumber } from '../utils/numberFormatter';

interface RankingItem {
    id: string;
    name: string;
    target_kes: number;
    current: number;
    previous: number;
    realised: number;
    realised_previous: number;
}

interface CountryRankingItem {
    id: string;
    country: string;
    realised: number;
    previous_realised: number;
    branch_count: number;
}

interface RankingsTableProps {
    branchAgentData: RankingItem[];
    countryData: CountryRankingItem[];
}

type TabType = 'branch-agent' | 'country';

const RankingsTable: React.FC<RankingsTableProps> = ({
    branchAgentData,
    countryData
}) => {
    const [activeTab, setActiveTab] = useState<TabType>('branch-agent');
    const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);

    const getChangeArrow = (current: number, previous: number) => {
        if (current > previous) {
            return (
                <svg className="w-5 h-5 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
            );
        } else if (current < previous) {
            return (
                <svg className="w-5 h-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
                </svg>
            );
        }
        return <span className="text-gray-400">—</span>;
    };

    const handleMoreClick = (id: string) => {
        setShowMoreMenu(showMoreMenu === id ? null : id);
    };

    const handleMenuAction = (action: string, id: string) => {
        console.log(`Action: ${action} for ID: ${id}`);
        setShowMoreMenu(null);
        // TODO: Implement actual actions
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
            {/* Tabs */}
            <div className="flex gap-4 border-b border-gray-200 mb-4">
                <button
                    onClick={() => setActiveTab('branch-agent')}
                    className={`pb-3 px-2 font-semibold text-sm transition-colors relative ${
                        activeTab === 'branch-agent'
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                   Branch Agent Ranking
                    {activeTab === 'branch-agent' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                </button>
                <button
                    onClick={() => setActiveTab('country')}
                    className={`pb-3 px-2 font-semibold text-sm transition-colors relative ${
                        activeTab === 'country'
                            ? 'text-blue-600'
                            : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                    Country Ranking
                    {activeTab === 'country' && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600"></div>
                    )}
                </button>
            </div>

            {/* Content */}
            <div className="space-y-3 flex-1 overflow-y-auto">
                {activeTab === 'branch-agent' ? (
                    <>
                        {branchAgentData.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="text-left min-w-[150px]">
                                        <p className="text-sm font-medium text-gray-800">{item.name}</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-left">
                                        <span className="text-xs text-gray-500">Target</span>
                                        <span className="text-sm font-normal text-gray-800">
                                            {abbreviateNumber(item.target_kes)}
                                        </span>
                                        {getChangeArrow(item.current, item.previous)}
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-left">
                                        <span className="text-xs text-gray-500">Realised</span>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {abbreviateNumber(item.realised)}
                                        </span>
                                        {getChangeArrow(item.realised, item.realised_previous)}
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <button
                                        onClick={() => handleMoreClick(item.id)}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </button>
                                    {showMoreMenu === item.id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <button
                                                onClick={() => handleMenuAction('view', item.id)}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleMenuAction('edit', item.id)}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                            >
                                                Edit Target
                                            </button>
                                            <button
                                                onClick={() => handleMenuAction('report', item.id)}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg"
                                            >
                                                Generate Report
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                ) : (
                    <>
                        {countryData.map((item) => (
                            <div key={item.id} className="flex items-center justify-between py-3 px-4 hover:bg-gray-50 rounded-lg transition-colors">
                                <div className="flex items-center gap-6 flex-1">
                                    <div className="text-left min-w-[150px]">
                                        <p className="text-sm font-medium text-gray-800">{item.country}</p>
                                        <p className="text-xs text-gray-500">{item.branch_count} branches</p>
                                    </div>
                                    
                                    <div className="flex items-center gap-2 text-left">
                                        <span className="text-xs text-gray-500">Realised</span>
                                        <span className="text-sm font-semibold text-gray-800">
                                            {abbreviateNumber(item.realised)}
                                        </span>
                                        {getChangeArrow(item.realised, item.previous_realised)}
                                    </div>
                                </div>
                                
                                <div className="relative">
                                    <button
                                        onClick={() => handleMoreClick(item.id)}
                                        className="text-gray-500 hover:text-gray-700 p-1"
                                    >
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                            <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                        </svg>
                                    </button>
                                    {showMoreMenu === item.id && (
                                        <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                            <button
                                                onClick={() => handleMenuAction('view', item.id)}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg"
                                            >
                                                View Details
                                            </button>
                                            <button
                                                onClick={() => handleMenuAction('report', item.id)}
                                                className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg"
                                            >
                                                Generate Report
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))}
                    </>
                )}
            </div>
        </div>
    );
};

export default RankingsTable;
