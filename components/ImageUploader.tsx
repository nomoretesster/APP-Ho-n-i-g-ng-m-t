import React, { useRef } from 'react';
import { UploadedImage } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface ImageUploaderProps {
    onUpload: (files: FileList) => void;
    images: UploadedImage[];
    selectedImageId: string | null;
    onSelect: (image: UploadedImage) => void;
}

const getClarityColor = (score: number) => {
    if (score >= 75) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
};

const ImageCard: React.FC<{ image: UploadedImage; isSelected: boolean; onSelect: () => void; }> = ({ image, isSelected, onSelect }) => {
    const score = image.clarity?.score ?? 0;
    const color = getClarityColor(score);

    return (
        <div 
            onClick={onSelect}
            className={`relative group cursor-pointer border-2 rounded-lg overflow-hidden transition-all duration-300 ${isSelected ? 'border-purple-500 scale-105 shadow-2xl' : 'border-gray-600 hover:border-purple-400'}`}
        >
            <img src={URL.createObjectURL(image.file)} alt={image.file.name} className="w-full h-full object-cover aspect-square" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-2 text-white">
                {image.clarity ? (
                     <div className="text-center">
                        <p className={`text-base font-bold ${color} [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)]`}>{score}% Rõ nét</p>
                        <p className="text-xs text-gray-200 [text-shadow:1px_1px_2px_rgba(0,0,0,0.8)] truncate">{image.clarity.feedback}</p>
                    </div>
                ) : (
                    <p className="text-sm text-center text-gray-300">Đang phân tích...</p>
                )}
            </div>
             {isSelected && (
                <div className="absolute top-2 right-2 bg-purple-600 text-white rounded-full px-2 py-1 text-xs font-bold">
                    Đã chọn
                </div>
            )}
        </div>
    );
};

const ImageUploader: React.FC<ImageUploaderProps> = ({ onUpload, images, selectedImageId, onSelect }) => {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            onUpload(e.target.files);
        }
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
            onUpload(e.dataTransfer.files);
        }
    };
    
    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        e.stopPropagation();
    };

    return (
        <div className="space-y-4">
            <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center w-full p-8 border-2 border-dashed border-gray-600 rounded-lg cursor-pointer hover:bg-gray-700/50 hover:border-purple-500 transition-colors"
            >
                <UploadIcon className="w-12 h-12 text-gray-500 mb-3" />
                <p className="text-center text-gray-400">
                    <span className="font-semibold text-purple-400">Nhấp để tải lên</span> hoặc kéo và thả
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, hoặc WEBP. Gương mặt rõ nét cho kết quả tốt nhất.</p>
                <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    multiple
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                />
            </div>

            {images.length > 0 && (
                <div className="grid grid-cols-2 gap-4">
                    {images.map(image => (
                        <ImageCard 
                            key={image.id}
                            image={image}
                            isSelected={image.id === selectedImageId}
                            onSelect={() => onSelect(image)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default ImageUploader;