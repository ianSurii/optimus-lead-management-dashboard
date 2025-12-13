// src/pages/Dashboard.tsx

import React, { useMemo, useState, useEffect } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { IKpiMetric, ITransaction } from '../types/Dashboard';
import FilterBar, { FilterState } from '../components/FilterBar';
import KpiCard from '../components/KpiCard';
import ActionableInsights from '../components/ActionableInsights';
import ChartsSection from '../components/ChartsSection';
import RevenueTargetChart from '../components/RevenueTargetChart';
import RankingsTable from '../components/RankingsTable';
import AgentPerformanceChart from '../components/AgentPerformanceChart';
import TopAgentsPanel from '../components/TopAgentsPanel';
import Footer from '../components/Footer';
import { fetchUserProfile } from '../api/sessionApi';
import { IUserProfile } from '../types/User';

const Dashboard: React.FC = () => {
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [appliedFilters, setAppliedFilters] = useState<FilterState>({
        date: new Date().toISOString().split('T')[0],
        branchId: '',
        userId: '',
        campaignId: '',
        segmentId: '',
        productId: '',
    });

    useEffect(() => {
        const loadUserProfile = async () => {
            try {
                const profile = await fetchUserProfile();
                setUserProfile(profile);
            } catch (error) {
                console.error('Failed to load user profile:', error);
            }
        };
        loadUserProfile();
    }, []);

    const filters = useMemo(() => {
        const apiFilters: { [key: string]: string } = {};
        if (appliedFilters.date) apiFilters.date = appliedFilters.date;
        if (appliedFilters.branchId) apiFilters.branch_id = appliedFilters.branchId;
        if (appliedFilters.userId) apiFilters.user_id = appliedFilters.userId;
        if (appliedFilters.campaignId) apiFilters.campaign_id = appliedFilters.campaignId;
        if (appliedFilters.segmentId) apiFilters.segment_id = appliedFilters.segmentId;
        if (appliedFilters.productId) apiFilters.product_id = appliedFilters.productId;
        return apiFilters;
    }, [appliedFilters]);



    const { data, isLoading, error, refreshData } = useDashboardData(filters);

    const handleFilterChange = (newFilters: FilterState) => {
        setAppliedFilters(newFilters);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="text-center">
                    <div className="inline-block w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4"></div>
                    <p className="text-xl font-semibold text-gray-700">Loading Dashboard Data...</p>
                </div>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="flex items-center justify-center min-h-screen p-4">
                <div className="max-w-md w-full bg-red-50 border border-red-200 rounded-lg p-6 shadow-lg">
                    <div className="flex items-center mb-2">
                        <span className="text-2xl mr-2">❌</span>
                        <h3 className="text-lg font-semibold text-red-800">Error Loading Data</h3>
                    </div>
                    <p className="text-red-600">{error || 'No Data Available'}</p>
                </div>
            </div>
        );
    }

    const { kpi_metrics, transaction_list, filters: filterOptions, recommendations, rankings, branch_performance, country_ranking, charts, lead_vs_conversion, revenue_vs_target, branch_agent_rankings, country_rankings, agent_performance_released, top_performing_agents } = data;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F1F5F8' }}>

            {/* Mobile Module Navigation - Horizontally Scrollable */}
            <div className="md:hidden bg-white border-b shadow-sm overflow-x-auto mb-4">
                <div className="flex items-center space-x-1 px-4 min-w-max">
                    <button
                        className="px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap text-gray-900"
                    >
                        Lead Management
                        <span className="absolute bottom-0 left-0 right-0 h-1" style={{ backgroundColor: '#5058FD' }}></span>
                    </button>
                    <button
                        className="px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap text-gray-500"
                    >
                        Marketing Automation
                    </button>
                    <button
                        className="px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap text-gray-500"
                    >
                        Campaigns
                    </button>
                    <button
                        className="px-4 py-3 text-sm font-medium transition-colors relative whitespace-nowrap text-gray-500"
                    >
                        Studio
                    </button>
                </div>
            </div>

            {/* Filter Bar */}
            <FilterBar
                availableBranches={filterOptions?.available_branches || []}
                availableUsers={filterOptions?.available_users || []}
                availableCampaigns={filterOptions?.available_campaigns || []}
                availableSegments={filterOptions?.available_segments || []}
                availableProducts={filterOptions?.available_products || []}
                onFilterChange={handleFilterChange}
            />

            {/* KPI Cards Grid */}
            <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 lg:gap-6">
                    {kpi_metrics.map((kpi: IKpiMetric) => (
                        <KpiCard key={kpi.id} kpi={kpi} />
                    ))}
                </div>
            </div>

            {/* Actionable Insights */}
            <ActionableInsights
                recommendations={recommendations || []}
                rankings={rankings || { branch_ranking: 0, country_ranking: 0 }}
                branchPerformance={branch_performance || []}
                countryRanking={country_ranking || []}
                userBranchId={userProfile?.primary_branch_id}
            />

            {/* Charts Section */}
            <ChartsSection
                charts={charts}
                leadVsConversion={lead_vs_conversion}
                availableBranches={filterOptions?.available_branches || []}
                userBranchId={userProfile?.primary_branch_id}
            />

            {/* Revenue vs Target and Rankings Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Revenue Target Chart (2/3 width) */}
                <div className="lg:col-span-2">
                    <RevenueTargetChart
                        data={revenue_vs_target}
                        availableBranches={(filterOptions?.available_branches || []).map(b => ({ value: b.branch_id, label: b.name }))}
                        userBranchId={userProfile?.primary_branch_id}
                    />
                </div>

                {/* Rankings Table (1/3 width) */}
                <div className="lg:col-span-1">
                    <RankingsTable
                        branchAgentData={branch_agent_rankings || []}
                        countryData={country_rankings || []}
                    />
                </div>
            </div>

            {/* Agent Performance and Top Agents Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Agent Performance Chart (2/3 width) */}
                <div className="lg:col-span-2">
                    <AgentPerformanceChart
                        data={agent_performance_released || []}
                    />
                </div>

                {/* Top Performing Agents (1/3 width) */}
                <div className="lg:col-span-1">
                    <TopAgentsPanel
                        agents={top_performing_agents || []}
                    />
                </div>
            </div>

            {/* Footer */}
            <Footer />
         
        </div>
    );
};

export default Dashboard;