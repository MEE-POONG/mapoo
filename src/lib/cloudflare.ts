/**
 * Cloudflare Images Upload Utility
 * 
 * อัปโหลดรูปภาพไปยัง Cloudflare Images และรับ URL สำหรับแสดงผล
 */

const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN;

// Base URL สำหรับ Cloudflare Images API
const CLOUDFLARE_API_URL = `https://api.cloudflare.com/client/v4/accounts/${CLOUDFLARE_ACCOUNT_ID}/images/v1`;

export interface CloudflareUploadResult {
    success: boolean;
    url?: string;
    imageId?: string;
    error?: string;
}

/**
 * อัปโหลดรูปภาพไปยัง Cloudflare Images
 * @param file - File object จาก FormData
 * @returns CloudflareUploadResult พร้อม URL สำหรับแสดงผล
 */
export async function uploadToCloudflare(file: File): Promise<CloudflareUploadResult> {
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
        console.error('Cloudflare credentials not configured');
        return {
            success: false,
            error: 'Cloudflare credentials not configured. Please set CLOUDFLARE_ACCOUNT_ID and CLOUDFLARE_API_TOKEN in .env',
        };
    }

    try {
        // สร้าง FormData สำหรับ Cloudflare API
        const cfFormData = new FormData();
        cfFormData.append('file', file);

        // เรียก Cloudflare Images API
        const response = await fetch(CLOUDFLARE_API_URL, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            },
            body: cfFormData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
            console.error('Cloudflare upload failed:', result);
            return {
                success: false,
                error: result.errors?.[0]?.message || 'Failed to upload to Cloudflare',
            };
        }

        // Cloudflare Images จะคืน variants array ที่มี URL สำหรับแสดงผล
        const imageId = result.result.id;
        const variants: string[] = result.result.variants || [];

        // ใช้ variant แรก หรือสร้าง URL จาก image ID
        const imageUrl = variants[0] || `https://imagedelivery.net/${CLOUDFLARE_ACCOUNT_ID}/${imageId}/public`;

        return {
            success: true,
            url: imageUrl,
            imageId: imageId,
        };
    } catch (error) {
        console.error('Cloudflare upload error:', error);
        return {
            success: false,
            error: 'เกิดข้อผิดพลาดในการอัปโหลดไปยัง Cloudflare',
        };
    }
}

/**
 * ลบรูปภาพจาก Cloudflare Images
 * @param imageId - ID ของรูปภาพที่ต้องการลบ
 */
export async function deleteFromCloudflare(imageId: string): Promise<boolean> {
    if (!CLOUDFLARE_ACCOUNT_ID || !CLOUDFLARE_API_TOKEN) {
        console.error('Cloudflare credentials not configured');
        return false;
    }

    try {
        const response = await fetch(`${CLOUDFLARE_API_URL}/${imageId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${CLOUDFLARE_API_TOKEN}`,
            },
        });

        const result = await response.json();
        return result.success === true;
    } catch (error) {
        console.error('Cloudflare delete error:', error);
        return false;
    }
}
