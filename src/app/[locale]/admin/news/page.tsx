import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Newspaper, Plus, Search, Filter, Edit, Trash2, Eye, Calendar, User, ArrowUpRight, CheckCircle2, XCircle, MoreVertical, Terminal, Database } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { Link } from '@/i18n/routing';
import { cn } from '@/lib/utils';
import { deleteNews } from '@/lib/news-actions';

export default async function AdminNewsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('admin');

    const news = await prisma.news.findMany({
        orderBy: { publishedAt: 'desc' },
        include: {
            author: { select: { name: true } }
        }
    });

    return (
        <div className="space-y-16 pb-20">
            {/* Asset Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-border pb-10">
                <div className="space-y-4">
                    <div className="h-1.5 w-16 bg-foreground" />
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-foreground">
                        {t('news_assets')}.
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">
                        {t('archive')} {"//"} {news.length} {t('entries_detected')}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden xl:flex items-center gap-4 px-4 py-2 border border-border bg-foreground/[0.03] font-mono text-[10px]">
                        <Database size={12} className="opacity-40" />
                        <span className="opacity-40 italic">SQL_ENGINE:</span>
                        <span className="text-emerald-500 font-black">{t('sync_ok')}</span>
                    </div>
                    <Link href="/admin/news/new" className="h-16 px-10 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center hover:opacity-90 transition-all shadow-[0_0_30px_rgba(currentColor,0.05)]">
                        + {t('add_entry')}
                    </Link>
                </div>
            </div>

            {/* View Manipulation Row */}
            <div className="flex flex-col lg:flex-row gap-8">
                <div className="flex-1 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-20 group-focus-within:opacity-100 transition-opacity" />
                    <input
                        type="text"
                        placeholder={t('locate_content')}
                        className="w-full bg-foreground/[0.02] border border-border py-6 pl-16 pr-8 text-[11px] font-black tracking-[0.3em] text-foreground focus:border-foreground/20 transition-all outline-none uppercase placeholder:opacity-20 translate-y-0 focus:-translate-y-1"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="h-16 w-16 border border-border flex items-center justify-center hover:bg-foreground/[0.03] transition-all">
                        <Filter size={18} className="opacity-40" />
                    </button>
                    <button className="h-16 px-10 border border-border text-[10px] font-black uppercase tracking-[0.4em] opacity-40 hover:opacity-100 transition-all">
                        {t('sort_by_date')}
                    </button>
                </div>
            </div>

            {/* Content Asset Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-3 gap-8">
                {news.map((item, idx) => (
                    <div key={item.id} className="group relative bg-card border border-border overflow-hidden transition-all duration-500 hover:border-foreground/20 hover:-translate-y-2">
                        {/* Status Bit */}
                        <div className={cn(
                            "absolute top-0 right-0 h-1 w-24 z-20 transition-all duration-500",
                            item.isActive ? "bg-emerald-500" : "bg-rose-500"
                        )} />

                        {/* Visual Segment */}
                        <div className="aspect-[16/9] bg-muted relative overflow-hidden">
                            {item.image ? (
                                <img src={item.image} alt="" className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-1000" />
                            ) : (
                                <div className="h-full w-full flex items-center justify-center opacity-10">
                                    <Newspaper size={40} />
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent opacity-60" />
                            <div className="absolute bottom-6 left-6 flex items-center gap-3">
                                <div className="h-8 w-8 bg-foreground text-background flex items-center justify-center font-black text-xs">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </div>
                                <span className="text-[10px] font-black tracking-widest text-foreground uppercase">{formatDate(item.createdAt, locale)}</span>
                            </div>
                        </div>

                        {/* Information Segment */}
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-4 text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40 pb-4 border-b border-border">
                                <span>ID: {item.id.substring(0, 8)}</span>
                                <div className="h-1 w-1 bg-border rounded-full" />
                                <span>{t('type_inf_rep')}</span>
                            </div>

                            <h3 className="text-xl font-black uppercase tracking-tighter text-foreground leading-tight min-h-[3rem] line-clamp-2">
                                {item.title}
                            </h3>

                            <p className="text-[11px] font-bold text-muted-foreground/60 leading-relaxed uppercase tracking-tighter line-clamp-3">
                                {item.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
                            </p>

                            <div className="pt-6 flex items-center justify-between border-t border-border">
                                <div className="flex items-center gap-2">
                                    {item.isActive ? (
                                        <CheckCircle2 size={12} className="text-emerald-500" />
                                    ) : (
                                        <XCircle size={12} className="text-rose-500" />
                                    )}
                                    <span className="text-[9px] font-black uppercase tracking-[0.2em]">{item.isActive ? t('operational') : t('offline')}</span>
                                </div>

                                <div className="flex items-center gap-3">
                                    <Link
                                        href={`/admin/news/${item.id}`}
                                        className="h-10 w-10 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all"
                                        title={t('edit_entity')}
                                    >
                                        <Edit size={14} />
                                    </Link>
                                    <form action={async () => {
                                        'use server';
                                        await deleteNews(item.id);
                                    }}>
                                        <button
                                            type="submit"
                                            className="h-10 w-10 border border-border flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all hover:border-rose-600"
                                            title={t('purge_entity')}
                                        >
                                            <Trash2 size={14} />
                                        </button>
                                    </form>
                                </div>
                            </div>
                        </div>

                        {/* Detail Deco */}
                        <div className="absolute top-4 left-4 pointer-events-none opacity-20 text-[6px] font-mono font-black text-foreground tracking-widest hidden group-hover:block">
                            X:0.22 Y:0.89 Z:1.02
                        </div>
                    </div>
                ))}

                {/* New Entry Placeholder */}
                <Link href="/admin/news/new" className="group border-2 border-dashed border-border hover:border-foreground/20 transition-all flex flex-col items-center justify-center min-h-[400px] space-y-6">
                    <div className="h-16 w-16 border border-border flex items-center justify-center group-hover:scale-110 group-hover:bg-foreground group-hover:text-background transition-all">
                        <Plus size={30} strokeWidth={1} />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-[0.5em] opacity-20 group-hover:opacity-100 transition-opacity">{t('node_pending')}</span>
                </Link>
            </div>
        </div>
    );
}
