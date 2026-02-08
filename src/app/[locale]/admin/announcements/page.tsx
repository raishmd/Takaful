import { getTranslations, setRequestLocale } from 'next-intl/server';
import { prisma } from '@/lib/prisma';
import { Megaphone, Plus, Search, Filter, Edit, Trash2, Eye, MapPin, Tag, AlertTriangle, ShieldAlert, Terminal, Activity, ArrowUpRight, Database } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { deleteAnnouncement } from '@/lib/announcement-actions';
import { cn } from '@/lib/utils';
import { formatDate } from '@/lib/utils';

export default async function AdminAnnouncementsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('admin');

    const announcements = await prisma.announcement.findMany({
        orderBy: { createdAt: 'desc' }
    });

    return (
        <div className="space-y-16 pb-20">
            {/* Asset Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-border pb-10">
                <div className="space-y-4">
                    <div className="h-1.5 w-16 bg-foreground" />
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-foreground">
                        {t('announcement_assets')}.
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">
                        {t('registry')} {"//"} {announcements.length} {t('entries_detected')}
                    </p>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden xl:flex items-center gap-4 px-4 py-2 border border-border bg-foreground/[0.03] font-mono text-[10px]">
                        <ShieldAlert size={12} className="opacity-40 text-accent" />
                        <span className="opacity-40 italic">LAUNCH_MODE:</span>
                        <span className="text-accent font-black">ACTIVE_PROTO</span>
                    </div>
                    <Link href="/admin/announcements/new" className="h-16 px-10 bg-accent text-white text-[10px] font-black uppercase tracking-[0.4em] flex items-center justify-center hover:opacity-90 transition-all shadow-[0_0_30px_rgba(var(--accent),0.05)]">
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
                        className="w-full bg-foreground/[0.02] border border-border py-6 pl-16 pr-8 text-[11px] font-black tracking-[0.3em] text-foreground focus:border-foreground/20 transition-all outline-none uppercase placeholder:opacity-20"
                    />
                </div>
                <div className="flex gap-4">
                    <button className="h-16 w-16 border border-border flex items-center justify-center hover:bg-foreground/[0.03] transition-all">
                        <Filter size={18} className="opacity-40" />
                    </button>
                    <select className="h-16 px-6 bg-transparent border border-border text-[10px] font-black uppercase tracking-[0.4em] outline-none cursor-pointer">
                        <option value="">{t('all')}</option>
                        <option value="medical">MEDICAL</option>
                        <option value="food">FOOD</option>
                    </select>
                </div>
            </div>

            {/* Industrial Data Stream */}
            <div className="space-y-4">
                {announcements.map((item, idx) => (
                    <div key={item.id} className="group relative grid grid-cols-1 lg:grid-cols-12 items-center bg-card border border-border hover:border-foreground/20 transition-all duration-500 overflow-hidden">
                        {/* Status Bit (Lateral) */}
                        <div className={cn(
                            "absolute left-0 inset-y-0 w-1 z-20 transition-all duration-500",
                            item.isUrgent ? "bg-accent" : "bg-emerald-500"
                        )} />

                        {/* ID & Date Section */}
                        <div className="lg:col-span-2 p-8 border-e border-border flex flex-col items-center justify-center space-y-2 bg-foreground/[0.01]">
                            <span className="text-[10px] font-black font-mono opacity-20">#{(idx + 1).toString().padStart(3, '0')}</span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-foreground">{formatDate(item.createdAt, locale)}</span>
                        </div>

                        {/* Main Info Section */}
                        <div className="lg:col-span-6 p-8 flex items-center gap-10">
                            {item.image && (
                                <div className="h-16 w-16 shrink-0 border border-border overflow-hidden bg-muted group-hover:border-foreground/20 transition-all">
                                    <img src={item.image} alt="" className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all" />
                                </div>
                            )}
                            <div className="space-y-2">
                                <div className="flex items-center gap-4">
                                    <span className="text-[8px] font-black uppercase tracking-[0.3em] text-accent px-2 py-0.5 border border-accent/20 bg-accent/5">
                                        {t(`cat_${item.category.toLowerCase()}` as `cat_${string}`).toUpperCase()}
                                    </span>
                                    {item.isUrgent && (
                                        <div className="flex items-center gap-2 animate-pulse">
                                            <AlertTriangle size={10} className="text-accent" />
                                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-accent">PRIORITY_CRITICAL</span>
                                        </div>
                                    )}
                                </div>
                                <h3 className="text-xl font-black uppercase tracking-tighter text-foreground line-clamp-1">{item.title}</h3>
                            </div>
                        </div>

                        {/* Metadata Bits */}
                        <div className="lg:col-span-3 p-8 flex flex-wrap gap-10 items-center justify-start lg:justify-center border-s border-border bg-foreground/[0.01]">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40 flex items-center gap-2">
                                    <MapPin size={8} /> {t('geospatial')}
                                </span>
                                <span className="text-[10px] font-bold uppercase truncate max-w-[120px]">{item.location || 'N/A'}</span>
                            </div>
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase text-muted-foreground opacity-40 flex items-center gap-2">
                                    <Activity size={8} /> {t('persistence')}
                                </span>
                                <span className={cn(
                                    "text-[10px] font-bold uppercase",
                                    item.isActive ? "text-emerald-500" : "text-muted-foreground opacity-40"
                                )}>
                                    {item.isActive ? t('operational') : t('offline')}
                                </span>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="lg:col-span-1 border-s border-border p-4 flex flex-col items-center justify-center gap-2 bg-foreground/[0.03]">
                            <Link
                                href={`/admin/announcements/${item.id}`}
                                className="h-12 w-12 flex items-center justify-center border border-border hover:bg-foreground hover:text-background transition-all"
                            >
                                <Edit size={16} />
                            </Link>
                            <form action={async () => {
                                'use server';
                                await deleteAnnouncement(item.id);
                            }}>
                                <button type="submit" className="h-12 w-12 flex items-center justify-center border border-border hover:bg-rose-600 hover:text-white transition-all">
                                    <Trash2 size={16} />
                                </button>
                            </form>
                        </div>
                    </div>
                ))}

                {announcements.length === 0 && (
                    <div className="border border-dashed border-border p-20 flex flex-col items-center justify-center space-y-6 opacity-40">
                        <Terminal size={40} strokeWidth={1} />
                        <span className="text-[10px] font-black uppercase tracking-[0.5em]">{t('noResults')}</span>
                    </div>
                )}
            </div>
        </div>
    );
}
