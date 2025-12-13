// src/components/TopAgentsPanel.tsx

import React, { useState } from 'react';

interface TopAgent {
    agent_id: string;
    agent_name: string;
    turnaround_time: number; // in days
    conversion_rate: number; // percentage
    branch_name: string;
}

interface TopAgentsPanelProps {
    agents: TopAgent[];
}

const TopAgentsPanel: React.FC<TopAgentsPanelProps> = ({ agents }) => {
    const [showMoreMenu, setShowMoreMenu] = useState<string | null>(null);

    const handleMoreClick = (agentId: string) => {
        setShowMoreMenu(showMoreMenu === agentId ? null : agentId);
    };

    const handleMenuAction = (action: string, agentId: string) => {
        console.log(`Action: ${action} for Agent: ${agentId}`);
        setShowMoreMenu(null);
        // TODO: Implement actual actions
    };

    if (!agents || agents.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
            <h3 className="text-base font-semibold mb-4" style={{ color: '#5D8FEE' }}>
                Top Performing Agents
            </h3>

            <div className="space-y-3 flex-1 overflow-y-auto">
                {agents.map((agent) => (
                    <div 
                        key={agent.agent_id} 
                        className="flex items-center justify-between py-2 px-4 hover:bg-gray-50 rounded-lg transition-colors border border-gray-100"
                    >
                        <div className="flex items-center gap-4 flex-1 min-w-0">
                            <div className="text-left min-w-[100px] flex-shrink-0">
                                <p className="text-xs font-normal text-gray-800 truncate">{agent.agent_name}</p>
                            </div>

                            <div className="text-left flex-shrink-0">
                                <span className="text-xs font-normal text-gray-800 whitespace-nowrap">{agent.turnaround_time} {agent.turnaround_time === 1 ? 'day' : 'days'} TAT</span>
                            </div>
                            
                            <div className="text-left flex-shrink-0">
                                <span className="text-xs font-normal text-gray-800 whitespace-nowrap">{agent.conversion_rate}% Conversion</span>
                            </div>
                            
                            <div className="text-left flex-shrink-0">
                                <span className="text-xs font-normal text-gray-800 truncate">{agent.branch_name}</span>
                            </div>
                        </div>

                        <div className="relative">
                            <button
                                onClick={() => handleMoreClick(agent.agent_id)}
                                className="text-gray-500 hover:text-gray-700 p-1"
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                                </svg>
                            </button>
                            {showMoreMenu === agent.agent_id && (
                                <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={() => handleMenuAction('view', agent.agent_id)}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg"
                                    >
                                        View Profile
                                    </button>
                                    <button
                                        onClick={() => handleMenuAction('performance', agent.agent_id)}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100"
                                    >
                                        Performance Report
                                    </button>
                                    <button
                                        onClick={() => handleMenuAction('contact', agent.agent_id)}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg"
                                    >
                                        Contact Agent
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default TopAgentsPanel;
