import React, { useMemo, useState, useEffect } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { IKpiMetric, ITransaction } from '../types/Dashboard';
import FilterBar, { FilterState } from '../components/common/FilterBar';
import KpiCard from '../components/metrics/KpiCard';
import ActionableInsights from '../components/metrics/ActionableInsights';
import ChartsSection from '../components/charts/ChartsSection';
import RevenueTargetChart from '../components/metrics/RevenueTargetChart';
import RankingsTable from '../components/metrics/RankingsTable';
import AgentPerformanceChart from '../components/charts/AgentPerformanceChart';
import TopAgentsPanel from '../components/metrics/TopAgentsPanel';
import Footer from '../components/layout/Footer';
import { fetchUserProfile } from '../api/sessionApi';
import { IUserProfile } from '../types/User';
import { MobileNavbar } from '../components/layout/MobileNavbar';

interface DashboardProps {
    searchQuery?: string;
}

const Dashboard: React.FC<DashboardProps> = ({ searchQuery = '' }) => {
    const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
    const [activeModule, setActiveModule] = useState<'lead' | 'marketing' | 'campaigns' | 'studio'>('lead');
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

    // Filter data based on search query - must be called before any conditional returns
    const filteredData = useMemo(() => {
        if (!data) {
            return null;
        }

        const { kpi_metrics, recommendations, branch_agent_rankings, country_rankings, top_performing_agents, agent_performance_released } = data;

        if (!searchQuery.trim()) {
            return data;
        }

        const query = searchQuery.toLowerCase();

        // Filter KPI metrics
        const filteredKpiMetrics = kpi_metrics.filter((kpi: IKpiMetric) => 
            kpi.label.toLowerCase().includes(query) ||
            kpi.value.toString().includes(query)
        );

        // Filter recommendations
        const filteredRecommendations = recommendations?.filter((rec: any) => 
            rec.title?.toLowerCase().includes(query) ||
            rec.description?.toLowerCase().includes(query)
        ) || [];

        // Filter branch agent rankings
        const filteredBranchAgentRankings = branch_agent_rankings?.filter((agent: any) => 
            agent.name?.toLowerCase().includes(query) ||
            agent.branch_name?.toLowerCase().includes(query)
        ) || [];

        // Filter country rankings
        const filteredCountryRankings = country_rankings?.filter((country: any) => 
            country.country?.toLowerCase().includes(query)
        ) || [];

        // Filter top performing agents
        const filteredTopAgents = top_performing_agents?.filter((agent: any) => 
            agent.name?.toLowerCase().includes(query) ||
            agent.branch?.toLowerCase().includes(query)
        ) || [];

        // Filter agent performance data
        const filteredAgentPerformance = agent_performance_released?.filter((agent: any) => 
            agent.name?.toLowerCase().includes(query)
        ) || [];

        return {
            ...data,
            kpi_metrics: filteredKpiMetrics,
            recommendations: filteredRecommendations,
            branch_agent_rankings: filteredBranchAgentRankings,
            country_rankings: filteredCountryRankings,
            top_performing_agents: filteredTopAgents,
            agent_performance_released: filteredAgentPerformance,
        };
    }, [data, searchQuery]);

    const handleFilterChange = (newFilters: FilterState) => {
        setAppliedFilters(newFilters);
    };

    const handleModuleChange = (module: 'lead' | 'marketing' | 'campaigns' | 'studio') => {
        setActiveModule(module);
        const moduleRoutes = {
            lead: '/',
            marketing: '/marketing',
            campaigns: '/campaigns',
            studio: '/studio',
        };
        window.location.href = moduleRoutes[module];
    };

    if (isLoading) {
        return (
            <div className="min-h-screen" style={{ backgroundColor: '#F1F5F8' }}>
                {/* Mobile Module Navigation Skeleton */}
                <div className="md:hidden bg-white border-b shadow-sm mb-4">
                    <div className="flex items-center space-x-4 px-4 py-3">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                        ))}
                    </div>
                </div>

                {/* Filter Bar Skeleton */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="space-y-2">
                                <div className="h-4 w-20 bg-gray-200 rounded animate-pulse"></div>
                                <div className="h-10 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* KPI Cards Skeleton */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                    <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-4 lg:gap-6">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <div key={i} className="flex-1 min-w-[180px] bg-white border border-gray-200 rounded-lg p-4">
                                <div className="flex items-center justify-between mb-3">
                                    <div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-10 w-10 bg-gray-200 rounded-full animate-pulse"></div>
                                </div>
                                <div className="h-8 w-20 bg-gray-200 rounded animate-pulse mb-2"></div>
                                <div className="h-3 w-16 bg-gray-200 rounded animate-pulse"></div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Actionable Insights Skeleton */}
                <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="space-y-4">
                                <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
                                <div className="space-y-2">
                                    <div className="h-4 w-full bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-4 w-5/6 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Charts Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    {[1, 2].map((i) => (
                        <div key={i} className="bg-white rounded-lg shadow-sm p-6">
                            <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                            <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
                        </div>
                    ))}
                </div>

                {/* Revenue Target and Rankings Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                        <div className="h-6 w-48 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
                        <div className="h-6 w-32 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="h-12 bg-gray-200 rounded animate-pulse"></div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Agent Performance Skeleton */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
                        <div className="h-6 w-40 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="h-80 bg-gray-200 rounded animate-pulse"></div>
                    </div>
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-sm p-6">
                        <div className="h-6 w-36 bg-gray-200 rounded animate-pulse mb-4"></div>
                        <div className="space-y-3">
                            {[1, 2, 3, 4, 5].map((i) => (
                                <div key={i} className="space-y-2">
                                    <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
                                    <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !data || !filteredData) {
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

    const { filters: filterOptions, rankings, branch_performance, country_ranking, charts, lead_vs_conversion, revenue_vs_target } = data;

    return (
        <div className="min-h-screen" style={{ backgroundColor: '#F1F5F8' }}>

            {/* Mobile Module Navigation - Horizontally Scrollable */}
            {MobileNavbar(handleModuleChange, activeModule)}

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
                    {filteredData.kpi_metrics.map((kpi: IKpiMetric) => (
                        <KpiCard key={kpi.id} kpi={kpi} />
                    ))}
                </div>
            </div>

            {/* Actionable Insights */}
            <ActionableInsights
                recommendations={filteredData.recommendations || []}
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
                availableCampaigns={filterOptions?.available_campaigns || []}
                availableProducts={filterOptions?.available_products || []}
                availableSegments={filterOptions?.available_segments || []}
                availableUsers={filterOptions?.available_users || []}
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
                        branchAgentData={filteredData.branch_agent_rankings || []}
                        countryData={filteredData.country_rankings || []}
                    />
                </div>
            </div>

            {/* Agent Performance and Top Agents Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                {/* Agent Performance Chart (2/3 width) */}
                <div className="lg:col-span-2">
                    <AgentPerformanceChart
                        data={filteredData.agent_performance_released || []}
                    />
                </div>

                {/* Top Performing Agents (1/3 width) */}
                <div className="lg:col-span-1">
                    <TopAgentsPanel
                        agents={filteredData.top_performing_agents || []}
                    />
                </div>
            </div>

            {/* Footer */}
            <Footer />
         
        </div>
    );
};

export default Dashboard;


