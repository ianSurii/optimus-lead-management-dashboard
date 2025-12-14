import React, { useState, useRef, useEffect } from 'react';

interface Option {
    value: string;
    label: string;
}

interface MultiSelectCheckboxProps {
    options: Option[];
    selectedValues: string[];
    onChange: (values: string[]) => void;
    placeholder?: string;
    width?: string;
    height?: string;
}

const MultiSelectCheckbox: React.FC<MultiSelectCheckboxProps> = ({
    options,
    selectedValues,
    onChange,
    placeholder = 'Select options',
    width = 'w-full',
    height = 'h-10'
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleToggle = (value: string) => {
        if (selectedValues.includes(value)) {
            onChange(selectedValues.filter(v => v !== value));
        } else {
            onChange([...selectedValues, value]);
        }
    };

    const displayText = selectedValues.length > 0 
        ? `${selectedValues.length} selected`
        : placeholder;

    return (
        <div className={`relative ${width}`} ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full px-3 py-2 text-left bg-white border border-gray-300 rounded-3xl shadow-sm text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${height}`}
            >
                <span className="block truncate text-gray-700">{displayText}</span>
                <span className="absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                </span>
            </button>

            {isOpen && (
                <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-3xl shadow-lg max-h-60 overflow-auto">
                    {options.map((option) => (
                        <label
                            key={option.value}
                            className="flex items-center px-3 py-2 hover:bg-gray-100 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedValues.includes(option.value)}
                                onChange={() => handleToggle(option.value)}
                                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <span className="ml-2 text-sm text-gray-700">{option.label}</span>
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default MultiSelectCheckbox;
