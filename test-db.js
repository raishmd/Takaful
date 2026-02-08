const { PrismaClient } = require('@prisma/client');

async function testConnection() {
    const prisma = new PrismaClient();
    try {
        console.log('Attempting to connect to database...');
        await prisma.$connect();
        console.log('Successfully connected to database!');
        const newsCount = await prisma.news.count();
        console.log(`Current news count: ${newsCount}`);
    } catch (error) {
        console.error('Database connection failed:', error);
    } finally {
        await prisma.$disconnect();
    }
}

testConnection();
