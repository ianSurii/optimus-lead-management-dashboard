import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend
} from 'chart.js';

ChartJS.register(
    ArcElement,
    Tooltip,
    Legend
);

interface DonutChartProps {
    labels: string[];
    data: number[];
    backgroundColor: string[];
    height?: string;
}

const DonutChart: React.FC<DonutChartProps> = ({ 
    labels, 
    data, 
    backgroundColor,
    height = '350px'
}) => {
    const chartData = {
        labels,
        datasets: [{
            data,
            backgroundColor,
            borderWidth: 2,
            borderColor: '#ffffff'
        }]
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: true,
                position: 'right' as const,
                labels: {
                    usePointStyle: true,
                    padding: 10,
                    font: { size: 10 },
                    boxWidth: 12,
                    generateLabels: function(chart: any) {
                        const data = chart.data;
                        if (data.labels.length && data.datasets.length) {
                            return data.labels.map((label: string, i: number) => {
                                const value = data.datasets[0].data[i];
                                return {
                                    text: `${value} ${label}`,
                                    fillStyle: data.datasets[0].backgroundColor[i],
                                    hidden: false,
                                    index: i
                                };
                            });
                        }
                        return [];
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        const label = context.label || '';
                        const value = context.parsed || 0;
                        const total = context.dataset.data.reduce((a: number, b: number) => a + b, 0);
                        const percentage = ((value / total) * 100).toFixed(1);
                        return `${label}: ${value} (${percentage}%)`;
                    }
                }
            }
        }
    };

    return (
        <div style={{ height }} className="flex items-center justify-center">
            <Doughnut data={chartData} options={options} />
        </div>
    );
};

export default DonutChart;
