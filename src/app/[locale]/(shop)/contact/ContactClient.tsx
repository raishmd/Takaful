'use client';

import { useTranslations } from 'next-intl';
import { useState } from 'react';
import { MapPin, Phone, Mail, CheckCircle, Loader2, Sparkles, ArrowRight, ShieldCheck, Clock } from 'lucide-react';

interface ContactClientProps {
    settings: Record<string, string>;
}

export default function ContactClient({ settings }: ContactClientProps) {
    const t = useTranslations();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');

        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const response = await fetch('/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) throw new Error('Failed to submit');

            setIsSuccess(true);
            e.currentTarget.reset();
        } catch (err) {
            setError(t('contact.error'));
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="flex min-h-screen flex-col bg-background transition-all duration-300">
            <main className="flex-grow">
                {/* Minimalist Header */}
                <div className="relative pt-32 pb-20 border-b border-border">
                    <div className="container">
                        <div className="max-w-4xl space-y-8 reveal">
                            <div className="h-1 w-20 bg-foreground" />
                            <h1 className="text-6xl md:text-[120px] font-black tracking-tighter leading-[1.2] text-foreground uppercase">
                                {t('contact.title')} <br />
                                <span className="opacity-40">دائماً هنا للمساعدة</span>
                            </h1>
                        </div>
                    </div>
                </div>

                <div className="container py-24 pb-40">
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-20 items-start">

                        {/* Information Sidebar */}
                        <div className="lg:col-span-4 space-y-16 reveal" style={{ animationDelay: '0.1s' }}>
                            <div className="space-y-12">
                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">{t('announcements.location')}</h3>
                                    <p className="text-xl font-black uppercase whitespace-pre-line">
                                        {settings.address || 'الجزائر العاصمة، الجزائر \n القبة، الشارع الرئيسي'}
                                    </p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">{t('contact.phone')}</h3>
                                    <p className="text-xl font-black uppercase" dir="ltr">{settings.officialPhone || '+213 (0) 23 45 67 89'}</p>
                                </div>

                                <div className="space-y-4">
                                    <h3 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">{t('contact.email')}</h3>
                                    <p className="text-xl font-black uppercase">{settings.officialEmail || 'contact@takaful.dz'}</p>
                                </div>
                            </div>

                            <div className="p-10 bg-muted/30 border border-border">
                                <p className="text-[10px] font-black uppercase tracking-[0.3em] mb-4">ساعات العمل</p>
                                <p className="text-sm font-bold opacity-60">الأحد - الخميس <br /> 09:00 - 17:00</p>
                            </div>
                        </div>

                        {/* Modern Form Section */}
                        <div className="lg:col-span-8 reveal" style={{ animationDelay: '0.2s' }}>
                            {isSuccess ? (
                                <div className="text-center py-40 space-y-8 border border-border">
                                    <CheckCircle className="h-12 w-12 mx-auto text-green-500 mb-4" />
                                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter text-foreground">
                                        {t('contact.success')}
                                    </h2>
                                    <button
                                        onClick={() => setIsSuccess(false)}
                                        className="text-sm font-black uppercase tracking-[0.2em] border-b-2 border-foreground pb-2"
                                    >
                                        إرسال رسالة أخرى
                                    </button>
                                </div>
                            ) : (
                                <form onSubmit={handleSubmit} className="space-y-16">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
                                        <div className="space-y-4">
                                            <label htmlFor="name" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                                {t('contact.name')}
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                required
                                                className="w-full bg-transparent border-b border-border py-4 focus:border-foreground outline-none transition-all font-bold text-lg"
                                            />
                                        </div>
                                        <div className="space-y-4">
                                            <label htmlFor="phone" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                                {t('contact.phone')}
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                className="w-full bg-transparent border-b border-border py-4 focus:border-foreground outline-none transition-all font-bold text-lg"
                                            />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                            {t('contact.email')}
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            required
                                            className="w-full bg-transparent border-b border-border py-4 focus:border-foreground outline-none transition-all font-bold text-lg"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label htmlFor="subject" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                            {t('contact.subject')}
                                        </label>
                                        <input
                                            type="text"
                                            id="subject"
                                            name="subject"
                                            required
                                            className="w-full bg-transparent border-b border-border py-4 focus:border-foreground outline-none transition-all font-bold text-lg"
                                        />
                                    </div>

                                    <div className="space-y-4">
                                        <label htmlFor="message" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                            {t('contact.message')}
                                        </label>
                                        <textarea
                                            id="message"
                                            name="message"
                                            required
                                            rows={4}
                                            className="w-full bg-transparent border-b border-border py-4 focus:border-foreground outline-none transition-all font-bold text-lg resize-none min-h-[120px]"
                                        ></textarea>
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={isSubmitting}
                                        className="w-full py-8 bg-foreground text-background font-black uppercase tracking-[0.4em] hover:bg-opacity-90 transition-all flex items-center justify-center gap-4"
                                    >
                                        {isSubmitting ? (
                                            <Loader2 className="h-6 w-6 animate-spin" />
                                        ) : (
                                            <>
                                                <span>{t('contact.send')}</span>
                                                <ArrowRight className="h-5 w-5 rtl:rotate-180" />
                                            </>
                                        )}
                                    </button>
                                </form>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
