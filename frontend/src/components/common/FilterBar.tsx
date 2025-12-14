
import React, { useState } from 'react';
import { IBranch, IUser, ICampaign, ISegment, IProduct } from '../../types/Dashboard';
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

    const [isExpanded, setIsExpanded] = useState(false);

    const handleChange = (field: keyof FilterState, value: string) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
    };

    const handleApply = () => {
        onFilterChange(filters);
        setIsExpanded(false); // Collapse on mobile after applying
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 md:p-6 mb-6">
            {/* Filter Toggle Button (Mobile Only) */}
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="md:hidden w-full flex items-center justify-between mb-3 py-2 px-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition"
            >
                <span className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    Filters
                </span>
                <svg 
                    className={`w-5 h-5 text-gray-500 transition-transform ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Filter Content */}
            <div className={`${isExpanded ? 'block' : 'hidden'} md:block`}>
                <div className="flex flex-col md:flex-row md:items-center gap-3 md:gap-4">
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
                    className="h-[48px] w-full md:w-auto px-6 text-white font-medium rounded-xl hover:opacity-90 transition focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap"
                    style={{ backgroundColor: '#5D8FEE' }}
                >
                    Apply Filter
                </button>
            </div>
            </div>
        </div>
    );
};

export default FilterBar;
