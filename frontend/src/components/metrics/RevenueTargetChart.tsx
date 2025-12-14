import React, { useState, useMemo } from 'react';
import LineChart from '../charts/LineChart';
import CustomSelect from '../common/CustomSelect';
import { abbreviateNumber } from '../../utils/numberFormatter';

interface BranchRevenueTarget {
    branch_name: string;
    daily_target: number[];
    daily_revenue: number[]; // closed + sold
}

interface RevenueTargetData {
    labels: string[]; // dates
    branches: {
        [branch_id: string]: BranchRevenueTarget;
    };
}

interface RevenueTargetChartProps {
    data: RevenueTargetData | null;
    availableBranches: { value: string; label: string }[];
    userBranchId?: string;
}

const RevenueTargetChart: React.FC<RevenueTargetChartProps> = ({
    data,
    availableBranches,
    userBranchId
}) => {
    const [selectedBranch, setSelectedBranch] = useState<string>(userBranchId || 'all');
    const [showExportMenu, setShowExportMenu] = useState(false);

    const branchOptions = useMemo(() => {
        return [
            { value: 'all', label: 'All Branches' },
            ...availableBranches
        ];
    }, [availableBranches]);

    const getBranchName = () => {
        if (selectedBranch === 'all') return 'All Branches';
        return branchOptions.find(b => b.value === selectedBranch)?.label || 'Branch';
    };

    const chartData = useMemo(() => {
        if (!data || !data.branches) {
            return {
                labels: [],
                datasets: []
            };
        }

        // Convert date labels to ordinal format (1st, 2nd, 3rd, etc.)
        const ordinalLabels = data.labels.map((_, index) => {
            const day = index + 1;
            const suffix = day === 1 ? 'st' : day === 2 ? 'nd' : day === 3 ? 'rd' : 'th';
            return `${day}${suffix}`;
        });

        if (selectedBranch === 'all') {
            // Aggregate all branches
            const aggregatedTarget = new Array(data.labels.length).fill(0);
            const aggregatedRevenue = new Array(data.labels.length).fill(0);

            Object.values(data.branches).forEach(branch => {
                branch.daily_target.forEach((val, idx) => {
                    aggregatedTarget[idx] += val;
                });
                branch.daily_revenue.forEach((val, idx) => {
                    aggregatedRevenue[idx] += val;
                });
            });

            return {
                labels: ordinalLabels,
                datasets: [
                    {
                        label: 'Target',
                        data: aggregatedTarget,
                        borderColor: '#5962FF',
                        backgroundColor: '#5962FF',
                        borderWidth: 4,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Revenue (Closed + Sold)',
                        data: aggregatedRevenue,
                        borderColor: '#18E8B8',
                        backgroundColor: '#18E8B8',
                        borderWidth: 4,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            };
        } else {
            // Single branch
            const branchData = data.branches[selectedBranch];
            if (!branchData) {
                return { labels: ordinalLabels, datasets: [] };
            }

            return {
                labels: ordinalLabels,
                datasets: [
                    {
                        label: 'Target',
                        data: branchData.daily_target,
                        borderColor: '#5962FF',
                        backgroundColor: '#5962FF',
                        borderWidth: 4,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    },
                    {
                        label: 'Revenue (Closed + Sold)',
                        data: branchData.daily_revenue,
                        borderColor: '#18E8B8',
                        backgroundColor: '#18E8B8',
                        borderWidth: 4,
                        fill: false,
                        tension: 0.1,
                        pointRadius: 4,
                        pointHoverRadius: 6
                    }
                ]
            };
        }
    }, [data, selectedBranch, branchOptions]);

    const handleExport = (format: 'jpeg' | 'excel') => {
        console.log(`Exporting revenue target chart as ${format}`);
        setShowExportMenu(false);
        // TODO: Implement actual export functionality
    };

    if (!data) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold" style={{ color: '#5D8FEE' }}>
                    Revenue by Branch
                </h3>
                
                <div className="flex items-center gap-3">
                    <CustomSelect
                        options={branchOptions}
                        value={selectedBranch}
                        onChange={setSelectedBranch}
                        placeholder="All Branches"
                        width="w-48"
                        height="h-10"
                    />

                    <div className="relative">
                        <button
                            onClick={() => setShowExportMenu(!showExportMenu)}
                            className="w-9 h-9 rounded-full flex items-center justify-center hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: '#5D8DF3' }}
                            title="Download"
                        >
                            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </button>
                        {showExportMenu && (
                            <div className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
                                <button
                                    onClick={() => handleExport('jpeg')}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-t-lg"
                                >
                                    Export JPEG
                                </button>
                                <button
                                    onClick={() => handleExport('excel')}
                                    className="w-full px-4 py-2 text-left text-sm hover:bg-gray-100 rounded-b-lg"
                                >
                                    Export Excel
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex-1">
                <LineChart
                    labels={chartData.labels}
                    datasets={chartData.datasets}
                    yAxisLabel="Revenue (KES)"
                    height="300px"
                    dualAxis={false}
                    showLegend={false}
                />
            </div>
        </div>
    );
};

export default RevenueTargetChart;
