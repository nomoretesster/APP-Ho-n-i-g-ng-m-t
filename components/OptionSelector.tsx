import React from 'react';

interface OptionSelectorProps {
    label: string;
    suggestions: string[];
    selectedOptions: string[];
    onOptionToggle: (options: string[]) => void;
    customOption: string;
    onCustomOptionChange: (value: string) => void;
    customOptionPlaceholder: string;
}

const OptionSelector: React.FC<OptionSelectorProps> = ({
    label,
    suggestions,
    selectedOptions,
    onOptionToggle,
    customOption,
    onCustomOptionChange,
    customOptionPlaceholder,
}) => {
    const handleToggle = (option: string) => {
        const newSelection = selectedOptions.includes(option)
            ? selectedOptions.filter(p => p !== option)
            : [...selectedOptions, option];
        onOptionToggle(newSelection);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">{label}</label>
                <div className="grid grid-cols-2 gap-2">
                    {suggestions.map(option => {
                        const isSelected = selectedOptions.includes(option);
                        return (
                            <button
                                key={option}
                                onClick={() => handleToggle(option)}
                                className={`w-full text-center px-3 py-2 text-sm font-medium rounded-md transition-all duration-200 ${
                                    isSelected
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div>
                <label htmlFor={`custom-${label.replace(/\s+/g, '-').toLowerCase()}`} className="block text-sm font-medium text-gray-400 mb-2">
                    Hoặc tự thêm
                </label>
                <textarea
                    id={`custom-${label.replace(/\s+/g, '-').toLowerCase()}`}
                    rows={2}
                    value={customOption}
                    onChange={(e) => onCustomOptionChange(e.target.value)}
                    placeholder={customOptionPlaceholder}
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
            </div>
        </div>
    );
};

export default OptionSelector;