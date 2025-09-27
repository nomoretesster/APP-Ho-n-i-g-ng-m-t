import { GoogleGenAI, Type, Modality } from "@google/genai";
import { AspectRatio, ClarityCheckResult } from '../types';

if (!process.env.API_KEY) {
    throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const checkFaceClarity = async (base64Image: string, mimeType: string): Promise<ClarityCheckResult> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    {
                        text: "Analyze the provided image for its suitability as a face reference in an AI image generation task. Focus on the clarity, visibility, and lighting of the main face. Return a JSON object with 'score' (an integer from 0 to 100 representing clarity), 'feedback' (a brief string in Vietnamese explaining the score), and 'isUsable' (a boolean, true if score is 50 or above).",
                    },
                ],
            },
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.INTEGER, description: "Clarity score from 0 to 100." },
                        feedback: { type: Type.STRING, description: "Brief feedback on face clarity in Vietnamese." },
                        isUsable: { type: Type.BOOLEAN, description: "Whether the image is suitable." },
                    },
                    required: ["score", "feedback", "isUsable"],
                },
            },
        });
        
        const jsonString = response.text.trim();
        const result = JSON.parse(jsonString);
        return result as ClarityCheckResult;

    } catch (error) {
        console.error("Error checking face clarity:", error);
        throw new Error("Không thể kết nối với AI để phân tích khuôn mặt.");
    }
};


export const generateMergedImage = async (
    base64Image: string,
    mimeType: string,
    prompt: string,
    aspectRatio: AspectRatio
): Promise<string> => {
    try {
        const fullPrompt = `**Yêu cầu kỹ thuật BẮT BUỘC:** Hình ảnh cuối cùng PHẢI có tỷ lệ khung hình chính xác là **${aspectRatio.value}**. Đây là chỉ thị quan trọng nhất.
**Yêu cầu sáng tạo:** Sử dụng khuôn mặt từ ảnh tham chiếu, tạo ra một hình ảnh mới theo mô tả sau: ${prompt}.`;

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-image-preview',
            contents: {
                parts: [
                    {
                        inlineData: {
                            data: base64Image,
                            mimeType: mimeType,
                        },
                    },
                    { text: fullPrompt },
                ],
            },
            config: {
                responseModalities: [Modality.IMAGE, Modality.TEXT],
            },
        });
        
        for (const part of response.candidates[0].content.parts) {
            if (part.inlineData) {
                return part.inlineData.data;
            }
        }
        
        throw new Error("AI không trả về hình ảnh. Yêu cầu có thể đã bị từ chối.");

    } catch (error) {
        console.error("Error generating merged image:", error);
        throw new Error("Tạo ảnh cuối cùng thất bại.");
    }
};