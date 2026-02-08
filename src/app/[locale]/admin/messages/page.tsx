import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { MessageSquare, Search, Trash2, CheckCircle, Mail, Phone, Calendar, Check, X, ArrowUpRight, ShieldCheck, Terminal, Fingerprint } from 'lucide-react';
import { formatDate } from '@/lib/utils';
import { cn } from '@/lib/utils';
import { deleteMessage, markMessageAsRead } from '@/lib/message-actions';

export default async function AdminMessagesPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('admin');

    const messages = await prisma.contactSubmission.findMany({
        orderBy: { createdAt: 'desc' },
    });

    return (
        <div className="space-y-16 pb-20">
            {/* Page Header Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-border pb-10">
                <div className="space-y-4">
                    <div className="h-1 w-12 bg-foreground" />
                    <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase text-foreground">
                        {t('messages')}.
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">
                        {t('traffic_analysis')} {"//"} {t('inbound_streams')}
                    </p>
                </div>

                <div className="flex items-center gap-6 font-mono">
                    <div className="px-4 py-2 border border-border bg-foreground/[0.03] flex items-center gap-3">
                        <Terminal size={12} className="opacity-40" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-emerald-500">SYSTEM_ACTIVE</span>
                    </div>
                </div>
            </div>

            {/* Matrix Filter & Search */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                <div className="lg:col-span-8 relative group">
                    <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-foreground opacity-20 group-focus-within:opacity-100 transition-opacity" />
                    <input
                        type="text"
                        placeholder={t('filter_metadata')}
                        className="w-full bg-foreground/[0.02] border border-border py-6 pl-16 pr-8 text-[11px] font-black tracking-[0.3em] text-foreground focus:border-foreground/20 transition-all outline-none uppercase placeholder:opacity-20 translate-y-0 focus:-translate-y-1"
                    />
                </div>
                <div className="lg:col-span-4 flex gap-4">
                    <button className="flex-1 h-16 border border-border bg-foreground/[0.02] text-[10px] font-black uppercase tracking-[0.4em] hover:bg-foreground hover:text-background transition-all">
                        {t('archive_logs')}
                    </button>
                </div>
            </div>

            {/* Message Stream */}
            <div className="space-y-4">
                {messages.length > 0 ? (
                    messages.map((item, idx) => (
                        <div key={item.id} className={cn(
                            "group relative overflow-hidden transition-all duration-500 bg-card border border-border",
                            !item.isRead && "border-s-4 border-s-emerald-500"
                        )}>
                            <div className={cn(
                                "p-10 flex flex-col xl:flex-row items-start gap-12",
                                item.isRead && "opacity-50"
                            )}>
                                {/* Segment Identity */}
                                <div className="flex flex-col items-center gap-4 pt-1">
                                    <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center font-black text-xl rotate-3 group-hover:rotate-0 transition-transform">
                                        {item.name.charAt(0)}
                                    </div>
                                    <span className="text-[9px] font-black font-mono opacity-20">#{idx + 1}</span>
                                </div>

                                {/* Content Core */}
                                <div className="flex-1 space-y-6">
                                    <div className="flex flex-wrap items-center gap-6">
                                        <div className="space-y-1">
                                            <h4 className="text-xl font-black uppercase tracking-tighter text-foreground">
                                                {item.name}
                                            </h4>
                                            <div className="flex items-center gap-3 text-[9px] font-black uppercase tracking-widest text-muted-foreground opacity-40">
                                                <Mail size={10} /> {item.email}
                                            </div>
                                        </div>
                                        <div className="h-4 w-px bg-border hidden md:block" />
                                        <div className="space-y-1">
                                            <span className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 italic">{t('timestamp')}</span>
                                            <div className="text-[10px] font-black tracking-widest">{formatDate(item.createdAt, locale)}</div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-accent font-mono block">{t('subject')}: {item.subject}</span>
                                        <p className="text-sm font-bold text-muted-foreground leading-relaxed uppercase tracking-tighter max-w-4xl line-clamp-3 group-hover:line-clamp-none transition-all duration-700">
                                            {item.message}
                                        </p>
                                    </div>
                                </div>

                                {/* Controls Matrix */}
                                <div className="flex xl:flex-col gap-3 ms-auto">
                                    {!item.isRead ? (
                                        <form action={async () => {
                                            'use server';
                                            await markMessageAsRead(item.id);
                                        }}>
                                            <button
                                                type="submit"
                                                className="h-12 w-12 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all group/btn"
                                                title={t('mark_processed')}
                                            >
                                                <Check className="h-4 w-4" />
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="h-12 w-12 border border-border flex items-center justify-center text-emerald-500/40">
                                            <ShieldCheck className="h-4 w-4" />
                                        </div>
                                    )}

                                    <form action={async () => {
                                        'use server';
                                        await deleteMessage(item.id);
                                    }}>
                                        <button
                                            type="submit"
                                            className="h-12 w-12 border border-border flex items-center justify-center hover:bg-rose-600 hover:text-white transition-all hover:border-rose-600"
                                            title={t('purge_record')}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </form>
                                </div>
                            </div>

                            {/* Scanning Deco Effect */}
                            <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-20 transition-opacity pointer-events-none">
                                <Fingerprint size={120} className="text-foreground" />
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center py-60 border border-dashed border-border space-y-10">
                        <MessageSquare className="h-20 w-20 text-foreground opacity-5" />
                        <div className="text-center space-y-4">
                            <h3 className="text-2xl font-black uppercase tracking-[0.5em] text-muted-foreground opacity-20">
                                {t('signal_quiet')}
                            </h3>
                            <p className="text-[9px] font-bold uppercase tracking-[0.4em] text-muted-foreground opacity-10">
                                {t('no_inbound_comm')}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
