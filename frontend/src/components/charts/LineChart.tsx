// src/components/LineChart.tsx

import React from 'react';
import { Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
} from 'chart.js';
import { abbreviateNumber } from '../../utils/numberFormatter';

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
);

interface LineChartProps {
    labels: string[];
    datasets: Array<{
        label: string;
        data: number[];
        borderColor: string;
        backgroundColor: string;
        yAxisID?: string;
    }>;
    height?: string;
    yAxisLabel?: string;
    y1AxisLabel?: string;
    dualAxis?: boolean;
    showLegend?: boolean;
}

const LineChart: React.FC<LineChartProps> = ({ 
    labels, 
    datasets, 
    height = '350px',
    yAxisLabel = 'Value',
    y1AxisLabel = 'Secondary Value',
    dualAxis = false,
    showLegend = true
}) => {
    const chartData = {
        labels,
        datasets: datasets.map(dataset => ({
            ...dataset,
            tension: 0.4,
            borderWidth: 4,
            pointRadius: 5,
            pointHoverRadius: 7,
            fill: false
        }))
    };

    const scales: any = {
        y: {
            type: 'linear' as const,
            display: true,
            position: 'left' as const,
            title: {
                display: false
            },
            grid: {
                drawOnChartArea: true,
                borderDash: [5, 5],
                color: '#e5e7eb'
            },
            ticks: {
                callback: function(value: any) {
                    return abbreviateNumber(value);
                },
                maxTicksLimit: 4
            },
            border: {
                display: false
            }
        },
        x: {
            grid: {
                display: false
            },
            ticks: {
                callback: function(value: any, index: any) {
                    const ordinals = ['1st', '2nd', '3rd'];
                    if (index < 3) return ordinals[index];
                    return `${index + 1}th`;
                }
            },
            border: {
                display: false
            }
        }
    };

    if (dualAxis) {
        scales.y1 = {
            type: 'linear' as const,
            display: false,
            position: 'right' as const,
            grid: {
                drawOnChartArea: false,
            },
            min: 0,
            max: 100,
            border: {
                display: false
            }
        };
    }

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
            mode: 'index' as const,
            intersect: false,
        },
        plugins: {
            legend: {
                display: showLegend,
                position: 'top' as const,
                align: 'start' as const,
                labels: {
                    usePointStyle: true,
                    padding: 15,
                    font: { size: 11 },
                    boxWidth: 20,
                    generateLabels: function(chart: any) {
                        const datasets = chart.data.datasets;
                        return datasets.slice(0, 3).map((dataset: any, i: number) => ({
                            text: dataset.label,
                            fillStyle: dataset.borderColor,
                            strokeStyle: dataset.borderColor,
                            lineWidth: dataset.borderWidth,
                            hidden: !chart.isDatasetVisible(i),
                            index: i
                        }));
                    }
                }
            },
            tooltip: {
                callbacks: {
                    label: function(context: any) {
                        let label = context.dataset.label || '';
                        if (context.dataset.yAxisID === 'y1') {
                            label += ': ' + context.parsed.y.toFixed(1) + '%';
                        } else {
                            label += ': $' + abbreviateNumber(context.parsed.y);
                        }
                        return label;
                    }
                }
            }
        },
        scales
    };

    return (
        <div style={{ height }}>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default LineChart;
