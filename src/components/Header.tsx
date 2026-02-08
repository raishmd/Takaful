'use client';

import { useTranslations } from 'next-intl';
import { Link, usePathname } from '@/i18n/routing';
import { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ModeToggle } from './ModeToggle';

interface HeaderProps {
    orgName?: string;
}

export default function Header({ orgName = 'التكافل' }: HeaderProps) {
    const t = useTranslations('common');
    const pathname = usePathname();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const navigation = [
        { name: t('home'), href: `/` },
        { name: t('news'), href: `/news` },
        { name: t('announcements'), href: `/announcements` },
        { name: t('contact'), href: `/contact` },
    ];

    return (
        <header
            className={cn(
                "fixed z-50 w-full transition-all duration-300 left-0 right-0",
                scrolled
                    ? "top-10 bg-background/90 backdrop-blur-md border-b border-border py-4"
                    : "top-10 bg-transparent py-8"
            )}
        >
            <div className="container flex items-center justify-between">

                {/* Logo Section */}
                <Link href="/" className="flex flex-col group relative z-50">
                    <span className={cn(
                        "font-black tracking-tighter leading-none text-foreground uppercase transition-all duration-300",
                        scrolled ? "text-xl" : "text-3xl"
                    )}>
                        {orgName}
                    </span>
                    <span className={cn(
                        "font-bold uppercase text-muted-foreground transition-all duration-300",
                        scrolled ? "text-[8px] tracking-[0.2em] mt-0.5" : "text-[10px] tracking-[0.3em] mt-1"
                    )}>
                        CHARITY ORGANIZATION
                    </span>
                </Link>

                {/* Desktop Navigation */}
                <nav className="hidden lg:flex items-center gap-10">
                    {navigation.map((item) => {
                        const isActive = pathname === item.href || (item.href === `/ar` && pathname === `/ar`);
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={cn(
                                    "text-sm font-bold transition-all duration-200 hover:text-foreground",
                                    isActive
                                        ? "text-foreground"
                                        : "text-muted-foreground"
                                )}
                            >
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                {/* Actions Section */}
                <div className="hidden lg:flex items-center gap-8 z-50">
                    <ModeToggle />
                </div>

                {/* Mobile Menu Toggle */}
                <div className="lg:hidden flex items-center gap-6 z-50">
                    <ModeToggle />
                    <button
                        className="text-foreground"
                        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    >
                        {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
                    </button>
                </div>
            </div>

            {/* Simple Mobile Menu */}
            <div className={cn(
                "fixed inset-0 z-40 bg-background transition-all duration-500 lg:hidden flex flex-col justify-center items-center gap-10",
                mobileMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-y-4"
            )}>
                {navigation.map((item) => (
                    <Link
                        key={item.name}
                        href={item.href}
                        className="text-4xl font-black text-foreground uppercase tracking-tighter"
                        onClick={() => setMobileMenuOpen(false)}
                    >
                        {item.name}
                    </Link>
                ))}
            </div>
        </header>
    );
}
