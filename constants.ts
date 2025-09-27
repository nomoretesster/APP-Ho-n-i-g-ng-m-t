import { AspectRatio } from './types';

export const ASPECT_RATIOS: AspectRatio[] = [
    { label: 'Vuông (1:1)', value: '1:1' },
    { label: 'Màn ảnh rộng (16:9)', value: '16:9' },
    { label: 'Chân dung (9:16)', value: '9:16' },
    { label: 'Phong cảnh (4:3)', value: '4:3' },
    { label: 'Cao (3:4)', value: '3:4' },
];

export const PROMPT_SUGGESTIONS: string[] = [
    'Tranh kỹ thuật số, giả tưởng',
    'Thành phố cyberpunk đèn neon',
    'Chiến binh cổ đại, áo giáp chi tiết',
    'Phi hành gia trong không gian, nền vũ trụ',
    'Chân dung phong cách ấn tượng',
    'Minh họa màu nước rực rỡ',
    'Gothic và bí ẩn',
    'Nhà phát minh Steampunk',
    'Siêu anh hùng, ánh sáng điện ảnh',
    'Phong cách nhân vật Anime',
    'Kiệt tác sơn dầu',
    'Nhân vật hoạt hình Pixar'
];

export const BACKGROUND_SUGGESTIONS: string[] = [
    'Rừng sương mù',
    'Cảnh quan thành phố tương lai',
    'Lâu đài bị phù phép',
    'Bãi biển ngập nắng',
    'Tàn tích hậu tận thế',
    'Thư viện ấm cúng',
    'Cảnh quan hành tinh xa lạ',
    'Họa tiết hình học trừu tượng'
];

export const CAMERA_ANGLE_SUGGESTIONS: string[] = [
    'Cận cảnh',
    'Toàn thân',
    'Góc nhìn từ dưới lên',
    'Góc nhìn từ trên xuống',
    'Góc nghiêng',
    'Cảnh rộng',
    'Nhìn nghiêng',
    'Góc máy qua vai'
];

export const LIGHTING_SUGGESTIONS: string[] = [
    'Ánh sáng điện ảnh',
    'Ánh sáng dịu, khuếch tán',
    'Đèn ngược sáng ấn tượng',
    'Ánh nắng giờ vàng',
    'Ánh sáng neon',
    'Ánh sáng studio',
    'Ánh trăng kỳ bí',
    'Ánh sáng khối'
];