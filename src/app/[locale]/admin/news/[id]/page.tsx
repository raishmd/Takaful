import { getTranslations, setRequestLocale } from 'next-intl/server';
import { X, Trash2, Database } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { updateNews, deleteNews } from '@/lib/news-actions';
import NewsForm from '@/components/admin/NewsForm';

export default async function EditNewsPage({
    params,
}: {
    params: Promise<{ locale: string; id: string }>;
}) {
    const { locale, id } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('admin');

    const news = await prisma.news.findUnique({
        where: { id },
    });

    if (!news) notFound();

    const updateAction = updateNews.bind(null, id);
    const deleteAction = deleteNews.bind(null, id);

    return (
        <div className="space-y-16 pb-20">
            {/* Command Header */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-10 border-b border-border pb-10">
                <div className="space-y-4">
                    <div className="h-1.5 w-16 bg-foreground" />
                    <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-foreground">
                        {t('edit_report')}
                    </h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">
                        EDITORIAL_SYNC_MODE {"//"} ID: {id.substring(0, 12)}...
                    </p>
                </div>
                <div className="flex items-center gap-6">
                    <div className="hidden xl:flex items-center gap-4 px-4 py-2 border border-border bg-foreground/[0.03] font-mono text-[10px]">
                        <Database size={12} className="opacity-40" />
                        <span className="opacity-40 italic">{t('link_status')}:</span>
                        <span className="text-emerald-500 font-black">{t('active_entry')}</span>
                    </div>

                    <form action={deleteAction}>
                        <button type="submit" className="h-16 w-16 border border-rose-900/40 text-rose-500 hover:bg-rose-600 hover:text-white transition-all flex items-center justify-center">
                            <Trash2 className="h-6 w-6" />
                        </button>
                    </form>

                    <Link href="/admin/news" className="h-16 w-16 border border-border flex items-center justify-center hover:bg-foreground hover:text-background transition-all">
                        <X className="h-6 w-6" />
                    </Link>
                </div>
            </div>

            <div className="bg-card border border-border p-8 md:p-16">
                <NewsForm action={updateAction} initialData={news} />
            </div>
        </div>
    );
}
