import { getTranslations, setRequestLocale } from 'next-intl/server';
import { X, ShieldAlert } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { createAnnouncement } from '@/lib/announcement-actions';
import AnnouncementForm from '@/components/admin/AnnouncementForm';

export default async function NewAnnouncementPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('admin');

    return (
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-border pb-10">
                <div className="space-y-4">
                    <div className="h-1.5 w-16 bg-foreground" />
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-foreground">
                        {t('new_case_title')}
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">
                        ANNOUNCEMENT_PROTOCOL_INIT {"//"} PRIORITY_CHECK_OK
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden xl:flex items-center gap-4 px-4 py-2 border border-border bg-foreground/[0.03] font-mono text-[10px]">
                        <ShieldAlert size={12} className="opacity-40" />
                        <span className="opacity-40 italic">{t('sys_mode')}:</span>
                        <span className="text-foreground font-black">{t('authorized')}</span>
                    </div>
                    <Link href="/admin/announcements" className="h-16 w-16 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                        <X className="h-6 w-6" />
                    </Link>
                </div>
            </div>

            <div className="bg-card border border-border p-8 md:p-16">
                <AnnouncementForm action={createAnnouncement} />
            </div>
        </div>
    );
}
