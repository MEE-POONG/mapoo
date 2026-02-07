import jwt from 'jsonwebtoken';

const ADMIN_JWT_SECRET = process.env.ADMIN_JWT_SECRET || process.env.JWT_SECRET || 'admin-super-secret-key-change-in-production';

export interface AdminJWTPayload {
    adminId: string;
    email: string;
    name: string;
    role: string;
}

export function signAdminToken(payload: AdminJWTPayload): string {
    return jwt.sign(payload, ADMIN_JWT_SECRET, { expiresIn: '24h' });
}

export function verifyAdminToken(token: string): AdminJWTPayload | null {
    try {
        return jwt.verify(token, ADMIN_JWT_SECRET) as AdminJWTPayload;
    } catch {
        return null;
    }
}

export function getAdminTokenFromHeaders(authHeader: string | null): string | null {
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return null;
    }
    return authHeader.substring(7);
}
