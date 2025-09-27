import React, { useState, useCallback } from 'react';
import { UploadedImage, AspectRatio, ClarityCheckResult } from './types';
import { checkFaceClarity, generateMergedImage } from './services/geminiService';
import { ASPECT_RATIOS, PROMPT_SUGGESTIONS, BACKGROUND_SUGGESTIONS, CAMERA_ANGLE_SUGGESTIONS, LIGHTING_SUGGESTIONS } from './constants';
import ImageUploader from './components/ImageUploader';
import OptionSelector from './components/OptionSelector';
import AspectRatioSelector from './components/AspectRatioSelector';
import ResultDisplay from './components/ResultDisplay';
import Spinner from './components/Spinner';


const App: React.FC = () => {
    const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
    const [selectedImage, setSelectedImage] = useState<UploadedImage | null>(null);
    const [prompts, setPrompts] = useState<string[]>([]);
    const [customPrompt, setCustomPrompt] = useState('');
    const [backgroundPrompts, setBackgroundPrompts] = useState<string[]>([]);
    const [customBackgroundPrompt, setCustomBackgroundPrompt] = useState('');
    const [cameraAnglePrompts, setCameraAnglePrompts] = useState<string[]>([]);
    const [customCameraAnglePrompt, setCustomCameraAnglePrompt] = useState('');
    const [lightingPrompts, setLightingPrompts] = useState<string[]>([]);
    const [customLightingPrompt, setCustomLightingPrompt] = useState('');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>(ASPECT_RATIOS[0]);
    const [isLoading, setIsLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    const [generatedImage, setGeneratedImage] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);

    const handleImageUpload = useCallback(async (files: FileList) => {
        setIsLoading(true);
        setLoadingMessage('Đang phân tích độ rõ nét của khuôn mặt...');
        setError(null);

        const newImages: UploadedImage[] = [];
        for (const file of Array.from(files)) {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64 = (e.target?.result as string).split(',')[1];
                const mimeType = file.type;

                try {
                    const clarityResult: ClarityCheckResult = await checkFaceClarity(base64, mimeType);
                    newImages.push({
                        id: `${file.name}-${Date.now()}`,
                        file,
                        base64,
                        mimeType,
                        clarity: clarityResult,
                    });

                    // Update state after each image is processed
                    setUploadedImages(prev => [...prev, ...newImages.filter(img => !prev.some(p => p.id === img.id))]);
                } catch (err) {
                    setError('Phân tích độ nét khuôn mặt không thành công. Vui lòng thử lại.');
                    console.error(err);
                } finally {
                   setIsLoading(false);
                }
            };
            reader.readAsDataURL(file);
        }
    }, []);
    
    const handleGenerate = async () => {
        if (!selectedImage) {
            setError("Vui lòng chọn một hình ảnh khuôn mặt rõ nét.");
            return;
        }

        const formatPromptPart = (label: string, selections: string[], custom: string) => {
            const all = [...selections, custom].filter(p => p.trim() !== '');
            if (all.length === 0) return '';
            return `${label}: ${all.join(', ')}.`;
        };
    
        const stylePrompt = formatPromptPart('Phong cách và chủ đề', prompts, customPrompt);
        const backgroundPrompt = formatPromptPart('Bối cảnh/thiết lập', backgroundPrompts, customBackgroundPrompt);
        const anglePrompt = formatPromptPart('Góc máy', cameraAnglePrompts, customCameraAnglePrompt);
        const lightingPrompt = formatPromptPart('Ánh sáng', lightingPrompts, customLightingPrompt);
    
        const combinedPrompts = [stylePrompt, backgroundPrompt, anglePrompt, lightingPrompt].filter(p => p).join(' ');

        if (!combinedPrompts) {
            setError("Vui lòng cung cấp ít nhất một mô tả về phong cách, bối cảnh, góc máy hoặc ánh sáng.");
            return;
        }

        if (selectedImage.clarity && selectedImage.clarity.score < 50) {
            setError("Hình ảnh đã chọn có độ nét khuôn mặt thấp. Vui lòng sử dụng ảnh rõ hơn để có kết quả tốt hơn.");
            return;
        }
        
        setIsLoading(true);
        setLoadingMessage('Đang kết hợp khuôn mặt với ý tưởng... Việc này có thể mất một chút thời gian.');
        setError(null);
        setGeneratedImage(null);

        try {
            const resultBase64 = await generateMergedImage(selectedImage.base64, selectedImage.mimeType, combinedPrompts, aspectRatio);
            setGeneratedImage(resultBase64);
        // FIX: Corrected syntax for catch block. It should be `catch (err) {` instead of `catch (err) => {`.
        } catch (err) {
            setError('Đã xảy ra lỗi trong quá trình tạo ảnh. Vui lòng kiểm tra console và thử lại.');
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };
    
    const isReadyToGenerate = selectedImage !== null && (
        prompts.length > 0 || customPrompt.trim().length > 0 ||
        backgroundPrompts.length > 0 || customBackgroundPrompt.trim().length > 0 ||
        cameraAnglePrompts.length > 0 || customCameraAnglePrompt.trim().length > 0 ||
        lightingPrompts.length > 0 || customLightingPrompt.trim().length > 0
    );

    return (
        <div className="min-h-screen bg-gray-900 text-gray-200 font-sans p-4 sm:p-6 lg:p-8">
            <div className="max-w-screen-2xl mx-auto">
                <header className="text-center mb-10">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
                        AI Hoán Đổi Gương Mặt
                    </h1>
                    <p className="mt-2 text-lg text-gray-400">
                        Tạo ra những hình ảnh mới tuyệt đẹp bằng cách kết hợp khuôn mặt của bạn với các ý tưởng sáng tạo.
                    </p>
                </header>

                <main className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
                    {/* Column 1: Configuration Steps */}
                    <div className="flex flex-col gap-8">
                         {/* Step 2: Prompts */}
                         <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
                           <h2 className="text-2xl font-bold mb-4 text-indigo-400 border-b border-gray-600 pb-2">Bước 2: Thêm phong cách</h2>
                           <OptionSelector
                                label="Gợi ý phong cách"
                                suggestions={PROMPT_SUGGESTIONS}
                                selectedOptions={prompts}
                                onOptionToggle={setPrompts}
                                customOption={customPrompt}
                                onCustomOptionChange={setCustomPrompt}
                                customOptionPlaceholder="VD: Một hiệp sĩ mặc áo giáp sáng bóng..."
                            />
                        </div>

                        {/* Step 3: Background */}
                        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
                           <h2 className="text-2xl font-bold mb-4 text-indigo-400 border-b border-gray-600 pb-2">Bước 3: Xác định bối cảnh</h2>
                            <OptionSelector
                                label="Gợi ý bối cảnh"
                                suggestions={BACKGROUND_SUGGESTIONS}
                                selectedOptions={backgroundPrompts}
                                onOptionToggle={setBackgroundPrompts}
                                customOption={customBackgroundPrompt}
                                onCustomOptionChange={setCustomBackgroundPrompt}
                                customOptionPlaceholder="VD: Bên trong buồng lái tàu vũ trụ..."
                            />
                        </div>
                        
                        {/* Step 4: Camera Angle */}
                        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
                           <h2 className="text-2xl font-bold mb-4 text-indigo-400 border-b border-gray-600 pb-2">Bước 4: Đặt góc máy</h2>
                            <OptionSelector
                                label="Gợi ý góc máy"
                                suggestions={CAMERA_ANGLE_SUGGESTIONS}
                                selectedOptions={cameraAnglePrompts}
                                onOptionToggle={setCameraAnglePrompts}
                                customOption={customCameraAnglePrompt}
                                onCustomOptionChange={setCustomCameraAnglePrompt}
                                customOptionPlaceholder="VD: Chụp từ dưới lên..."
                            />
                        </div>

                        {/* Step 5: Lighting */}
                        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
                           <h2 className="text-2xl font-bold mb-4 text-indigo-400 border-b border-gray-600 pb-2">Bước 5: Chọn ánh sáng</h2>
                            <OptionSelector
                                label="Gợi ý ánh sáng"
                                suggestions={LIGHTING_SUGGESTIONS}
                                selectedOptions={lightingPrompts}
                                onOptionToggle={setLightingPrompts}
                                customOption={customLightingPrompt}
                                onCustomOptionChange={setCustomLightingPrompt}
                                customOptionPlaceholder="VD: Ánh nến lung linh..."
                            />
                        </div>

                        {/* Step 6: Aspect Ratio */}
                        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700">
                           <h2 className="text-2xl font-bold mb-4 text-indigo-400 border-b border-gray-600 pb-2">Bước 6: Chọn tỷ lệ</h2>
                           <AspectRatioSelector ratios={ASPECT_RATIOS} selectedRatio={aspectRatio} onSelect={setAspectRatio} />
                        </div>
                    </div>

                    {/* Column 2: Image Upload */}
                    <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 lg:sticky lg:top-8">
                       <h2 className="text-2xl font-bold mb-4 text-indigo-400 border-b border-gray-600 pb-2">Bước 1: Tải lên ảnh chân dung</h2>
                       <ImageUploader onUpload={handleImageUpload} images={uploadedImages} selectedImageId={selectedImage?.id} onSelect={setSelectedImage} />
                    </div>

                    {/* Column 3: Generation and Result */}
                    <div className="flex flex-col space-y-8 lg:sticky lg:top-8">
                        {/* Generate Button */}
                        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex flex-col items-center">
                            <h2 className="text-2xl font-bold mb-4 text-indigo-400">Sẵn sàng sáng tạo?</h2>
                            <button
                                onClick={handleGenerate}
                                disabled={!isReadyToGenerate || isLoading}
                                className="w-full px-8 py-4 text-xl font-bold text-white bg-gradient-to-r from-purple-600 to-indigo-600 rounded-lg shadow-lg hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-purple-500/50 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:saturate-50"
                            >
                                {isLoading ? 'Đang tạo...' : 'Kết hợp hình ảnh'}
                            </button>
                             {error && <p className="text-red-400 mt-4 text-center">{error}</p>}
                        </div>
                        
                        {/* Result Area */}
                        <div className="bg-gray-800/50 p-6 rounded-2xl shadow-lg border border-gray-700 flex-grow flex flex-col items-center justify-center min-h-[400px]">
                            {isLoading && <Spinner message={loadingMessage} />}
                            {!isLoading && generatedImage && <ResultDisplay image={generatedImage} />}
                            {!isLoading && !generatedImage && (
                                <div className="text-center text-gray-500">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                                    <p className="mt-2 text-lg">Tuyệt tác của bạn sẽ xuất hiện ở đây.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
};

export default App;