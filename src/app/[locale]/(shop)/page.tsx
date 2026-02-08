import { getTranslations, setRequestLocale } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowRight, Utensils, Pill, Shirt, HeartHandshake, Zap, BookOpen } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Image from 'next/image';
import { cn, formatDate } from '@/lib/utils';

export default async function HomePage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();

    const [latestNews, latestAnnouncements, urgentAnnouncements] = await Promise.all([
        prisma.news.findMany({
            where: { isActive: true },
            take: 3,
            orderBy: { publishedAt: 'desc' }
        }),
        prisma.announcement.findMany({
            where: { isActive: true },
            take: 4,
            orderBy: { createdAt: 'desc' }
        }),
        prisma.announcement.findMany({
            where: { isActive: true, isUrgent: true },
            take: 3,
            orderBy: { createdAt: 'desc' }
        }),
    ]);

    const categories = [
        { id: 'FOOD', icon: Utensils, color: 'text-orange-600' },
        { id: 'MEDICINE', icon: Pill, color: 'text-red-600' },
        { id: 'CLOTHING', icon: Shirt, color: 'text-blue-600' },
        { id: 'FUNERAL', icon: HeartHandshake, color: 'text-purple-600' },
    ];

    return (
        <div className="flex min-h-screen flex-col bg-background transition-colors duration-500 font-outfit">
            <main className="flex-grow">
                {/* Minimalist Stark Hero Section */}
                <section className="relative min-h-[90vh] flex items-center pt-32 bg-background overflow-hidden">
                    <div className="container relative z-10">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-center">
                            <div className="lg:col-span-8 space-y-12 reveal">
                                <h1 className="text-5xl sm:text-6xl md:text-[120px] font-black tracking-tighter leading-[1.2] text-foreground">
                                    رؤية متجددة <br />
                                    تأثير <span className="opacity-40">دائم</span>
                                </h1>
                                <div className="max-w-2xl space-y-8">
                                    <p className="text-xl md:text-3xl font-bold leading-relaxed text-muted-foreground">
                                        منظمة خيرية رائدة تعمل على سد الفجوات الاجتماعية من خلال مبادرات إنسانية شفافة ومؤثرة في قلب الجزائر.
                                    </p>
                                    <div className="flex flex-wrap items-center gap-10 pt-4">
                                        <Link href="/announcements" className="text-sm font-black uppercase tracking-widest border-b-2 border-foreground pb-2 hover:opacity-50 transition-all">
                                            تصفح الحالات →
                                        </Link>
                                        <Link href="/contact" className="text-sm font-black uppercase tracking-widest border-b-2 border-foreground pb-2 hover:opacity-50 transition-all">
                                            انضم إلينا →
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Background Detail */}
                    <div className="absolute top-1/2 right-0 -translate-y-1/2 w-1/3 h-full bg-muted/30 -z-10" />
                </section>

                {/* Combined Activity Feed - News & Reports */}
                <section className="py-40 bg-background border-t border-border">
                    <div className="container">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                            {/* Left Side: Latest News (The Story) */}
                            <div className="lg:col-span-7 space-y-16">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <BookOpen size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">المجلة الإخبارية</span>
                                    </div>
                                    <h2 className="text-4xl md:text-6xl font-black tracking-tighter uppercase leading-none">تغطية <br /> ميدانية</h2>
                                </div>

                                <div className="space-y-12">
                                    {latestNews.map((news, idx) => (
                                        <Link key={news.id} href={`/news/${news.id}`} className="group grid grid-cols-1 sm:grid-cols-12 gap-10 items-center">
                                            <div className="sm:col-span-4 aspect-[4/3] relative overflow-hidden bg-muted">
                                                <Image
                                                    src={news.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070"}
                                                    alt="" fill className="object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                                                />
                                            </div>
                                            <div className="sm:col-span-8 space-y-3">
                                                <span className="text-[9px] font-black uppercase tracking-[0.3em] text-muted-foreground">{formatDate(news.publishedAt, locale)}</span>
                                                <h3 className="text-xl md:text-2xl font-black tracking-tighter leading-tight group-hover:text-muted-foreground transition-colors">
                                                    {news.title}
                                                </h3>
                                                <p className="text-sm font-bold text-muted-foreground/70 line-clamp-2 leading-relaxed">
                                                    {news.content.replace(/<[^>]*>/g, '').substring(0, 100)}...
                                                </p>
                                            </div>
                                        </Link>
                                    ))}
                                    <Link href="/news" className="inline-block text-[10px] font-black uppercase tracking-[0.4em] border-b border-foreground pb-1 hover:opacity-50 transition-all">
                                        شاهد جميع التقارير →
                                    </Link>
                                </div>
                            </div>

                            {/* Right Side: Quick Announcements (The Pulse) */}
                            <div className="lg:col-span-5 bg-muted/30 p-12 md:p-16 space-y-12 border border-border/50">
                                <div className="space-y-6">
                                    <div className="flex items-center gap-3 text-muted-foreground">
                                        <Zap size={16} />
                                        <span className="text-[10px] font-black uppercase tracking-[0.4em]">نبض التكافل</span>
                                    </div>
                                    <h2 className="text-3xl font-black tracking-tighter uppercase">آخر الحالات</h2>
                                </div>

                                <div className="space-y-8">
                                    {latestAnnouncements.map((ann) => (
                                        <Link key={ann.id} href={`/announcements/${ann.id}`} className="group block space-y-3 border-b border-border pb-8 last:border-0 last:pb-0">
                                            <div className="flex items-center justify-between gap-4">
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground">{formatDate(ann.createdAt, locale)}</span>
                                                {ann.isUrgent && <span className="h-1.5 w-1.5 rounded-full bg-accent animate-pulse" />}
                                            </div>
                                            <h4 className="text-lg font-black tracking-tighter leading-tight group-hover:translate-x-2 transition-transform rtl:group-hover:-translate-x-2">
                                                {ann.title}
                                            </h4>
                                        </Link>
                                    ))}
                                    <Link href="/announcements" className="block text-center bg-foreground text-background py-6 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-muted-foreground transition-all">
                                        تصفح جميع الحالات
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Transparency & Impact Section - More Realistic Concept */}
                <section className="py-40 bg-background border-y border-border">
                    <div className="container">
                        <div className="max-w-4xl mb-32 space-y-8 animate-reveal">
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter uppercase leading-none">
                                أثر ملموس.. <br /> <span className="opacity-30">بكل شفافية</span>
                            </h2>
                            <p className="text-xl font-bold text-muted-foreground max-w-2xl leading-relaxed">
                                نحن لا نؤمن بالأرقام فقط، بل نؤمن بالفعل الميداني والشفافية المطلقة في كل خطوة.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-border border border-border">
                            <div className="bg-background p-12 md:p-20 space-y-16 group hover:bg-muted transition-all duration-500">
                                <div className="space-y-6">
                                    <span className="text-7xl font-black tracking-tighter opacity-10 group-hover:opacity-100 transition-opacity">0%</span>
                                    <h3 className="text-3xl font-black uppercase tracking-tight">رسوم إدارية</h3>
                                    <p className="text-muted-foreground font-bold leading-relaxed text-lg">
                                        تصل تبرعاتك بالكامل (100%) للحالة المعنية. يتم تغطية تكاليفنا التشغيلية من خلال شركاء مستقلين ومنح منفصلة.
                                    </p>
                                </div>
                                <div className="h-1 w-12 bg-foreground/20 group-hover:w-full group-hover:bg-foreground transition-all duration-700" />
                            </div>

                            <div className="bg-background p-12 md:p-20 space-y-16 group hover:bg-muted transition-all duration-500">
                                <div className="space-y-6">
                                    <span className="text-7xl font-black tracking-tighter opacity-10 group-hover:opacity-100 transition-opacity">69</span>
                                    <h3 className="text-3xl font-black uppercase tracking-tight">توصيل ميداني</h3>
                                    <p className="text-muted-foreground font-bold leading-relaxed text-lg">
                                        حضورنا يتجاوز العاصمة ليشمل كل بلديات الجزائر الـ 69. فرقنا الميدانية هي من تسلم المساعدات يداً بيد لضمان وصولها.
                                    </p>
                                </div>
                                <div className="h-1 w-12 bg-foreground/20 group-hover:w-full group-hover:bg-foreground transition-all duration-700" />
                            </div>

                            <div className="bg-background p-12 md:p-20 space-y-16 group hover:bg-muted transition-all duration-500">
                                <div className="space-y-6">
                                    <span className="text-7xl font-black tracking-tighter opacity-10 group-hover:opacity-100 transition-opacity">100%</span>
                                    <h3 className="text-3xl font-black uppercase tracking-tight">تحقق موثق</h3>
                                    <p className="text-muted-foreground font-bold leading-relaxed text-lg">
                                        يتم التحقق من كل حالة بزيارات منزلية ودراسة اجتماعية دقيقة. نحن نضمن أن المساعدات تذهب لمن هم في أمس الحاجة إليها.
                                    </p>
                                </div>
                                <div className="h-1 w-12 bg-foreground/20 group-hover:w-full group-hover:bg-foreground transition-all duration-700" />
                            </div>
                        </div>
                    </div>
                </section>

                {/* Areas of Work - Large Cards */}
                <section className="py-40 border-t border-border">
                    <div className="container">
                        <div className="max-w-4xl mb-24 space-y-8">
                            <h2 className="text-4xl md:text-7xl font-black tracking-tighter">نعمل <br /> في كل المجالات</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-border">
                            {categories.map((cat, idx) => (
                                <Link
                                    key={idx}
                                    href={`/announcements?category=${cat.id}`}
                                    className="group bg-background p-16 space-y-8 hover:bg-muted transition-all duration-300"
                                >
                                    <div className={cn("transition-transform duration-500 group-hover:scale-110", cat.color)}>
                                        <cat.icon size={48} strokeWidth={1.5} />
                                    </div>
                                    <div className="space-y-2">
                                        <h4 className="text-2xl font-black uppercase">{t(`categories.${cat.id.toLowerCase()}`)}</h4>
                                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">عرض الحالات →</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
