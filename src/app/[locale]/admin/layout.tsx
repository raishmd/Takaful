'use client';

import { Link, usePathname } from '@/i18n/routing';
import { useTranslations, useLocale } from 'next-intl';
import {
    LayoutDashboard,
    Megaphone,
    Newspaper,
    MessageSquare,
    Settings,
    LogOut,
    Heart,
    ChevronLeft,
    ChevronRight,
    Menu,
    X,
    ExternalLink,
    Terminal,
    Cpu,
    Shield,
    Activity,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { ModeToggle } from '@/components/ModeToggle';

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const t = useTranslations('admin');
    const locale = useLocale();
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState('');

    useEffect(() => {
        const timer = setInterval(() => {
            const now = new Date();
            setCurrentTime(now.toLocaleTimeString(locale === 'ar' ? 'ar-DZ' : 'en-US', { hour12: false }));
        }, 1000);
        return () => clearInterval(timer);
    }, [locale]);

    const sidebarItems = [
        { icon: LayoutDashboard, label: 'dashboard', href: `/admin`, id: '01' },
        { icon: Newspaper, label: 'manageNews', href: `/admin/news`, id: '02' },
        { icon: Megaphone, label: 'manageAnnouncements', href: `/admin/announcements`, id: '03' },
        { icon: MessageSquare, label: 'messages', href: `/admin/messages`, id: '04' },
        { icon: Settings, label: 'settings', href: `/admin/settings`, id: '05' },
    ];

    const isActive = (href: string) => {
        if (href === '/admin') return pathname === '/admin';
        return pathname.startsWith(href);
    };

    useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [pathname]);

    return (
        <div className="flex min-h-screen bg-background text-foreground transition-all duration-300 font-outfit overflow-x-hidden selection:bg-foreground selection:text-background">

            {/* Ambient Background Detail */}
            <div className="fixed inset-0 pointer-events-none opacity-[0.03] overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(currentColor_1px,transparent_1px)] [background-size:40px_40px]" />
            </div>

            {/* Mobile Sidebar Overlay */}
            {isMobileMenuOpen && (
                <div
                    className="fixed inset-0 bg-background/95 z-[100] lg:hidden backdrop-blur-xl transition-opacity animate-in fade-in"
                    onClick={() => setIsMobileMenuOpen(false)}
                />
            )}

            {/* Sidebar - Industrial Mono Aesthetic */}
            <aside className={cn(
                "fixed inset-y-0 z-[110] flex flex-col bg-card text-foreground transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) border-e border-border",
                isSidebarOpen ? "w-80" : "w-24",
                isMobileMenuOpen
                    ? (locale === 'ar' ? "translate-x-0" : "translate-x-0")
                    : (locale === 'ar' ? "translate-x-[101%] lg:translate-x-0" : "-translate-x-[101%] lg:translate-x-0"),
            )}>
                {/* Brand Section */}
                <div className="h-24 flex items-center px-10 border-b border-border relative shrink-0">
                    <Link href="/" className="flex items-center gap-5 group">
                        <div className="h-10 w-10 bg-foreground text-background flex items-center justify-center shrink-0 rotate-3 group-hover:rotate-0 transition-transform">
                            <Heart className="h-5 w-5 fill-current" />
                        </div>
                        {isSidebarOpen && (
                            <div className="flex flex-col">
                                <span className="text-xl font-black tracking-tighter uppercase leading-none italic">{t('os_name')}</span>
                                <span className="text-[7px] font-black uppercase tracking-[0.5em] opacity-30 mt-1">{t('os_version')}</span>
                            </div>
                        )}
                    </Link>

                    {/* Mobile Close */}
                    <button onClick={() => setIsMobileMenuOpen(false)} className="lg:hidden absolute right-6 h-10 w-10 flex items-center justify-center opacity-40 hover:opacity-100">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Navigation */}
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto no-scrollbar pt-10">
                    {sidebarItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex items-center gap-5 px-6 py-5 transition-all group relative overflow-hidden",
                                isActive(item.href)
                                    ? "bg-foreground text-background"
                                    : "opacity-30 hover:opacity-100 hover:bg-foreground/[0.03]"
                            )}
                        >
                            <span className={cn(
                                "text-[9px] font-black font-mono w-4 opacity-40",
                                isActive(item.href) && "opacity-40"
                            )}>
                                {item.id}
                            </span>
                            <item.icon className={cn(
                                "h-4 w-4 shrink-0 transition-transform duration-500",
                                isActive(item.href) ? "scale-110" : "group-hover:translate-x-1 rtl:group-hover:-translate-x-1"
                            )} />
                            {isSidebarOpen && (
                                <span className="font-black text-[10px] uppercase tracking-[0.3em] whitespace-nowrap">{t(item.label)}</span>
                            )}
                            {isActive(item.href) && isSidebarOpen && (
                                <ChevronRight className={cn(
                                    "h-3 w-3 ms-auto opacity-40",
                                    locale === 'ar' && "rotate-180"
                                )} />
                            )}
                        </Link>
                    ))}
                </nav>

                {/* System Diagnostics (Sidebar Footer) */}
                <div className="p-8 border-t border-border space-y-8 bg-gradient-to-t from-foreground/[0.02] to-transparent">
                    {isSidebarOpen && (
                        <div className="space-y-4">
                            <div className="flex items-center justify-between text-[8px] font-black uppercase tracking-widest opacity-30">
                                <span>{t('status_up')}</span>
                                <span className="text-emerald-500 font-bold">99.8%</span>
                            </div>
                            <div className="h-0.5 w-full bg-foreground/10 relative overflow-hidden">
                                <div className="absolute inset-y-0 left-0 w-2/3 bg-foreground animate-pulse" />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="hidden lg:flex items-center justify-center h-12 w-12 border border-border hover:border-foreground transition-all hover:bg-foreground hover:text-background"
                        >
                            <div className="transition-transform duration-500">
                                {isSidebarOpen ? (
                                    <ChevronLeft className={cn("h-4 w-4", locale === 'ar' && "rotate-180")} />
                                ) : (
                                    <ChevronRight className={cn("h-4 w-4", locale === 'ar' && "rotate-180")} />
                                )}
                            </div>
                        </button>

                        <button className="flex-1 flex items-center justify-center gap-3 h-12 bg-foreground text-background font-black text-[10px] uppercase tracking-[0.4em] transition-all hover:opacity-90 active:scale-[0.98]">
                            <LogOut className="h-3.5 w-3.5" />
                            {isSidebarOpen && <span>{t('logout')}</span>}
                        </button>
                    </div>
                </div>
            </aside>

            {/* Main Viewport Container */}
            <div className={cn(
                "flex-1 flex flex-col min-h-screen transition-all duration-700 ease-in-out",
                isSidebarOpen ? "lg:ms-80" : "lg:ms-24",
            )}>
                {/* Meta Topbar */}
                <header className="sticky top-0 z-[80] h-24 bg-background/80 backdrop-blur-2xl border-b border-border px-8 md:px-12 flex items-center justify-between overflow-hidden">
                    <div className="flex items-center gap-10">
                        {/* Mobile Toggle */}
                        <button
                            className="lg:hidden h-12 w-12 border border-border flex items-center justify-center active:bg-foreground active:text-background transition-all"
                            onClick={() => setIsMobileMenuOpen(true)}
                        >
                            <Menu className="h-5 w-5" />
                        </button>

                        {/* Technical Metadata (Desktop) */}
                        <div className="hidden xl:flex items-center gap-12 font-mono">
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest leading-none opacity-40">{t('system_clock')}</span>
                                <span className="text-[12px] font-black tracking-tighter flex items-center gap-2">
                                    <Clock className="h-3 w-3 text-emerald-500" />
                                    {currentTime}
                                </span>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest leading-none opacity-40">{t('uplink_status')}</span>
                                <span className="text-[12px] font-black tracking-tighter flex items-center gap-3">
                                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500 shadow-[0_0_10px_#10b981]" />
                                    {t('encrypted_ssl')}
                                </span>
                            </div>
                            <div className="w-px h-8 bg-border" />
                            <div className="flex flex-col gap-1">
                                <span className="text-[8px] font-black uppercase text-muted-foreground tracking-widest leading-none opacity-40">{t('node_loc')}</span>
                                <span className="text-[12px] font-black tracking-tighter">{t('node_val')}</span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center gap-6">
                        {/* Theme Toggle */}
                        <ModeToggle />

                        {/* Portal Link */}
                        <Link
                            href="/"
                            className="hidden md:flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground hover:text-foreground transition-all border-b border-transparent hover:border-foreground pb-1"
                        >
                            <ExternalLink className="h-3 w-3" />
                            <span>{t('portal')}</span>
                        </Link>

                        {/* Identity Module */}
                        <div className="flex items-center gap-6 px-6 py-3 border border-border bg-foreground/[0.02] hover:bg-foreground/[0.05] transition-colors group cursor-pointer">
                            <div className="flex flex-col items-end">
                                <span className="text-[10px] font-black uppercase tracking-[0.2em] leading-none mb-1">{t('admin_root')}</span>
                                <span className="text-[8px] font-bold uppercase tracking-[0.4em] opacity-30">{t('access_level')}</span>
                            </div>
                            <div className="h-10 w-10 bg-foreground text-background flex items-center justify-center font-black text-xs rotate-3 group-hover:rotate-0 transition-transform">
                                AD
                            </div>
                        </div>
                    </div>

                    {/* Topbar Scanline Effect */}
                    <div className="absolute bottom-0 left-0 w-full h-[1px] bg-foreground opacity-20 animate-scanline pointer-events-none" />
                </header>

                {/* Content Area */}
                <main className="flex-1 p-8 md:p-12 lg:p-16 xl:p-20 relative bg-background">
                    {/* Corner Detail Decoration */}
                    <div className="absolute top-0 right-0 w-24 h-24 border-t-2 border-r-2 border-border pointer-events-none" />
                    <div className="absolute bottom-10 left-10 w-12 h-12 border-b-2 border-l-2 border-border pointer-events-none" />

                    <div className="max-w-7xl mx-auto reveal animate-in slide-in-from-bottom-5 duration-700">
                        {children}
                    </div>
                </main>

                {/* Footer Technical Metadata */}
                <footer className="h-16 border-t border-border flex items-center justify-between px-12 md:px-16 text-[9px] font-black tracking-[0.5em] text-muted-foreground opacity-40 uppercase font-mono">
                    <div className="flex items-center gap-10">
                        <span>{t('cpu_load')}_3%</span>
                        <span>{t('mem_used')}_1.2GB</span>
                        <span>{t('net_tx')}_12KB/S</span>
                    </div>
                    <div className="hidden sm:block">
                        {t('build')}_2026.02.04.1452
                    </div>
                </footer>
            </div>
        </div>
    );
}
