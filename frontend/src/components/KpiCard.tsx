// src/components/KpiCard.tsx

import React from 'react';
import { IKpiMetric } from '../types/Dashboard';

interface KpiCardProps {
    kpi: IKpiMetric;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
    const isUp = kpi.change_direction === 'up';
    const isPositiveChange = isUp;
    const changeColor = isPositiveChange ? '#18E8B8' : '#F90813';
    
    // Get the appropriate unit display
    const getValueDisplay = () => {
        if (kpi.unit === 'USD') return `$${Number(kpi.value).toLocaleString()}`;
        if (kpi.unit === '%') return `${kpi.value}%`;
        if (kpi.unit === 'days') return `${kpi.value} days`;
        return `${kpi.value}`;
    };

    const getPreviousValueDisplay = () => {
        if (kpi.unit === 'USD') return `$${Number(kpi.previous_value).toLocaleString()}`;
        if (kpi.unit === '%') return `${kpi.previous_value}%`;
        if (kpi.unit === 'days') return `${kpi.previous_value} days`;
        if (kpi.unit === 'count') return `${kpi.previous_value}`;
        return `${kpi.previous_value}`;
    };
    
    return (
        <div className="flex items-center gap-3 p-4 flex-1 min-w-[250px]">
            {/* Circle with dot */}
            <div 
                className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0"
                style={{ backgroundColor: `${kpi.color}30` }}
            >
                <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: kpi.color }}
                />
            </div>
            
            {/* Content */}
            <div className="flex flex-col gap-0.5 min-w-0">
                {/* Value and change icon */}
                <div className="flex items-center gap-2">
                    <span 
                        className="text-xl sm:text-2xl font-extrabold truncate"
                        style={{ color: '#5D8FEE' }}
                    >
                        {getValueDisplay()}
                    </span>
                    <span className="text-sm" style={{ color: changeColor }}>
                        {isUp ? '▲' : '▼'}
                    </span>
                </div>
                
                {/* Title */}
                <p className="text-xs sm:text-sm font-medium text-gray-700 truncate">
                    {kpi.label}
                </p>
                
                {/* Previous value */}
                <p className="text-[10px] sm:text-xs text-gray-700 truncate">
                    Was {getPreviousValueDisplay()} 31 days ago
                </p>
            </div>
        </div>
    );
};

export default KpiCard;
