// Script to create initial admin user
// Run with: npx ts-node scripts/seed-admin.ts
// Or: npx tsx scripts/seed-admin.ts

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function seedAdmin() {
    const email = 'admin@siamsausage.com';
    const password = 'admin123'; // Change this in production!
    const name = 'Super Admin';
    const role = 'SUPER_ADMIN';

    try {
        // Check if admin already exists
        const existingAdmin = await prisma.admin.findUnique({
            where: { email }
        });

        if (existingAdmin) {
            console.log('Admin already exists:', email);
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create admin
        const admin = await prisma.admin.create({
            data: {
                email,
                password: hashedPassword,
                name,
                role,
                isActive: true
            }
        });

        console.log('✅ Admin created successfully!');
        console.log('Email:', admin.email);
        console.log('Password:', password);
        console.log('Role:', admin.role);
        console.log('\n⚠️  Please change the password after first login!');

    } catch (error) {
        console.error('Error creating admin:', error);
    } finally {
        await prisma.$disconnect();
    }
}

seedAdmin();
