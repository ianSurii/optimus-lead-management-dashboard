// src/components/FilterBar.tsx

import React, { useState } from 'react';
import { IBranch, IUser, ICampaign, ISegment, IProduct } from '../types/Dashboard';
import DatePicker from './DatePicker';
import CustomSelect from './CustomSelect';

interface FilterBarProps {
    availableBranches: IBranch[];
    availableUsers: IUser[];
    availableCampaigns: ICampaign[];
    availableSegments: ISegment[];
    availableProducts: IProduct[];
    onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
    date: string;
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
    // Get current date in YYYY-MM-DD format
    const getCurrentDate = () => {
        const today = new Date();
        return today.toISOString().split('T')[0];
    };

    const [filters, setFilters] = useState<FilterState>({
        date: getCurrentDate(),
        branchId: '',
        userId: '',
        campaignId: '',
        segmentId: '',
        productId: '',
    });

    const handleChange = (field: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
    };

    const handleApply = () => {
        onFilterChange(filters);
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
            <div className="flex items-center gap-4">
                {/* Date Picker */}
                <DatePicker
                    value={filters.date}
                    onChange={(value) => handleChange('date', value)}
                    label="Filter date"
                />

                {/* Agent */}
                <CustomSelect
                    value={filters.userId}
                    onChange={(value) => handleChange('userId', value)}
                    options={availableUsers.map(user => ({
                        value: user.user_id,
                        label: `${user.first_name} ${user.last_name}`
                    }))}
                    placeholder="Agent"
                />

                {/* Branch */}
                <CustomSelect
                    value={filters.branchId}
                    onChange={(value) => handleChange('branchId', value)}
                    options={availableBranches.map(branch => ({
                        value: branch.branch_id,
                        label: branch.name
                    }))}
                    placeholder="Branch"
                />

                {/* Product */}
                <CustomSelect
                    value={filters.productId}
                    onChange={(value) => handleChange('productId', value)}
                    options={availableProducts.map(product => ({
                        value: product.product_id,
                        label: product.name
                    }))}
                    placeholder="Product"
                />

                {/* Segment */}
                <CustomSelect
                    value={filters.segmentId}
                    onChange={(value) => handleChange('segmentId', value)}
                    options={availableSegments.map(segment => ({
                        value: segment.segment_id,
                        label: segment.name
                    }))}
                    placeholder="Segment"
                />

                {/* Campaign */}
                <CustomSelect
                    value={filters.campaignId}
                    onChange={(value) => handleChange('campaignId', value)}
                    options={availableCampaigns.map(campaign => ({
                        value: campaign.campaign_id,
                        label: campaign.name
                    }))}
                    placeholder="Campaign"
                />

                {/* Apply Filter Button */}
                <button
                    onClick={handleApply}
                    className="h-[48px] px-6 text-white font-medium rounded-xl hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap"
                    style={{ backgroundColor: '#5D8FEE' }}
                >
                    Apply Filter
                </button>
            </div>
        </div>
    );
};

export default FilterBar;
