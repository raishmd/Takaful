import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting database seed...');

    // Create admin user
    const hashedPassword = await bcrypt.hash('admin123', 10);

    const admin = await prisma.user.upsert({
        where: { email: 'admin@takaful.org' },
        update: {},
        create: {
            email: 'admin@takaful.org',
            password: hashedPassword,
            name: 'Administrator',
            role: 'admin',
        },
    });

    console.log('✅ Admin user created:', admin.email);

    // Create sample news
    const news1 = await prisma.news.create({
        data: {
            title: 'افتتاح مركز جديد للتضامن',
            content: 'نحن سعداء بالإعلان عن افتتاح مركز جديد للتضامن في ولاية الجزائر. سيوفر المركز خدمات متنوعة للعائلات المحتاجة بما في ذلك توزيع الطعام والملابس والأدوية.',
            isActive: true,
            isUrgent: false,
            authorId: admin.id,
        },
    });

    const news2 = await prisma.news.create({
        data: {
            title: 'حملة رمضان الخيرية 2026',
            content: 'انطلقت حملة رمضان الخيرية لهذا العام بنجاح كبير. تم توزيع أكثر من 1000 سلة غذائية على العائلات المحتاجة في مختلف الولايات.',
            isActive: true,
            isUrgent: true,
            authorId: admin.id,
        },
    });

    console.log('✅ Sample news created');

    // Create sample announcements
    const announcement1 = await prisma.announcement.create({
        data: {
            title: 'توزيع وجبات ساخنة - الجزائر العاصمة',
            description: 'سيتم توزيع وجبات ساخنة يوم الجمعة القادم في حي باب الوادي. جميع العائلات المحتاجة مدعوة للحضور.',
            category: 'FOOD',
            location: 'باب الوادي، الجزائر العاصمة',
            contactInfo: '+213 XXX XXX XXX',
            isActive: true,
            isUrgent: true,
            authorId: admin.id,
        },
    });

    const announcement2 = await prisma.announcement.create({
        data: {
            title: 'تبرع بالأدوية - وهران',
            description: 'نحن بحاجة إلى تبرعات من الأدوية للمرضى المحتاجين. يمكنكم التبرع بالأدوية غير المستخدمة في مركزنا.',
            category: 'MEDICINE',
            location: 'وهران',
            contactInfo: 'contact@takaful.org',
            isActive: true,
            isUrgent: false,
            authorId: admin.id,
        },
    });

    const announcement3 = await prisma.announcement.create({
        data: {
            title: 'توزيع ملابس شتوية - قسنطينة',
            description: 'حملة توزيع ملابس شتوية للأطفال والكبار. التوزيع سيكون يوم السبت من الساعة 9 صباحاً حتى 5 مساءً.',
            category: 'CLOTHING',
            location: 'قسنطينة',
            contactInfo: '+213 XXX XXX XXX',
            isActive: true,
            isUrgent: false,
            authorId: admin.id,
        },
    });

    const announcement4 = await prisma.announcement.create({
        data: {
            title: 'مساعدة عائلة في حالة وفاة - عنابة',
            description: 'عائلة محتاجة تحتاج إلى مساعدة عاجلة لتغطية تكاليف الجنازة. كل مساهمة مهما كانت صغيرة ستكون موضع تقدير كبير.',
            category: 'FUNERAL',
            location: 'عنابة',
            contactInfo: 'urgent@takaful.org',
            isActive: true,
            isUrgent: true,
            authorId: admin.id,
        },
    });

    console.log('✅ Sample announcements created');

    // Create settings
    await prisma.settings.upsert({
        where: { key: 'site_name_ar' },
        update: { value: 'التكافل' },
        create: { key: 'site_name_ar', value: 'التكافل' },
    });

    await prisma.settings.upsert({
        where: { key: 'site_name_fr' },
        update: { value: 'Takaful' },
        create: { key: 'site_name_fr', value: 'Takaful' },
    });

    console.log('✅ Settings created');

    console.log('🎉 Database seed completed successfully!');
    console.log('\n📧 Admin credentials:');
    console.log('   Email: admin@takaful.org');
    console.log('   Password: admin123');
    console.log('\n⚠️  Please change the admin password after first login!\n');
}

main()
    .catch((e) => {
        console.error('❌ Error seeding database:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
