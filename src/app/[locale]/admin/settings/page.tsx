import { getTranslations, setRequestLocale } from 'next-intl/server';
import SettingsClient from './SettingsClient';
import { getSettings } from '@/lib/settings-actions';

export default async function AdminSettingsPage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const t = await getTranslations('admin');
    const settings = await getSettings();

    return (
        <div className="space-y-16">
            <div className="space-y-4 border-b border-border pb-10">
                <div className="h-1.5 w-16 bg-foreground" />
                <h1 className="text-4xl md:text-7xl font-black tracking-tighter uppercase text-foreground">
                    {t('settings')}.
                </h1>
                <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">
                    {locale === 'ar' ? 'تخصيص وإعدادات لوحة التحكم' : 'SYSTEM_CONFIGURATION_HUB'} {"//"} V_2.0.4
                </p>
            </div>

            <SettingsClient initialSettings={settings} locale={locale} />
        </div>
    );
}
