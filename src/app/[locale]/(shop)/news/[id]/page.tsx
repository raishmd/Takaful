import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Link } from '@/i18n/routing';
import { Calendar, User, Share2, Sparkles, ArrowLeft, Clock, Bookmark, ArrowRight, MessageSquare, Newspaper, Tag, HandHeart, Twitter, Facebook, Instagram } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { formatDate, cn } from '@/lib/utils';
import Image from 'next/image';

export default async function NewsDetailsPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);
    const t = await getTranslations();

    const [news, relatedNews] = await Promise.all([
        prisma.news.findUnique({
            where: { id },
            include: {
                author: {
                    select: { name: true },
                },
            },
        }),
        prisma.news.findMany({
            where: { id: { not: id }, isActive: true },
            take: 3,
            orderBy: { publishedAt: 'desc' }
        })
    ]);

    if (!news || !news.isActive) {
        notFound();
    }

    const title = news.title;
    const content = news.content;

    return (
        <div className="flex min-h-screen flex-col bg-background transition-all duration-300 font-outfit">
            <Header />

            <main className="flex-grow pt-32">
                <article className="container py-20 pb-40">
                    <div className="max-w-6xl mx-auto space-y-24">

                        {/* Article Header */}
                        <div className="space-y-12">
                            <div className="h-1 w-20 bg-foreground" />
                            <h1 className="text-5xl md:text-[100px] font-black tracking-tighter leading-[1.2] text-foreground uppercase">
                                {title}
                            </h1>

                            <div className="flex flex-wrap items-center gap-10 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground reveal">
                                <div>{formatDate(news.publishedAt, locale)}</div>
                                <div className="h-1 w-1 bg-border rounded-full" />
                                <div>BY {news.author?.name || 'ADMIN'}</div>
                            </div>
                        </div>

                        {/* Article Banner - Sharp Corners */}
                        {news.image && (
                            <div className="relative aspect-video bg-muted border border-border reveal">
                                <Image src={news.image} alt={title} fill className="object-cover" priority />
                            </div>
                        )}

                        {/* Article Body */}
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-24">
                            <div className="lg:col-span-8 space-y-20">
                                <div className="prose prose-2xl dark:prose-invert max-w-none text-foreground leading-relaxed font-bold italic border-l-4 border-foreground pl-8 py-4 reveal"
                                    dangerouslySetInnerHTML={{ __html: content }} />

                                <div className="pt-20 border-t border-border flex flex-col gap-8 reveal">
                                    <span className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">شارك القصة</span>
                                    <div className="flex items-center gap-10">
                                        <a href={`#`} className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:opacity-50 transition-all">Twitter</a>
                                        <a href={`#`} className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:opacity-50 transition-all">Facebook</a>
                                        <a href={`#`} className="text-[10px] font-black uppercase tracking-[0.2em] border-b border-foreground pb-1 hover:opacity-50 transition-all">LinkedIn</a>
                                    </div>
                                </div>
                            </div>

                            {/* Sidebar - Minimalist */}
                            <aside className="lg:col-span-4 space-y-24 reveal" style={{ animationDelay: '200ms' }}>
                                <section className="space-y-12">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-6 italic">
                                        أخبار مشابهة
                                    </h3>
                                    <div className="space-y-12">
                                        {relatedNews.map((item) => (
                                            <Link key={item.id} href={`/news/${item.id}`} className="group block space-y-6">
                                                {item.image && (
                                                    <div className="relative aspect-video bg-muted border border-border group-hover:opacity-70 transition-opacity">
                                                        <Image src={item.image} alt="" fill className="object-cover" />
                                                    </div>
                                                )}
                                                <h4 className="text-xl font-black uppercase tracking-tight text-foreground group-hover:opacity-50 transition-opacity leading-tight">
                                                    {item.title}
                                                </h4>
                                            </Link>
                                        ))}
                                    </div>
                                </section>

                                <section className="p-12 bg-foreground text-background space-y-8">
                                    <h3 className="text-4xl font-black tracking-tighter uppercase leading-tight">ساهم معنا</h3>
                                    <p className="text-sm font-bold opacity-70 leading-relaxed uppercase tracking-widest">دعمك يمكننا من صناعة التغيير ومساعدة المحتاجين في كل مكان.</p>
                                    <Link href="/contact" className="inline-flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.3em] border-b-2 border-background pb-2 hover:opacity-50 transition-all">
                                        انضم للمهمة →
                                    </Link>
                                </section>
                            </aside>
                        </div>
                    </div>
                </article>
            </main>

            <Footer />
        </div>
    );
}
