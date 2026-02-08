import UrgentTicker from '@/components/UrgentTicker';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { prisma } from '@/lib/prisma';
import { getSettings } from '@/lib/settings-actions';

export default async function ShopLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const urgentAnnouncements = await prisma.announcement.findMany({
        where: { isActive: true, isUrgent: true },
        orderBy: { createdAt: 'desc' },
        take: 5,
    });

    const settings = await getSettings();

    return (
        <>
            <UrgentTicker announcements={urgentAnnouncements} />
            <Header orgName={settings.orgName} />
            <div className="relative pt-28 md:pt-32">
                {children}
            </div>
            <Footer />
        </>
    );
}
