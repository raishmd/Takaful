import { setRequestLocale } from 'next-intl/server';
import { getSettings } from '@/lib/settings-actions';
import ContactClient from './ContactClient';

export default async function ContactPage({
    params
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    setRequestLocale(locale);
    const settings = await getSettings();

    return <ContactClient settings={settings} />;
}
