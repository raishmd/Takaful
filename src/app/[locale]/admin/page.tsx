import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Megaphone, Newspaper, MessageSquare, ArrowRight, Activity, Settings, ArrowUpRight, ShieldCheck, Zap } from 'lucide-react';
import { formatDate, cn } from '@/lib/utils';
import { Link } from '@/i18n/routing';

export default async function AdminDashboardPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('admin');

    const [stats, recentNews, recentMessages] = await Promise.all([
        Promise.resolve({
            news: await prisma.news.count(),
            announcements: await prisma.announcement.count(),
            messages: await prisma.contactSubmission.count(),
            unread: await prisma.contactSubmission.count({ where: { isRead: false } }),
        }),
        prisma.news.findMany({
            take: 4,
            orderBy: { createdAt: 'desc' },
        }),
        prisma.contactSubmission.findMany({
            take: 5,
            orderBy: { createdAt: 'desc' },
        }),
    ]);

    const statUnits = [
        { label: t('content_index'), value: stats.news, icon: Newspaper, detail: t('total_reports') },
        { label: t('case_registry'), value: stats.announcements, icon: Megaphone, detail: t('total_cases') },
        { label: t('comms_inbound'), value: stats.messages, icon: MessageSquare, detail: t('total_trans') },
        { label: t('pending_reaction'), value: stats.unread, icon: Zap, detail: t('unread_threads'), highlight: true },
    ];

    return (
        <div className="space-y-24 pb-20">
            {/* Header Module */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-12 border-b border-border pb-16">
                <div className="space-y-6">
                    <div className="h-1.5 w-24 bg-foreground" />
                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter uppercase leading-[0.8] text-foreground">
                        {t('overview')}.
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground opacity-40">
                        CENTRAL_COMMAND_MODULE {"//"} READY_STATE
                    </p>
                </div>
                <div className="flex flex-wrap gap-6">
                    <Link href="/admin/news/new" className="h-16 px-10 bg-foreground text-background text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center hover:opacity-90 transition-all hover:scale-[1.02] active:scale-95 shadow-[0_0_30px_rgba(var(--foreground),0.1)]">
                        + {t('new_content')}
                    </Link>
                    <Link href="/admin/announcements/new" className="h-16 px-10 border border-border text-foreground text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                        + {t('new_case')}
                    </Link>
                </div>
            </div>

            {/* Matrix Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-px bg-border border border-border">
                {statUnits.map((stat, idx) => (
                    <div key={idx} className="bg-card p-12 space-y-12 group hover:bg-foreground transition-all duration-500 overflow-hidden relative">
                        {/* Unit Background Text */}
                        <div className="absolute -right-4 -bottom-4 text-9xl font-black opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none select-none text-foreground group-hover:text-background">
                            {idx + 1}
                        </div>

                        <div className="flex items-center justify-between relative z-10">
                            <stat.icon size={20} className={cn(
                                "transition-all duration-500",
                                stat.highlight ? "text-accent animate-pulse" : "opacity-30 group-hover:opacity-100 group-hover:text-background"
                            )} />
                            <span className="text-[8px] font-black uppercase tracking-[0.4em] text-muted-foreground group-hover:text-background/40">STAT_{idx + 1}</span>
                        </div>

                        <div className="space-y-4 relative z-10">
                            <h3 className="text-7xl font-black tracking-tighter group-hover:text-background group-hover:translate-x-2 transition-all duration-500 leading-none text-foreground">
                                {stat.value.toString().padStart(2, '0')}
                            </h3>
                            <div className="space-y-1">
                                <p className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-background">{stat.label}</p>
                                <p className="text-[8px] font-bold uppercase tracking-[0.3em] opacity-30 group-hover:text-background/40">{stat.detail}</p>
                            </div>
                        </div>

                        {/* Animated Border Reveal */}
                        <div className="absolute bottom-0 left-0 h-1 bg-foreground group-hover:bg-background w-0 group-hover:w-full transition-all duration-700" />
                    </div>
                ))}
            </div>

            {/* Main Data Feed Area */}
            <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">

                {/* News & Activity Stack */}
                <div className="xl:col-span-8 space-y-12">
                    <div className="flex items-center justify-between border-b border-border pb-8">
                        <div className="flex items-center gap-4">
                            <Activity size={14} className="opacity-40" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">{t('latest_assets')}</h2>
                        </div>
                        <Link href="/admin/news" className="text-[9px] font-black uppercase tracking-[0.3em] border-b border-foreground hover:opacity-50 transition-all pb-1">
                            {t('log_all')}
                        </Link>
                    </div>

                    <div className="space-y-4">
                        {recentNews.map((item, idx) => (
                            <div key={item.id} className="p-8 border border-border hover:border-foreground/20 transition-all group flex flex-col md:flex-row items-start md:items-center gap-10 bg-card">
                                <div className="text-[10px] font-black font-mono opacity-20 group-hover:opacity-100 transition-opacity">
                                    {(idx + 1).toString().padStart(2, '0')}
                                </div>
                                <div className="h-20 w-32 bg-muted shrink-0 border border-border overflow-hidden relative">
                                    {item.image ? (
                                        <img src={item.image} alt="" className="object-cover w-full h-full grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-700" />
                                    ) : (
                                        <div className="h-full w-full flex items-center justify-center opacity-20">
                                            <Newspaper size={16} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1 space-y-2">
                                    <div className="flex items-center gap-4 text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground opacity-40">
                                        <span>{formatDate(item.createdAt, locale)}</span>
                                        <div className="h-1 w-1 bg-border rounded-full" />
                                        <span>UUID: {item.id.substring(0, 8)}</span>
                                    </div>
                                    <h4 className="text-2xl font-black uppercase tracking-tighter group-hover:text-foreground transition-opacity leading-none">
                                        {item.title}
                                    </h4>
                                </div>
                                <Link
                                    href={`/admin/news/${item.id}`}
                                    className="ms-auto h-12 w-12 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all group-hover:border-foreground"
                                >
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Comms & System Sidebar */}
                <div className="xl:col-span-4 space-y-16">
                    {/* Communications Module */}
                    <div className="space-y-10">
                        <div className="flex items-center gap-4 border-b border-border pb-8">
                            <ShieldCheck size={14} className="opacity-40" />
                            <h2 className="text-[10px] font-black uppercase tracking-[0.5em] text-muted-foreground">{t('secure_inbox')}</h2>
                        </div>

                        <div className="space-y-2">
                            {recentMessages.length > 0 ? (
                                recentMessages.map((msg) => (
                                    <Link key={msg.id} href="/admin/messages" className="block p-8 border border-border bg-card hover:bg-foreground/[0.03] transition-all group space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-4">
                                                <div className="h-8 w-8 bg-foreground text-background flex items-center justify-center text-[10px] font-black">
                                                    {msg.name.charAt(0)}
                                                </div>
                                                <div className="flex flex-col">
                                                    <span className="text-[10px] font-black uppercase tracking-[0.2em] group-hover:text-foreground">{msg.name}</span>
                                                    <span className="text-[8px] font-bold uppercase tracking-[0.4em] opacity-30">{formatDate(msg.createdAt, locale)}</span>
                                                </div>
                                            </div>
                                            {!msg.isRead && <div className="h-1.5 w-1.5 bg-accent animate-ping" />}
                                        </div>
                                        <p className="text-[11px] font-bold italic opacity-40 line-clamp-2 leading-relaxed uppercase tracking-tighter group-hover:opacity-80 transition-opacity">
                                            {msg.message}
                                        </p>
                                    </Link>
                                ))
                            ) : (
                                <div className="text-center py-20 border border-dashed border-border opacity-20 font-black uppercase tracking-[0.4em] text-[8px]">
                                    {t('no_inbound')}
                                </div>
                            )}
                        </div>

                        <Link href="/admin/messages" className="block w-full py-6 text-center border border-border text-[10px] font-black uppercase tracking-[0.4em] hover:bg-foreground hover:text-background transition-all">
                            {t('access_traffic')}
                        </Link>
                    </div>

                    {/* System Meta Panel */}
                    <div className="p-10 bg-foreground text-background space-y-10 relative overflow-hidden group">
                        <div className="absolute top-0 right-0 w-32 h-32 bg-background/[0.03] -rotate-45 translate-x-16 -translate-y-16 pointer-events-none" />

                        <Settings className="h-10 w-10 text-background group-hover:rotate-180 transition-transform duration-1000" />

                        <div className="space-y-6 relative z-10">
                            <h3 className="text-4xl font-black tracking-tighter uppercase leading-none text-background">
                                {t('core_parameters')}
                            </h3>
                            <p className="text-[10px] font-bold leading-relaxed uppercase tracking-[0.1em] text-background/60">
                                {t('config_infra')}
                            </p>
                            <Link href="/admin/settings" className="flex items-center gap-4 text-[11px] font-black uppercase tracking-[0.4em] text-background border-b-2 border-background inline-block pb-1 hover:opacity-50 transition-all">
                                {t('settings')} <ArrowRight size={14} />
                            </Link>
                        </div>

                        {/* Deco Element */}
                        <div className="pt-10 flex gap-2">
                            <div className="h-1 w-1 bg-background/10" />
                            <div className="h-1 w-1 bg-background/20" />
                            <div className="h-1 w-8 bg-background/30" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
