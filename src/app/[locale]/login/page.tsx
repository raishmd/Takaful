'use client';

import { useActionState } from 'react';
import { authenticate } from '@/lib/actions';
import { useTranslations } from 'next-intl';
import { Loader2 } from 'lucide-react';

export default function LoginPage() {
    const t = useTranslations('admin');
    const [errorMessage, dispatch, isPending] = useActionState(
        authenticate,
        undefined,
    );

    return (
        <div className="flex min-h-screen items-center justify-center bg-background p-4 transition-all duration-300">
            <div className="w-full max-w-md space-y-12 p-12 border border-border">
                <div className="space-y-4">
                    <div className="h-1 w-12 bg-foreground mb-8" />
                    <h1 className="text-4xl font-black tracking-tighter uppercase text-foreground">{t('login')}</h1>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                        {t('welcome')}
                    </p>
                </div>

                <form action={dispatch} className="space-y-10">
                    <div className="space-y-8">
                        <div className="space-y-3">
                            <label htmlFor="email" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                {t('email')}
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="block w-full px-0 py-3 border-b border-border bg-transparent focus:outline-none focus:border-foreground transition-all font-bold"
                            />
                        </div>
                        <div className="space-y-3">
                            <label htmlFor="password" className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground">
                                {t('password')}
                            </label>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                minLength={6}
                                className="block w-full px-0 py-3 border-b border-border bg-transparent focus:outline-none focus:border-foreground transition-all font-bold"
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        <button
                            type="submit"
                            disabled={isPending}
                            className="group relative flex w-full justify-center bg-foreground py-6 px-4 text-[10px] font-black uppercase tracking-[0.4em] text-background hover:bg-opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        >
                            {isPending ? (
                                <Loader2 className="h-5 w-5 animate-spin" />
                            ) : (
                                t('login')
                            )}
                        </button>

                        {errorMessage && (
                            <div
                                className="p-4 border border-accent bg-accent/5 text-[10px] font-black uppercase tracking-widest text-accent text-center"
                                aria-live="polite"
                            >
                                <p>{errorMessage}</p>
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
}
