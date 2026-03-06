/**
 * Helper function dùng chung cho toàn dự án
 * Ví dụ: Sinh ra một chuỗi random để đăng ký email
 */
export function generateRandomString(length: number): string {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

/**
 * Format Date thành YYYY-MM-DD
 */
export function formatDateToISO(date: Date): string {
    return date.toISOString().split('T')[0];
}
