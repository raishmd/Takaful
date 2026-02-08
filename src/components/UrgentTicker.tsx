'use client';

import { Link } from '@/i18n/routing';
import { Announcement } from '@prisma/client';
import { AlertCircle, ArrowRight } from 'lucide-react';

interface UrgentTickerProps {
    announcements: Announcement[];
}

export default function UrgentTicker({ announcements }: UrgentTickerProps) {
    if (!announcements || announcements.length === 0) return null;

    // Create a very long string of announcements to ensure we cover any screen size multiple times
    // This makes the "loop" truly invisible and connected.
    const repetitions = 10;
    const repeatedAnnouncements = Array.from({ length: repetitions }).flatMap(() => announcements);

    return (
        <div
            className="fixed top-0 w-full bg-accent text-white h-10 flex items-center overflow-hidden border-b border-accent/20 z-[60]"
            dir="ltr" // Force LTR for the scroll container to make X-axis math predictable
        >
            {/* The Badge - Fixed on the right */}
            <div className="absolute right-0 top-0 bottom-0 bg-accent px-4 flex items-center gap-2 z-10 font-black text-[10px] uppercase tracking-widest border-l border-white/10 shadow-[-20px_0_30px_rgba(0,0,0,0.2)]">
                تنبيه عاجل
                <AlertCircle size={14} className="animate-pulse" />
            </div>

            <div className="flex animate-marquee hover:[animation-play-state:paused] cursor-default items-center">
                <div className="flex items-center flex-shrink-0">
                    {repeatedAnnouncements.map((ann, idx) => (
                        <div key={`${ann.id}-${idx}`} className="flex items-center flex-shrink-0" dir="rtl">
                            <Link
                                href={`/announcements/${ann.id}`}
                                className="inline-flex items-center gap-4 px-12 group transition-opacity hover:opacity-80"
                            >
                                <span className="text-[11px] font-black uppercase tracking-tight whitespace-nowrap">
                                    {ann.title}
                                </span>
                                <ArrowRight size={12} className="opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                            </Link>
                            {/* Logo Separator */}
                            <div className="flex items-center gap-3 px-6 border-x border-white/10">
                                <div className="h-1 w-1 bg-white rounded-full animate-pulse" />
                                <span className="font-black text-[9px] tracking-tighter uppercase opacity-30">التكافل</span>
                                <div className="h-1 w-1 bg-white rounded-full animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
                {/* Second copy for the perfect loop */}
                <div className="flex items-center flex-shrink-0">
                    {repeatedAnnouncements.map((ann, idx) => (
                        <div key={`loop-${ann.id}-${idx}`} className="flex items-center flex-shrink-0" dir="rtl">
                            <Link
                                href={`/announcements/${ann.id}`}
                                className="inline-flex items-center gap-4 px-12 group transition-opacity hover:opacity-80"
                            >
                                <span className="text-[11px] font-black uppercase tracking-tight whitespace-nowrap">
                                    {ann.title}
                                </span>
                                <ArrowRight size={12} className="opacity-40 group-hover:opacity-100 transition-all group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1" />
                            </Link>
                            {/* Logo Separator */}
                            <div className="flex items-center gap-3 px-6 border-x border-white/10">
                                <div className="h-1 w-1 bg-white rounded-full animate-pulse" />
                                <span className="font-black text-[9px] tracking-tighter uppercase opacity-30">التكافل</span>
                                <div className="h-1 w-1 bg-white rounded-full animate-pulse" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
