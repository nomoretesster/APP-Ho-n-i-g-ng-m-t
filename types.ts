
export interface ClarityCheckResult {
    score: number; // 0-100
    feedback: string;
    isUsable: boolean;
}

export interface UploadedImage {
    id: string;
    file: File;
    base64: string;
    mimeType: string;
    clarity: ClarityCheckResult | null;
}

export interface AspectRatio {
    label: string;
    value: '1:1' | '16:9' | '9:16' | '4:3' | '3:4';
}
