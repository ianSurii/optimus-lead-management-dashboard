// src/components/ActionableInsights.tsx

import React from 'react';
import { IBranchPerformance, ICountryRanking } from '../types/Dashboard';
import type{ Recommendation ,ActionableInsightsProps,Rankings} from '../types/Recommedation';





const ActionableInsights: React.FC<ActionableInsightsProps> = ({
    recommendations,
    rankings,
    branchPerformance,
    countryRanking,
    userBranchId
}) => {
    // Get user's branch ranking
    const getUserBranchRank = () => {
        if (!userBranchId || !branchPerformance.length) return rankings.branch_ranking || 0;
        const branchIndex = branchPerformance.findIndex(b => b.branch_id === userBranchId);
        return branchIndex >= 0 ? branchIndex + 1 : rankings.branch_ranking || 0;
    };

    // Get user's country ranking
    const getUserCountryRank = () => {
        if (!userBranchId || !branchPerformance.length || !countryRanking.length) return rankings.country_ranking || 0;
        const userBranch = branchPerformance.find(b => b.branch_id === userBranchId);
        if (!userBranch) return rankings.country_ranking || 0;
        const countryIndex = countryRanking.findIndex(c => c.country === userBranch.country);
        return countryIndex >= 0 ? countryIndex + 1 : rankings.country_ranking || 0;
    };

    const branchRank = getUserBranchRank();
    const countryRank = getUserCountryRank();

    // Helper to highlight percentages and times in text
    const highlightText = (text: string) => {
        // Split by percentage (e.g., "2%") and time (e.g., "8:30 am")
        const parts = text.split(/(\d+%|\d{1,2}:\d{2}\s*(?:am|pm|AM|PM))/g);
        
        return parts.map((part, index) => {
            if (part.match(/\d+%|\d{1,2}:\d{2}\s*(?:am|pm|AM|PM)/)) {
                return <span key={index} className="font-bold text-white">{part}</span>;
            }
            return part;
        });
    };

    return (
        <div 
            className="rounded-3xl p-6 sm:p-8 mb-6 animate-fade-in overflow-hidden relative"
            style={{
                background: 'linear-gradient(90deg, #195EE7 0%, #195EE7 30%, #A21EE9 100%)',
                animation: 'fadeInScale 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) both'
            }}
        >
            <style>{`
                @keyframes fadeInScale {
                    from {
                        opacity: 0;
                        transform: scale(0.95) translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                @keyframes shimmer {
                    0% {
                        background-position: -1000px 0;
                    }
                    100% {
                        background-position: 1000px 0;
                    }
                }
            `}</style>
            {/* Animated gradient overlay */}
            <div 
                className="absolute inset-0 pointer-events-none"
                style={{
                    background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%)',
                    backgroundSize: '1000px 100%',
                    animation: 'shimmer 3s infinite linear'
                }}
            />
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:divide-x lg:divide-white/20 relative z-10">
                {/* Column 1 & 2: Recommendations */}
                {recommendations.slice(0, 2).map((rec, index) => (
                    <div 
                        key={index} 
                        className="flex flex-col gap-3 lg:px-6 first:pl-0"
                        style={{
                            animation: `slideInFromLeft 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) ${0.3 + index * 0.2}s both`
                        }}
                    >
                        <style>{`
                            @keyframes slideInFromLeft {
                                from {
                                    opacity: 0;
                                    transform: translateX(-40px) scale(0.9);
                                }
                                to {
                                    opacity: 1;
                                    transform: translateX(0) scale(1);
                                }
                            }
                        `}</style>
                        <h3 className="text-xl sm:text-2xl font-bold text-white">
                            {rec.title}
                        </h3>
                        <p className="text-sm sm:text-base text-white/90 leading-relaxed">
                            {highlightText(rec.description)}
                        </p>
                    </div>
                ))}

                {/* Column 3: Rankings */}
                <div 
                    className="flex flex-col gap-6 lg:px-6"
                    style={{
                        animation: 'slideInFromRight 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) 0.7s both'
                    }}
                >
                    <style>{`
                        @keyframes slideInFromRight {
                            from {
                                opacity: 0;
                                transform: translateX(40px) scale(0.9);
                            }
                            to {
                                opacity: 1;
                                transform: translateX(0) scale(1);
                            }
                        }
                    `}</style>
                    <div className="flex flex-row gap-6 justify-center">
                        {/* Branch Ranking */}
                        <div className="flex flex-col gap-2 flex-1 items-center text-center">
                            <div className="text-4xl sm:text-5xl font-extrabold text-white">
                                {branchRank}
                            </div>
                            <div className="text-sm text-white/80">
                                Branch Ranking
                            </div>
                            <button 
                                className="px-4 py-2 bg-white hover:bg-white/90 hover:scale-110 hover:shadow-xl rounded-lg transition-all duration-300 ease-out text-sm font-medium transform hover:-translate-y-1"
                                style={{ color: '#5862FC' }}
                            >
                                View All
                            </button>
                        </div>

                        {/* Country Ranking */}
                        <div className="flex flex-col gap-2 flex-1 items-center text-center">
                            <div className="text-4xl sm:text-5xl font-extrabold text-white">
                                {countryRank}
                            </div>
                            <div className="text-sm text-white/80">
                                Country Ranking
                            </div>
                            <button 
                                className="px-4 py-2 bg-white hover:bg-white/90 hover:scale-110 hover:shadow-xl rounded-lg transition-all duration-300 ease-out text-sm font-medium transform hover:-translate-y-1"
                                style={{ color: '#5862FC' }}
                            >
                                View All
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ActionableInsights;
