
import React, { useState, useMemo, useEffect } from 'react';
import CustomSelect from '../common/CustomSelect';
import LineChart from './LineChart';
import DonutChart from './DonutChart';
import MultiSelectCheckbox from '../common/MultiSelectCheckbox';
import { abbreviateNumber } from '../../utils/numberFormatter';

interface ChartsSectionProps {
    charts: any;
    leadVsConversion: {
        labels: string[];
        branches: {
            [branchId: string]: {
                branch_name: string;
                daily_revenue: number[];
                daily_closed: number[];
                daily_leads: number[];
                daily_conversion: number[];
            }
        }
    };
    availableBranches: Array<{ branch_id: string; name: string; }>;
    availableCampaigns?: Array<{ campaign_id: string; name: string; }>;
    availableProducts?: Array<{ product_id: string; name: string; }>;
    availableSegments?: Array<{ segment_id: string; name: string; }>;
    availableUsers?: Array<{ user_id: string; first_name: string; last_name: string; }>;
    userBranchId?: string;
    onFilterChange?: (filters: { campaigns: string[]; products: string[]; segments: string[]; agents: string[] }) => void;
}

const ChartsSection: React.FC<ChartsSectionProps> = ({ 
    charts, 
    leadVsConversion,
    availableBranches,
    availableCampaigns = [],
    availableProducts = [],
    availableSegments = [],
    availableUsers = [],
    userBranchId,
    onFilterChange
}) => {
    const [selectedBranch, setSelectedBranch] = useState<string>(userBranchId || 'all');
    const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
    const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
    const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
    const [selectedAgents, setSelectedAgents] = useState<string[]>([]);
    const [showLineExportMenu, setShowLineExportMenu] = useState(false);
    const [showDonutExportMenu, setShowDonutExportMenu] = useState(false);

    // Notify parent of filter changes
    useEffect(() => {
        if (onFilterChange) {
            onFilterChange({
                campaigns: selectedCampaigns,
                products: selectedProducts,
                segments: selectedSegments,
                agents: selectedAgents
            });
        }
    }, [selectedCampaigns, selectedProducts, selectedSegments, selectedAgents, onFilterChange]);

    // Prepare line chart data - using revenue instead of leads count
    const lineChartData = useMemo(() => {
        let dailyRevenue = new Array(7).fill(0);
        let dailyConversion = new Array(7).fill(0);

        const branchesToInclude = selectedBranch === 'all'
            ? Object.entries(leadVsConversion.branches)
            : Object.entries(leadVsConversion.branches).filter(([id]) => id === selectedBranch);

        // Aggregate data from selected branches
        branchesToInclude.forEach(([_, data]) => {
            if (data.daily_revenue) {
                dailyRevenue = dailyRevenue.map((val, idx) => val + (data.daily_revenue[idx] || 0));
            }
            dailyConversion = dailyConversion.map((val, idx) => {
                const totalLeads = branchesToInclude.reduce((sum, [__, d]) => sum + (d.daily_leads[idx] || 0), 0);
                const totalClosed = branchesToInclude.reduce((sum, [__, d]) => sum + (d.daily_closed[idx] || 0), 0);
                return totalLeads > 0 ? (totalClosed / totalLeads) * 100 : 0;
            });
        });

        const labels = leadVsConversion.labels.map(date => {
            const d = new Date(date);
            return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        });

        const datasets = [
            {
                label: 'Revenue',
                data: dailyRevenue,
                borderColor: '#5D8FEE',
                backgroundColor: '#5D8FEE20',
                yAxisID: 'y'
            },
            {
                label: 'Conversion Rate',
                data: dailyConversion,
                borderColor: '#FA2965',
                backgroundColor: '#FA296520',
                yAxisID: 'y1'
            }
        ];

        return { labels, datasets };
    }, [leadVsConversion, selectedBranch]);

    // Prepare donut chart data
    const donutChartData = useMemo(() => {
        if (!charts?.status_breakdown) return null;

        const statusColors: { [key: string]: string } = {
            'Open': '#5962FF',
            'Processing': '#38bdf8',
            'To Callback Later': '#5962FF',
            'Closed': '#F8622F',
            'Product/Service Sold': '#FFC609'
        };

        const totalValue = charts.status_breakdown.datasets[0].data.reduce((a: number, b: number) => a + b, 0);

        return {
            labels: charts.status_breakdown.labels,
            data: charts.status_breakdown.datasets[0].data,
            backgroundColor: charts.status_breakdown.labels.map(
                (label: string) => statusColors[label] || '#6b7280'
            ),
            total: totalValue
        };
    }, [charts]);

    const handleLineExport = (type: 'jpeg' | 'excel') => {
        console.log(`Exporting line chart as ${type}`);
        setShowLineExportMenu(false);
        // Implementation needed
    };

    const handleDonutExport = (type: 'jpeg' | 'excel') => {
        console.log(`Exporting donut chart as ${type}`);
        setShowDonutExportMenu(false);
        // Implementation needed
    };

    const branchOptions = [
        { value: 'all', label: 'All Branches' },
        ...availableBranches.map(b => ({ value: b.branch_id, label: b.name }))
    ];

    const campaignOptions = availableCampaigns.map(c => ({ value: c.campaign_id, label: c.name }));
    const productOptions = availableProducts.map(p => ({ value: p.product_id, label: p.name }));
    const segmentOptions = availableSegments.map(s => ({ value: s.segment_id, label: s.name }));
    const agentOptions = availableUsers.map(u => ({ value: u.user_id, label: `${u.first_name} ${u.last_name}` }));

    // Build filter dropdown options
    const filterOptions = [
        ...(campaignOptions.length > 0 ? [{ value: 'campaign', label: `Campaign (${campaignOptions.length})` }] : []),
        ...(productOptions.length > 0 ? [{ value: 'product', label: `Product (${productOptions.length})` }] : []),
        ...(segmentOptions.length > 0 ? [{ value: 'segment', label: `Segment (${segmentOptions.length})` }] : []),
        ...(agentOptions.length > 0 ? [{ value: 'agent', label: `Agent (${agentOptions.length})` }] : [])
    ];

    const [activeFilterType, setActiveFilterType] = useState<string>('');
    const [showFilterDropdown, setShowFilterDropdown] = useState(false);

    const handleFilterTypeSelect = (type: string) => {
        setActiveFilterType(type);
        setShowFilterDropdown(false);
    };

    const getActiveFilterOptions = () => {
        switch (activeFilterType) {
            case 'campaign': return campaignOptions;
            case 'product': return productOptions;
            case 'segment': return segmentOptions;
            case 'agent': return agentOptions;
            default: return [];
        }
    };

    const getActiveFilterValues = () => {
        switch (activeFilterType) {
            case 'campaign': return selectedCampaigns;
            case 'product': return selectedProducts;
            case 'segment': return selectedSegments;
            case 'agent': return selectedAgents;
            default: return [];
        }
    };

    const handleActiveFilterChange = (values: string[]) => {
        switch (activeFilterType) {
            case 'campaign': setSelectedCampaigns(values); break;
            case 'product': setSelectedProducts(values); break;
            case 'segment': setSelectedSegments(values); break;
            case 'agent': setSelectedAgents(values); break;
        }
    };

    const fieldOptions = [
        { value: 'campaign', label: 'Campaign' },
        { value: 'product', label: 'Product' },
        { value: 'segment', label: 'Segment' },
        { value: 'agent', label: 'Agent' }
    ];

    const getBranchName = () => {
        if (selectedBranch === 'all') return 'All Branches';
        const branch = availableBranches.find(b => b.branch_id === selectedBranch);
        return branch ? branch.name : 'Unknown Branch';
    };

    return (
        <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 mb-6">
            {/* Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Line Chart - Revenue vs Conversion Rate (2/3 width) */}
                <div className="lg:col-span-2">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-4">
                            <h3 className="text-base font-semibold" style={{ color: '#5D8FEE' }}>
                                Leads
                            </h3>
                        </div>
                        
                        <div className="flex items-center gap-3">
                            <CustomSelect
                            width="w-48"
                        height="h-10"

                                options={branchOptions}
                                value={selectedBranch}
                                onChange={setSelectedBranch}
                                placeholder="All Branches"
                            />

                            {activeFilterType ? (
                                <MultiSelectCheckbox
                                    options={getActiveFilterOptions()}
                                    selectedValues={getActiveFilterValues()}
                                    onChange={handleActiveFilterChange}
                                    placeholder={`Select ${activeFilterType}`}
                                    width="w-48"
                                    height="h-10"
                                />
                            ) : (
                                <CustomSelect
                                    width="w-48"
                                    height="h-10"
                                    options={[{ value: '', label: 'Filter by' }, ...filterOptions]}
                                    value=""
                                    onChange={handleFilterTypeSelect}
                                    placeholder="Filter by"
                                />
                            )}

                            {activeFilterType && (
                                <button
                                    onClick={() => {
                                        setActiveFilterType('');
                                        setSelectedCampaigns([]);
                                        setSelectedProducts([]);
                                        setSelectedSegments([]);
                                        setSelectedAgents([]);
                                    }}
                                    className="text-sm text-gray-500 hover:text-gray-700"
                                >
                                    Clear Filter
                                </button>
                            )}

                            <div className="relative">
                                <button
                                    onClick={() => setShowLineExportMenu(!showLineExportMenu)}
                                    className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                                    style={{ backgroundColor: '#5D8DF3' }}
                                    title="Download"
                                >
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                                {showLineExportMenu && (
                                    <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                        <button
                                            onClick={() => handleLineExport('jpeg')}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg"
                                        >
                                            Export JPEG
                                        </button>
                                        <button
                                            onClick={() => handleLineExport('excel')}
                                            className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg"
                                        >
                                            Export Excel
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    <LineChart
                        labels={lineChartData.labels}
                        datasets={lineChartData.datasets}
                        yAxisLabel="Total Amount"
                        y1AxisLabel="Conversion Rate (%)"
                        dualAxis={true}
                    />
                </div>

                {/* Donut Chart - Status Breakdown (1/3 width) */}
                <div className="lg:col-span-1">
                    <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                            <h3 className="text-base font-semibold" style={{ color: '#5D8FEE' }}>
                                Lead Status
                            </h3>
                            <span className="text-base font-semibold text-black">
                                Total {donutChartData && abbreviateNumber(donutChartData.total)}
                            </span>
                        </div>
                        <div className="relative">
                            <button
                                onClick={() => setShowDonutExportMenu(!showDonutExportMenu)}
                                className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                                style={{ backgroundColor: '#5D8DF3' }}
                                title="Download"
                            >
                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                            </button>
                            {showDonutExportMenu && (
                                <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                    <button
                                        onClick={() => handleDonutExport('jpeg')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg"
                                    >
                                        Export JPEG
                                    </button>
                                    <button
                                        onClick={() => handleDonutExport('excel')}
                                        className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg"
                                    >
                                        Export Excel
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                    {donutChartData && (
                        <DonutChart
                            labels={donutChartData.labels}
                            data={donutChartData.data}
                            backgroundColor={donutChartData.backgroundColor}
                        />
                    )}
                </div>
            </div>
        </div>
    );
};

export default ChartsSection;
