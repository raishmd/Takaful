import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar, MapPin, Phone, Share2, AlertCircle, ArrowLeft, Clock } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatDate, cn } from '@/lib/utils';
import { AnnouncementCategory } from '@prisma/client';

export default async function AnnouncementDetailsPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();

    const announcement = await prisma.announcement.findUnique({
        where: { id },
        include: {
            author: {
                select: {
                    name: true,
                },
            },
        },
    });

    if (!announcement || !announcement.isActive) {
        notFound();
    }

    // Fetch related announcements (same category)
    const relatedAnnouncements = await prisma.announcement.findMany({
        where: {
            category: announcement.category,
            isActive: true,
            id: { not: announcement.id },
        },
        take: 3,
        orderBy: { publishedAt: 'desc' },
    });

    const shareUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/${locale}/announcements/${announcement.id}`;
    const title = announcement.title;

    return (
        <div className="flex min-h-screen flex-col bg-background transition-all duration-300 font-outfit">
            <Header />
            <main className="flex-grow pt-32">
                <div className="container">
                    {/* Minimalist Breadcrumb */}
                    <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground/60 mb-20 reveal">
                        <Link href={`/`} className="hover:text-foreground transition-colors">{t('common.home')}</Link>
                        <span>/</span>
                        <Link href={`/announcements`} className="hover:text-foreground transition-colors">{t('announcements.title')}</Link>
                        <span>/</span>
                        <span className="text-foreground truncate max-w-[200px]">{title}</span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-24 items-start pb-40">
                        {/* Main Content */}
                        <div className="lg:col-span-8 space-y-20">
                            <div className="space-y-12 reveal">
                                <div className="space-y-8">
                                    <div className="flex items-center gap-6">
                                        <div className="h-1 w-12 bg-foreground" />
                                        <div className={cn(
                                            "text-[10px] font-black uppercase tracking-[0.4em]",
                                            announcement.isUrgent ? "text-accent" : "text-muted-foreground"
                                        )}>
                                            {t(`categories.${announcement.category.toLowerCase()}`)} {announcement.isUrgent && "• URGENT"}
                                        </div>
                                    </div>

                                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter leading-[1.2] text-foreground uppercase">
                                        {title}
                                    </h1>

                                    <div className="flex flex-wrap items-center gap-10 pt-4">
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                            <Calendar className="h-3 w-3" />
                                            <span>{formatDate(announcement.publishedAt, locale)}</span>
                                        </div>
                                        {announcement.location && (
                                            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                                <MapPin className="h-3 w-3" />
                                                <span>{announcement.location}</span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div className="prose prose-xl dark:prose-invert max-w-none text-foreground leading-relaxed font-bold italic border-l-4 border-foreground pl-8 py-4"
                                    dangerouslySetInnerHTML={{ __html: announcement.description }} />

                                {announcement.contactInfo && (
                                    <div className="pt-20 border-t border-border">
                                        <div className="space-y-8">
                                            <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">معلومات التواصل</h3>
                                            <div className="space-y-10">
                                                <p className="text-4xl md:text-6xl font-black tracking-tighter text-foreground">{announcement.contactInfo}</p>
                                                <a href={`tel:${announcement.contactInfo}`} className="inline-flex items-center justify-center gap-4 px-12 py-6 bg-foreground text-background font-black uppercase tracking-[0.3em] hover:opacity-90 transition-all">
                                                    <span>{t('common.contact')}</span>
                                                    <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                                                </a>
                                            </div>
                                        </div>
                                    </div>
                                )}

                                {/* Simple Share */}
                                <div className="pt-20 border-t border-border">
                                    <div className="flex flex-col gap-8">
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">{t('announcements.shareOn')}</span>
                                        <div className="flex items-center gap-10">
                                            <a
                                                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:opacity-50 transition-all"
                                            >
                                                Facebook
                                            </a>
                                            <a
                                                href={`https://wa.me/?text=${encodeURIComponent(`${title} - ${shareUrl}`)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:opacity-50 transition-all"
                                            >
                                                WhatsApp
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Sidebar */}
                        <div className="lg:col-span-4 space-y-16 reveal" style={{ animationDelay: '0.2s' }}>
                            <div className="space-y-12">
                                <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-6 italic">
                                    {t('home.urgentCases')}
                                </h3>
                                <div className="space-y-12">
                                    {relatedAnnouncements.length > 0 ? (
                                        relatedAnnouncements.map((item) => (
                                            <Link
                                                key={item.id}
                                                href={`/announcements/${item.id}`}
                                                className="group block space-y-4"
                                            >
                                                <div className="space-y-3">
                                                    <div className={cn(
                                                        "text-[9px] font-black uppercase tracking-[0.2em]",
                                                        item.isUrgent ? "text-accent" : "text-muted-foreground"
                                                    )}>
                                                        {item.isUrgent && "URGENT • "}{formatDate(item.publishedAt, locale)}
                                                    </div>
                                                    <h4 className="text-xl font-black uppercase tracking-tight text-foreground group-hover:opacity-50 transition-opacity leading-tight">
                                                        {item.title}
                                                    </h4>
                                                </div>
                                            </Link>
                                        ))
                                    ) : (
                                        <p className="text-[10px] font-black uppercase tracking-widest text-muted-foreground/30">{t('common.noResults')}</p>
                                    )}
                                </div>
                                <Link
                                    href={`/announcements`}
                                    className="inline-block text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-foreground pb-2 hover:opacity-50 transition-all"
                                >
                                    {t('announcements.all')} →
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </div>
    );
}
