
import React from 'react';
import { AspectRatio } from '../types';

interface AspectRatioSelectorProps {
    ratios: AspectRatio[];
    selectedRatio: AspectRatio;
    onSelect: (ratio: AspectRatio) => void;
}

const AspectRatioSelector: React.FC<AspectRatioSelectorProps> = ({ ratios, selectedRatio, onSelect }) => {
    return (
        <div className="flex flex-wrap gap-3">
            {ratios.map(ratio => {
                const isSelected = ratio.value === selectedRatio.value;
                return (
                    <button
                        key={ratio.value}
                        onClick={() => onSelect(ratio)}
                        className={`px-4 py-2 text-sm font-semibold rounded-md transition-all duration-200 ${
                            isSelected
                                ? 'bg-purple-600 text-white shadow-lg scale-105'
                                : 'bg-gray-700 text-gray-300 hover:bg-gray-600 hover:text-white'
                        }`}
                    >
                        {ratio.label}
                    </button>
                );
            })}
        </div>
    );
};

export default AspectRatioSelector;
