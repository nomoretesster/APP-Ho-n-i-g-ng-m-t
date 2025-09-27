
import React from 'react';

interface SpinnerProps {
    message?: string;
}

const Spinner: React.FC<SpinnerProps> = ({ message }) => {
    return (
        <div className="flex flex-col items-center justify-center space-y-4 text-center">
            <div className="w-16 h-16 border-4 border-dashed rounded-full animate-spin border-purple-400"></div>
            {message && <p className="text-lg text-gray-400 animate-pulse">{message}</p>}
        </div>
    );
};

export default Spinner;
