'use client';

import * as React from 'react';
import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';

export function ModeToggle() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = React.useState(false);

    // useEffect only runs on the client, so now we can safely show the UI
    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div className="h-12 w-12 rounded-2xl bg-foreground/5 border border-border/50 animate-pulse" />
        );
    }

    return (
        <button
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className={cn(
                "relative h-12 w-12 rounded-xl flex items-center justify-center transition-all duration-500 overflow-hidden group",
                "bg-muted border border-border shadow-[inset_0_2px_4px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_2px_4px_rgba(255,255,255,0.05)]",
                "hover:border-foreground/20 text-foreground/70 hover:text-foreground active:scale-95"
            )}
            aria-label="Toggle theme"
        >
            <div className="relative h-5 w-5 z-10">
                <Sun className={cn(
                    "h-5 w-5 absolute transition-all duration-700 ease-out",
                    theme === 'dark' ? "translate-y-10 rotate-90 opacity-0" : "translate-y-0 rotate-0 opacity-100"
                )} />
                <Moon className={cn(
                    "h-5 w-5 absolute transition-all duration-700 ease-out",
                    theme === 'dark' ? "translate-y-0 rotate-0 opacity-100" : "-translate-y-10 -rotate-90 opacity-0"
                )} />
            </div>

            {/* Concave Industrial Effect */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/[0.03] to-white/[0.03] dark:from-white/[0.02] dark:to-black/[0.05] pointer-events-none" />
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-foreground/[0.02] pointer-events-none" />
        </button>
    );
}
