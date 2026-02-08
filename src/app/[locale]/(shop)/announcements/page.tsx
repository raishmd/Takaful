import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { ArrowRight, MapPin, Megaphone, Zap, Clock, Target } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AnnouncementCategory } from '@prisma/client';
import { formatDate, cn } from '@/lib/utils';

export default async function AnnouncementsPage({
    params,
    searchParams,
}: {
    params: Promise<{ locale: string }>;
    searchParams: Promise<{ category?: string; urgent?: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();
    const searchParamsValue = await searchParams;
    const category = searchParamsValue.category;
    const isUrgent = searchParamsValue.urgent === 'true';

    const where = {
        isActive: true,
        ...(category && { category: category as AnnouncementCategory }),
        ...(isUrgent && { isUrgent: true }),
    };

    const announcements = await prisma.announcement.findMany({
        where,
        orderBy: { publishedAt: 'desc' },
    });

    const categories = [
        { id: 'FOOD', icon: '🍲', color: 'bg-orange-500/10 text-orange-600' },
        { id: 'MEDICINE', icon: '💊', color: 'bg-red-500/10 text-red-600' },
        { id: 'CLOTHING', icon: '👕', color: 'bg-blue-500/10 text-blue-600' },
        { id: 'FUNERAL', icon: '🕊️', color: 'bg-purple-500/10 text-purple-600' },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background transition-all duration-300 font-outfit">
            <Header />
            <main className="flex-grow pt-32">
                {/* Minimalist Header */}
                <section className="relative py-24 bg-background border-b border-border transition-colors duration-700 overflow-hidden">
                    <div className="container relative z-10">
                        <div className="max-w-4xl space-y-8 animate-reveal">
                            <div className="h-1 w-20 bg-foreground" />
                            <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-[1.2] text-foreground uppercase">
                                {t('announcements.title')} <br />
                                <span className="opacity-40">منصة التكافل</span>
                            </h1>
                            <p className="text-muted-foreground font-bold text-lg lg:text-2xl uppercase tracking-widest leading-relaxed max-w-2xl italic transition-colors">
                                استجابة جماعية للحالات الإنسانية العاجلة وبناء جسور العطاء.
                            </p>
                        </div>
                    </div>
                </section>

                <div className="container py-20 pb-40">
                    {/* Minimal Filter Interface */}
                    <div className="flex flex-wrap items-center gap-10 border-b border-border pb-10">
                        <Link
                            href="/announcements"
                            className={cn(
                                "text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                !category && !isUrgent ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"
                            )}
                        >
                            {t('announcements.all')}
                        </Link>
                        <Link
                            href="/announcements?urgent=true"
                            className={cn(
                                "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                isUrgent ? "text-accent border-b-2 border-accent" : "text-muted-foreground hover:text-accent"
                            )}
                        >
                            {t('common.urgent')}
                        </Link>

                        {categories.map((cat) => (
                            <Link
                                key={cat.id}
                                href={`/announcements?category=${cat.id}`}
                                className={cn(
                                    "flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] transition-all",
                                    category === cat.id ? "text-foreground border-b-2 border-foreground" : "text-muted-foreground hover:text-foreground"
                                )}
                            >
                                <span>{t(`categories.${cat.id.toLowerCase()}`)}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Announcement Grid */}
                    <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                        {announcements.map((ann, idx) => (
                            <Link
                                key={ann.id}
                                href={`/announcements/${ann.id}`}
                                className="group block space-y-8 border-b border-border pb-16 last:border-0 hover:opacity-70 transition-opacity"
                                style={{ animationDelay: `${idx * 100}ms` }}
                            >
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between">
                                        <div className={cn(
                                            "text-[10px] font-black uppercase tracking-[0.3em]",
                                            ann.isUrgent ? "text-accent" : "text-muted-foreground"
                                        )}>
                                            {t(`categories.${ann.category.toLowerCase()}`)} {ann.isUrgent && "• URGENT"}
                                        </div>
                                        <div className="text-[10px] font-black text-muted-foreground opacity-20">#{ann.id.slice(-4).toUpperCase()}</div>
                                    </div>

                                    <h3 className="text-3xl font-black tracking-tighter leading-tight text-foreground uppercase">
                                        {ann.title}
                                    </h3>

                                    <p className="text-muted-foreground font-medium text-sm leading-relaxed line-clamp-3 italic">
                                        {ann.description}
                                    </p>

                                    <div className="flex flex-col gap-2 pt-4">
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            <MapPin className="h-3 w-3" />
                                            {ann.location || 'الجزائر العاصمة'}
                                        </div>
                                        <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            <Clock className="h-3 w-3" />
                                            {formatDate(ann.publishedAt, locale)}
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {announcements.length === 0 && (
                        <div className="mt-20 py-40 text-center flex flex-col items-center">
                            <Target className="h-12 w-12 text-muted-foreground/20 mb-8" />
                            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">{t('common.noResults')}</h3>
                        </div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
