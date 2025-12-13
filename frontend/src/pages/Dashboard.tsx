// src/pages/Dashboard.tsx (Note the .tsx extension)

import React, { useState } from 'react';
import { useDashboardData } from '../hooks/useDashboardData';
import BannerMessage from '../components/BannerMessage';
import { IKpiMetric, ITransaction } from '../types/Dashboard'; // Import types

// Define the prop interface for the KPI Card
interface KpiCardProps {
    kpi: IKpiMetric;
}

const ChartPlaceholder: React.FC<{ title: string; type: string }> = ({ title, type }) => (
    <div className="h-full p-6 bg-white rounded-xl shadow-lg">
        <h3 className="mb-4 text-lg font-semibold border-b pb-2 text-gray-700">{title} ({type})</h3>
        <div className="flex items-center justify-center h-48 text-gray-400 border-dashed border-2 rounded-lg">
            [Chart Integration Area - e.g., Recharts]
        </div>
    </div>
);

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => (
    <div className={`p-6 bg-white rounded-xl shadow-lg transition-transform duration-300 hover:scale-[1.02] border-l-4 ${kpi.change_direction === 'up' ? 'border-green-500' : 'border-red-500'}`}>
        <p className="text-sm font-medium text-gray-500">{kpi.label}</p>
        <p className="text-3xl font-bold text-gray-900 mt-1">{kpi.unit === 'USD' ? `$${kpi.value}` : `${kpi.value} ${kpi.unit}`}</p>
        <div className={`flex items-center text-sm mt-3 ${kpi.change_direction === 'up' ? 'text-green-600' : 'text-red-600'}`}>
            <span className='mr-1'>{kpi.change_direction === 'up' ? '▲' : '▼'} {kpi.change_percentage}%</span>
            <span className="text-gray-500">vs Last Period</span>
        </div>
    </div>
);

const Dashboard: React.FC = () => {
    // State type is inferred, but filters can be typed for safety
    const [filters, setFilters] = useState<{ branch?: string }>({}); 
    const { data, isLoading, error, refreshData } = useDashboardData(filters);

    // ... (Loading and Error Handling remains the same) ...
    if (isLoading) {
        return <div className="text-center p-12 text-2xl font-semibold text-indigo-600">Loading Dashboard Data...</div>;
    }

    if (error || !data) { // Ensure data exists before destructuring
        return <div className="text-center p-12 text-red-600 bg-red-100 rounded-lg shadow-md">Data Fetch Error: {error || 'No Data.'}</div>;
    }

    // Safe destructuring, guaranteed by the type check above
    const { kpi_metrics, transaction_list, charts } = data;

    return (
        <div>
            <BannerMessage />

            <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-2 lg:grid-cols-4">
                {kpi_metrics.map((kpi: IKpiMetric) => (
                    <KpiCard key={kpi.id} kpi={kpi} />
                ))}
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8 lg:grid-cols-3">
                <div className="lg:col-span-2">
                    <ChartPlaceholder title="Monthly Revenue vs. Target" type="Line Chart" />
                </div>
                <div className="lg:col-span-1">
                    <ChartPlaceholder title="Lead Status Breakdown" type="Pie Chart" />
                </div>
            </div>

            <div className="p-6 bg-white rounded-xl shadow-lg">
                <h3 className="mb-4 text-xl font-semibold text-gray-700">Recent Transactions ({transaction_list.length} Records)</h3>
                {/* A proper ITransaction[] typed component would consume transaction_list here */}
                {/* Example of Transaction List for reference: */}
                <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {transaction_list.slice(0, 5).map((txn: ITransaction) => (
                            <tr key={txn.txn_id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{txn.customer_name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">${txn.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${txn.status === 'Closed' ? 'bg-green-100 text-green-800' : txn.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {txn.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{txn.date}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            
            <button 
                onClick={refreshData} 
                className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
                Force Refresh
            </button>
        </div>
    );
};

export default Dashboard;