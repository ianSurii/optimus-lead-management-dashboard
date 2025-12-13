// src/components/DatePicker.tsx

import React, { useRef } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
}

const DatePicker: React.FC<DatePickerProps> = ({ value, onChange, label }) => {

    const inputRef = useRef<HTMLInputElement>(null);
    const handleContainerClick = () => {
        inputRef.current?.showPicker();
    };

    const formatDateDisplay = (dateString: string) => {
        if (!dateString) return 'Select Date';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    };

    return (
        <div className="relative flex-1"
        
        onClick={handleContainerClick}
        
        >
            <input
                ref={inputRef}
                type="date"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-[60px] px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white text-transparent cursor-pointer"
                aria-label={label || 'Date picker'}
            />
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-sm text-gray-700 font-medium">{formatDateDisplay(value)}</span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            </div>
        </div>
    );
};

export default DatePicker;
