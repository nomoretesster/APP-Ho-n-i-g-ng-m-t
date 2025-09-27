import React from 'react';
import { DownloadIcon } from './icons/DownloadIcon';

interface ResultDisplayProps {
    image: string | null;
}

const ResultDisplay: React.FC<ResultDisplayProps> = ({ image }) => {
    if (!image) return null;

    const imageUrl = `data:image/png;base64,${image}`;

    return (
        <div className="w-full flex flex-col items-center space-y-4 animate-fade-in">
            <h3 className="text-xl font-bold text-gray-300">Tác phẩm của bạn đã sẵn sàng!</h3>
            <div className="relative w-full max-w-lg aspect-auto rounded-lg overflow-hidden shadow-2xl">
                 <img src={imageUrl} alt="Generated result" className="w-full h-full object-contain" />
            </div>
            <a
                href={imageUrl}
                download="tac-pham-hoan-doi-guong-mat.png"
                className="inline-flex items-center gap-2 px-6 py-2 font-semibold text-white bg-green-600 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-4 focus:ring-green-500/50 transition-colors"
            >
                <DownloadIcon className="w-5 h-5" />
                Tải ảnh xuống
            </a>
        </div>
    );
};

export default ResultDisplay;