import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Link } from '@/i18n/routing';
import { ArrowRight, Calendar, User, Newspaper, Clock, Hash, Sparkles, ArrowUpRight } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import Image from 'next/image';

export default async function NewsPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();

    // Fetch news
    const news = await prisma.news.findMany({
        where: { isActive: true },
        orderBy: { publishedAt: 'desc' },
        include: {
            author: { select: { name: true } }
        }
    });

    // Strategy for layout based on count
    const featuredNews = news[0]; // First item (Big Left)
    const sidebarNews = news.slice(1, 4); // Next 3 items (Right Sidebar)
    const gridNews = news.slice(4); // Rest of items (Bottom Grid)

    // Fallback if we don't have enough news for the specific layout
    // If < 5 items, we might adjust, but for now we follow the design strictly if data exists.

    return (
        <div className="flex min-h-screen flex-col bg-background transition-all duration-300">
            <main className="flex-grow pt-32 pb-20">
                {/* 1. Header Section */}
                <section className="container mb-24 space-y-8">
                    <div className="h-1 w-20 bg-foreground" />
                    <h1 className="text-6xl md:text-9xl font-black tracking-tighter leading-[1.2] text-foreground uppercase">
                        المدونة <br /> <span className="opacity-40">& الأخبار</span>
                    </h1>
                </section>

                <div className="container">
                    {featuredNews && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 mb-40">
                            {/* Main Featured Card */}
                            <div className="lg:col-span-8">
                                <Link
                                    href={`/news/${featuredNews.id}`}
                                    className="group block space-y-10"
                                >
                                    <div className="relative aspect-[16/9] overflow-hidden bg-muted">
                                        <Image
                                            src={featuredNews.image || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&w=2070&auto=format&fit=crop"}
                                            alt={featuredNews.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                            FEATURING • {formatDate(featuredNews.publishedAt, locale)}
                                        </div>
                                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-none group-hover:opacity-60 transition-opacity">
                                            {featuredNews.title}
                                        </h2>
                                        <p className="text-muted-foreground text-xl font-medium leading-relaxed max-w-3xl">
                                            {featuredNews.content.replace(/<[^>]*>/g, '').substring(0, 250)}...
                                        </p>
                                    </div>
                                </Link>
                            </div>

                            {/* Sidebar Items */}
                            <div className="lg:col-span-4 space-y-12">
                                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">الأكثر قراءة</h4>
                                {sidebarNews.map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.id}`}
                                        className="group block space-y-4 border-b border-border pb-8 last:border-0"
                                    >
                                        <div className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">
                                            {formatDate(item.publishedAt, locale)}
                                        </div>
                                        <h3 className="text-xl font-black leading-tight group-hover:opacity-60 transition-opacity uppercase">
                                            {item.title}
                                        </h3>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Grid Section */}
                    {gridNews.length > 0 && (
                        <div className="space-y-24">
                            <h2 className="text-sm font-black uppercase tracking-[0.4em] py-8 border-y border-border">المزيد من المقالات</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
                                {gridNews.map((item, idx) => (
                                    <Link
                                        key={item.id}
                                        href={`/news/${item.id}`}
                                        className="group space-y-8 reveal"
                                        style={{ animationDelay: `${idx * 100}ms` }}
                                    >
                                        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                                            <Image
                                                src={item.image || "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?q=80&w=2070&auto=format&fit=crop"}
                                                alt={item.title}
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <div className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground font-bold">
                                                {formatDate(item.publishedAt, locale)}
                                            </div>
                                            <h3 className="text-2xl font-black leading-tight group-hover:opacity-60 transition-opacity uppercase">
                                                {item.title}
                                            </h3>
                                            <p className="text-muted-foreground text-sm font-medium leading-relaxed line-clamp-2">
                                                {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                                            </p>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}

                    {news.length === 0 && (
                        <div className="py-40 text-center space-y-8 border border-border">
                            <Newspaper className="h-16 w-16 mx-auto opacity-20" />
                            <h3 className="text-xl font-black uppercase tracking-widest text-muted-foreground">لا توجد أخبار حالياً</h3>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
