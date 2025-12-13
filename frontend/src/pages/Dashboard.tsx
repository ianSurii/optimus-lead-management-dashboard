// src/pages/Dashboard.tsx

import React, { useMemo, useState, useEffect } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import { IKpiMetric, ITransaction } from '../types/Dashboard';
import FilterBar, { FilterState } from '../components/FilterBar';
import KpiCard from '../components/KpiCard';
import ActionableInsights from '../components/ActionableInsights';
import ChartsSection from '../components/ChartsSection';
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

    const { kpi_metrics, transaction_list, filters: filterOptions, recommendations, rankings, branch_performance, country_ranking, charts, lead_vs_conversion } = data;

    return (
        <div className="min-h-screen pb-8 px-6 pt-6" style={{ backgroundColor: '#F1F5F8' }}>

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

            {/* Transactions Table */}
            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-800">
                        Recent Transactions 
                        <span className="ml-2 text-sm font-normal text-gray-500">
                            ({transaction_list.length} Records)
                        </span>
                    </h3>
                </div>
                
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Customer
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Amount
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Date
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {transaction_list.slice(0, 5).map((txn: ITransaction) => {
                                let statusClasses = 'bg-blue-100 text-blue-800';
                                if (txn.status === 'Closed') statusClasses = 'bg-green-100 text-green-800';
                                else if (txn.status === 'Pending') statusClasses = 'bg-yellow-100 text-yellow-800';
                                else if (txn.status === 'Rejected') statusClasses = 'bg-red-100 text-red-800';
                                
                                return (
                                    <tr key={txn.id || txn.txn_id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {txn.customer_name}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">
                                            ${txn.amount.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${statusClasses}`}>
                                                {txn.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {txn.date}
                                        </td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
            
        </div>
    );
};

export default Dashboard;