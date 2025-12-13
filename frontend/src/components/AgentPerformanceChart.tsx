// src/components/AgentPerformanceChart.tsx

import React, { useState, useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartOptions
} from 'chart.js';
import { abbreviateNumber } from '../utils/numberFormatter';
import { exportToJPEG, exportToExcel, chartToExcelData } from '../utils/downloadUtils';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

interface AgentPerformanceData {
    agent_id: string;
    agent_name: string;
    released_amount: number;
}

interface AgentPerformanceChartProps {
    data: AgentPerformanceData[];
}

const AgentPerformanceChart: React.FC<AgentPerformanceChartProps> = ({ data }) => {
    const [showExportMenu, setShowExportMenu] = useState(false);

    const chartData = useMemo(() => {
        if (!data || data.length === 0) {
            return {
                labels: [],
                datasets: []
            };
        }

        return {
            labels: data.map(agent => agent.agent_name),
            datasets: [
                {
                    label: 'Released Amount',
                    data: data.map(agent => agent.released_amount),
                    backgroundColor: '#5D8FEE',
                    borderColor: '#5D8FEE',
                    borderWidth: 1,
                    barThickness: 30,
                }
            ]
        };
    }, [data]);

    const options: ChartOptions<'bar'> = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        return `Released: ${abbreviateNumber(context.parsed.y)}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                },
                ticks: {
                    font: {
                        size: 11
                    }
                }
            },
            y: {
                grid: {
                    display: true
                },
                ticks: {
                    maxTicksLimit: 4,
                    callback: function(value: any) {
                        return abbreviateNumber(value);
                    }
                },
                border: {
                    display: false
                }
            }
        }
    };

    const handleExport = async (format: 'jpeg' | 'excel') => {
        if (format === 'jpeg') {
            await exportToJPEG('agent-performance-chart', 'agent-performance');
        } else {
            const excelData = data.map(agent => ({
                'Agent Name': agent.agent_name,
                'Released Amount': agent.released_amount
            }));
            exportToExcel(excelData, 'agent-performance', 'Agent Performance');
        }
        setShowExportMenu(false);
    };

    if (!data || data.length === 0) {
        return null;
    }

    return (
        <div className="bg-white rounded-lg shadow-sm p-6 h-full flex flex-col" id="agent-performance-chart">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-base font-semibold" style={{ color: '#5D8FEE' }}>
                    Agent Performance
                </h3>
                
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

            <div className="flex-1" style={{ minHeight: '300px' }}>
                <Bar data={chartData} options={options} />
            </div>
        </div>
    );
};

export default AgentPerformanceChart;
