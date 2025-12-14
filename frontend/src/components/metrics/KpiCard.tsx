import React from 'react';
import { IKpiMetric } from '../../types/Dashboard';

interface KpiCardProps {
    kpi: IKpiMetric;
}

const KpiCard: React.FC<KpiCardProps> = ({ kpi }) => {
    const isUp = kpi.change_direction === 'up';
    const isPositiveChange = isUp;
    const changeColor = isPositiveChange ? '#18E8B8' : '#F90813';
    
    const [displayValue, setDisplayValue] = React.useState(0);

    React.useEffect(() => {
        let start = 0;
        const end = Number(kpi.value);
        const duration = 1000;
        const increment = end / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start >= end) {
                setDisplayValue(end);
                clearInterval(timer);
            } else {
                setDisplayValue(Math.floor(start));
            }
        }, 16);
        
        return () => clearInterval(timer);
    }, [kpi.value]);
    
    // Get the appropriate unit display
    const getValueDisplay = () => {
        if (kpi.unit === 'USD') return `$${Number(displayValue).toLocaleString()}`;
        if (kpi.unit === '%') return `${displayValue}%`;
        if (kpi.unit === 'days') return `${displayValue} days`;
        return `${displayValue}`;
    };

    const getPreviousValueDisplay = () => {
        if (kpi.unit === 'USD') return `$${Number(kpi.previous_value).toLocaleString()}`;
        if (kpi.unit === '%') return `${kpi.previous_value}%`;
        if (kpi.unit === 'days') return `${kpi.previous_value} days`;
        if (kpi.unit === 'count') return `${kpi.previous_value}`;
        return `${kpi.previous_value}`;
    };
    
    return (
        <div 
            className="flex items-center gap-3 p-4 flex-1 min-w-[250px] hover:scale-105 hover:shadow-lg transition-all duration-300 ease-out"
            style={{
                animation: 'slideInFromBottom 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) both'
            }}
        >
            <style>{`
                @keyframes slideInFromBottom {
                    from {
                        opacity: 0;
                        transform: translateY(30px) scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }
            `}</style>
            {/* Circle with dot */}
            <div 
                className="relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full flex-shrink-0"
                style={{ 
                    backgroundColor: `${kpi.color}30`,
                    animation: 'pulseGlow 2.5s ease-in-out infinite',
                    boxShadow: `0 0 0 0 ${kpi.color}40`
                }}
            >
                <style>{`
                    @keyframes pulseGlow {
                        0%, 100% {
                            transform: scale(1);
                            box-shadow: 0 0 0 0 ${kpi.color}40;
                        }
                        50% {
                            transform: scale(1.08);
                            box-shadow: 0 0 0 8px ${kpi.color}00;
                        }
                    }
                    @keyframes dotPulse {
                        0%, 100% {
                            transform: scale(1);
                        }
                        50% {
                            transform: scale(1.3);
                        }
                    }
                `}</style>
                <div 
                    className="w-3 h-3 rounded-full"
                    style={{ 
                        backgroundColor: kpi.color,
                        animation: 'dotPulse 2.5s ease-in-out infinite'
                    }}
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
                    <span 
                        className="text-sm inline-block"
                        style={{ 
                            color: changeColor,
                            animation: isUp ? 'bounceUp 1s ease-in-out infinite' : 'bounceDown 1s ease-in-out infinite'
                        }}
                    >
                        <style>{`
                            @keyframes bounceUp {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-3px); }
                            }
                            @keyframes bounceDown {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(3px); }
                            }
                        `}</style>
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
