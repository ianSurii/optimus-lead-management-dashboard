// src/components/FilterBar.tsx

import React, { useState } from 'react';
import { IBranch, IUser, ICampaign, ISegment, IProduct } from '../types/Dashboard';

interface FilterBarProps {
    availableBranches: IBranch[];
    availableUsers: IUser[];
    availableCampaigns: ICampaign[];
    availableSegments: ISegment[];
    availableProducts: IProduct[];
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    dateFrom: string;
    dateTo: string;
    branchId: string;
    userId: string;
    campaignId: string;
    segmentId: string;
    productId: string;
}

const FilterBar: React.FC<FilterBarProps> = ({
    availableBranches,
    availableUsers,
    availableCampaigns,
    availableSegments,
    availableProducts,
    onFilterChange,
}) => {
    const [filters, setFilters] = useState<FilterState>({
        dateFrom: '',
        dateTo: '',
        branchId: '',
        userId: '',
        campaignId: '',
        segmentId: '',
        productId: '',
    });

    const handleChange = (field: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleReset = () => {
        const resetFilters: FilterState = {
            dateFrom: '',
            dateTo: '',
            branchId: '',
            userId: '',
            campaignId: '',
            segmentId: '',
            productId: '',
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Date From */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date From
                    </label>
                    <input
                        type="date"
                        value={filters.dateFrom}
                        onChange={(e) => handleChange('dateFrom', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                {/* Date To */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Date To
                    </label>
                    <input
                        type="date"
                        value={filters.dateTo}
                        onChange={(e) => handleChange('dateTo', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                    />
                </div>

                {/* Agent */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Agent
                    </label>
                    <select
                        value={filters.userId}
                        onChange={(e) => handleChange('userId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    >
                        <option value="">All Agents</option>
                        {availableUsers.map((user) => (
                            <option key={user.user_id} value={user.user_id}>
                                {user.first_name} {user.last_name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Branch */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Branch
                    </label>
                    <select
                        value={filters.branchId}
                        onChange={(e) => handleChange('branchId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    >
                        <option value="">All Branches</option>
                        {availableBranches.map((branch) => (
                            <option key={branch.branch_id} value={branch.branch_id}>
                                {branch.name} ({branch.country})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Product */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Product
                    </label>
                    <select
                        value={filters.productId}
                        onChange={(e) => handleChange('productId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    >
                        <option value="">All Products</option>
                        {availableProducts.map((product) => (
                            <option key={product.product_id} value={product.product_id}>
                                {product.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Campaign */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Campaign
                    </label>
                    <select
                        value={filters.campaignId}
                        onChange={(e) => handleChange('campaignId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    >
                        <option value="">All Campaigns</option>
                        {availableCampaigns.map((campaign) => (
                            <option key={campaign.campaign_id} value={campaign.campaign_id}>
                                {campaign.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Segment */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Segment
                    </label>
                    <select
                        value={filters.segmentId}
                        onChange={(e) => handleChange('segmentId', e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white"
                    >
                        <option value="">All Segments</option>
                        {availableSegments.map((segment) => (
                            <option key={segment.segment_id} value={segment.segment_id}>
                                {segment.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Apply Filter Button */}
                <div className="flex items-end">
                    <button
                        onClick={handleReset}
                        className="w-full px-6 py-2 bg-gray-500 text-white font-medium rounded-lg hover:bg-gray-600 transition focus:outline-none focus:ring-2 focus:ring-gray-400"
                    >
                        Reset Filters
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterBar;
