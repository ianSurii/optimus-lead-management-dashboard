// src/components/CustomSelect.tsx

import React from 'react';

interface SelectOption {
    value: string;
    label: string;
}

interface CustomSelectProps {
    value: string;
    onChange: (value: string) => void;
    options: SelectOption[];
    placeholder: string;
    displayValue?: string;
}

const CustomSelect: React.FC<CustomSelectProps> = ({ 
    value, 
    onChange, 
    options, 
    placeholder,
    displayValue 
}) => {
    const getDisplayText = () => {
        if (!value) return placeholder;
        return displayValue || options.find(opt => opt.value === value)?.label || placeholder;
    };

    return (
        <div className="relative flex-1">
            <select
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="w-full h-[60px] px-4 py-2 border border-gray-300 rounded-3xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition bg-white appearance-none text-sm cursor-pointer text-transparent"
                aria-label={placeholder}
            >
                <option value="">{placeholder}</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <span className="text-lg font-normal w-full text-gray-600">
                    {getDisplayText()}
                </span>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </div>
        </div>
    );
};

export default CustomSelect;
