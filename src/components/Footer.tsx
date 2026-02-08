import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { getSettings } from '@/lib/settings-actions';

export default async function Footer() {
    const t = await getTranslations('common');
    const currentYear = new Date().getFullYear();
    const settings = await getSettings();

    // Parse social links from JSON string
    let socialLinks: { platform: string, url: string }[] = [];
    try {
        if (settings.socialLinks) {
            socialLinks = JSON.parse(settings.socialLinks);
        }
    } catch (error) {
        console.error('Failed to parse social links:', error);
    }

    const navigation = [
        { name: t('home'), href: `/` },
        { name: t('news'), href: `/news` },
        { name: t('announcements'), href: `/announcements` },
        { name: t('contact'), href: `/contact` },
    ];

    const officialEmail = settings.officialEmail || 'contact@takaful.dz';
    const officialPhone = settings.officialPhone || '+213 (0) 23 45 67 89';
    const address = settings.address || 'الجزائر العاصمة، القبة';

    return (
        <footer className="relative bg-background text-foreground pt-24 pb-20 overflow-hidden border-t border-border">
            {/* Subtle Dot Pattern */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: 'radial-gradient(circle, currentColor 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

            <div className="container relative z-10">

                {/* Large CTA Section */}
                <div className="flex flex-col md:flex-row justify-between items-start mb-24 gap-20">
                    <div className="space-y-8">
                        <h2 className="text-4xl md:text-6xl font-black tracking-tighter leading-tight">
                            تواصل معنا...
                        </h2>
                        <div className="flex flex-wrap gap-6">
                            {socialLinks.length > 0 ? (
                                socialLinks.map((link, idx) => (
                                    <a
                                        key={idx}
                                        href={link.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all hover:-translate-y-1 block"
                                    >
                                        # {link.platform}
                                    </a>
                                ))
                            ) : (
                                ['Tiktok', 'Youtube', 'Linkedin', 'Instagram', 'Twitter'].map((social) => (
                                    <span key={social} className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/30">
                                        # {social}
                                    </span>
                                ))
                            )}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-16 md:gap-32 pt-4">
                        <div className="space-y-6">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground uppercase">رابط سريع</h4>
                            <ul className="space-y-4">
                                {navigation.map((link) => (
                                    <li key={link.name}>
                                        <Link href={link.href} className="text-lg font-black hover:text-muted-foreground transition-all">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div className="space-y-10">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground border-b border-border pb-4">
                                معلومات الاتصال
                            </h4>
                            <div className="space-y-8">
                                <div className="group">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-50">البريد الإلكتروني</p>
                                    <a href={`mailto:${officialEmail}`} className="text-xl font-black hover:text-muted-foreground transition-colors block">
                                        {officialEmail}
                                    </a>
                                </div>
                                <div className="group">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-50">رقم الهاتف</p>
                                    <a href={`tel:${officialPhone.replace(/\s+/g, '')}`} className="text-xl font-black hover:text-muted-foreground transition-colors block" dir="ltr">
                                        {officialPhone}
                                    </a>
                                </div>
                                <div className="group">
                                    <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mb-1 opacity-50">المقر الرئيسي</p>
                                    <p className="text-sm font-bold text-foreground leading-relaxed whitespace-pre-line">
                                        {address}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom Bar */}
                <div className="pt-12 mt-12 border-t border-border/50">
                    <div className="grid grid-cols-1 md:grid-cols-3 items-center gap-12 text-center md:text-start">
                        {/* Copyright */}
                        <div className="order-2 md:order-1">
                            <p className="text-[9px] font-black uppercase tracking-[0.4em] text-muted-foreground/60 leading-relaxed">
                                © {currentYear} {settings.orgName || 'منظمة التكافل'}. <br className="hidden sm:block md:hidden" /> جميع الحقوق محفوظة.
                            </p>
                        </div>

                        {/* Centered Logo Design */}
                        <div className="order-1 md:order-2 flex justify-center">
                            <Link href="/" className="group flex flex-col items-center">
                                <span className="font-black tracking-tighter leading-none text-xl uppercase group-hover:tracking-[0.2em] transition-all duration-500">
                                    {settings.orgName || 'التكافل'}
                                </span>
                                <div className="h-0.5 w-6 bg-foreground/10 mt-2 group-hover:w-12 group-hover:bg-foreground transition-all duration-500" />
                            </Link>
                        </div>

                        {/* Legal Links */}
                        <div className="order-3 flex md:justify-end gap-10 justify-center">
                            {[
                                { name: 'الخصوصية', href: '#' },
                                { name: 'الشروط', href: '#' },
                                { name: 'الكوكيز', href: '#' }
                            ].map((item) => (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    className="text-[9px] font-black uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground transition-all duration-300"
                                >
                                    {item.name}
                                </Link>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
