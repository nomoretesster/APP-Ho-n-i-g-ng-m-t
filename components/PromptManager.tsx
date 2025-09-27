
import React from 'react';

interface PromptManagerProps {
    suggestions: string[];
    selectedPrompts: string[];
    onPromptToggle: (prompts: string[]) => void;
    customPrompt: string;
    onCustomPromptChange: (value: string) => void;
}

const PromptManager: React.FC<PromptManagerProps> = ({
    suggestions,
    selectedPrompts,
    onPromptToggle,
    customPrompt,
    onCustomPromptChange,
}) => {
    const handleToggle = (prompt: string) => {
        const newSelection = selectedPrompts.includes(prompt)
            ? selectedPrompts.filter(p => p !== prompt)
            : [...selectedPrompts, prompt];
        onPromptToggle(newSelection);
    };

    return (
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-medium text-gray-400 mb-2">Prompt Suggestions</label>
                <div className="flex flex-wrap gap-2">
                    {suggestions.map(prompt => {
                        const isSelected = selectedPrompts.includes(prompt);
                        return (
                            <button
                                key={prompt}
                                onClick={() => handleToggle(prompt)}
                                className={`px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-200 ${
                                    isSelected
                                        ? 'bg-purple-600 text-white shadow-md'
                                        : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                                }`}
                            >
                                {prompt}
                            </button>
                        );
                    })}
                </div>
            </div>
            <div>
                <label htmlFor="custom-prompt" className="block text-sm font-medium text-gray-400 mb-2">
                    Or Add Your Own Prompt
                </label>
                <textarea
                    id="custom-prompt"
                    rows={3}
                    value={customPrompt}
                    onChange={(e) => onCustomPromptChange(e.target.value)}
                    placeholder="e.g., A knight in shining armor, photorealistic, 8k..."
                    className="w-full bg-gray-900 border border-gray-600 rounded-lg px-3 py-2 text-gray-200 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition"
                />
            </div>
        </div>
    );
};

export default PromptManager;
