'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Save, Sparkles, Upload, FileText, Activity, ShieldCheck } from 'lucide-react';

const TiptapEditor = dynamic(() => import('./TiptapEditor'), { ssr: false });

interface NewsFormProps {
    action: (formData: FormData) => Promise<void>;
    initialData?: {
        title: string;
        content: string;
        image?: string | null;
        isActive: boolean;
        isUrgent: boolean;
    };
}

export default function NewsForm({ action, initialData }: NewsFormProps) {
    const t = useTranslations('admin');
    const [content, setContent] = useState(initialData?.content || '');
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

    const onImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const url = URL.createObjectURL(file);
            setImagePreview(url);
        }
    };

    return (
        <form action={action} className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            <div className="lg:col-span-8 space-y-16">
                <div className="space-y-12">
                    <div className="space-y-6 group">
                        <div className="flex items-center gap-3">
                            <FileText size={14} className="text-foreground opacity-40 group-focus-within:opacity-100 transition-opacity" />
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground group-focus-within:text-foreground transition-colors">
                                {t('title')}
                            </label>
                        </div>
                        <input
                            name="title"
                            required
                            defaultValue={initialData?.title}
                            placeholder="INPUT_ENTITY_HEADLINE_HERE..."
                            className="w-full bg-foreground/[0.02] border border-border p-8 text-3xl font-black uppercase tracking-tighter focus:border-foreground/20 transition-all outline-none text-foreground placeholder:opacity-10"
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Activity size={14} className="text-foreground opacity-40" />
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                                {t('content')}_CORE_BODY
                            </label>
                        </div>
                        <div className="bg-foreground/[0.02] border border-border p-1">
                            <div className="prose prose-invert max-w-none">
                                <TiptapEditor
                                    content={content}
                                    onChange={setContent}
                                />
                                <input type="hidden" name="content" value={content} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
                <div className="space-y-12">
                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">{t('image')}_ASSET</label>
                        <div className="relative group overflow-hidden border border-border bg-foreground/[0.02] transition-colors hover:border-foreground/20">
                            <input
                                type="file"
                                name="image"
                                accept="image/*"
                                onChange={onImageChange}
                                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                            />
                            <div className="flex flex-col items-center justify-center p-10 text-center space-y-6 h-80 relative">
                                {imagePreview ? (
                                    <img src={imagePreview} alt="Preview" className="absolute inset-0 w-full h-full object-cover grayscale transition-all group-hover:scale-110" />
                                ) : (
                                    <>
                                        <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center -rotate-3 group-hover:rotate-0 transition-transform">
                                            <Upload className="h-6 w-6" />
                                        </div>
                                        <div className="space-y-2">
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">UPLOAD_MEDIA_UNIT</p>
                                            <p className="text-[8px] font-bold text-muted-foreground opacity-30 tracking-[0.2em]">MAX_SIZE: 10MB / JPG_PNG</p>
                                        </div>
                                    </>
                                )}
                                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground border border-foreground/20 px-4 py-2 bg-background/60">REPLACE_ASSET</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-px bg-border border border-border">
                        <label className="flex items-center justify-between p-6 bg-card cursor-pointer group hover:bg-foreground transition-all">
                            <div className="flex items-center gap-4">
                                <ShieldCheck size={14} className="text-emerald-500 group-hover:text-background" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-background">{t('isActive')}</span>
                            </div>
                            <div className="relative">
                                <input type="checkbox" name="isActive" defaultChecked={initialData ? initialData.isActive : true} className="sr-only peer" />
                                <div className="w-12 h-1 bg-foreground/10 peer-checked:bg-emerald-500 transition-all" />
                                <div className="absolute -top-1.5 left-0 w-4 h-4 bg-foreground/40 transition-all peer-checked:translate-x-8 peer-checked:bg-background" />
                            </div>
                        </label>

                        <label className="flex items-center justify-between p-6 bg-card cursor-pointer group hover:bg-accent transition-all">
                            <div className="flex items-center gap-4">
                                <Activity size={14} className="text-accent group-hover:text-white" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-white">{t('isUrgent')}</span>
                            </div>
                            <div className="relative">
                                <input type="checkbox" name="isUrgent" defaultChecked={initialData?.isUrgent} className="sr-only peer" />
                                <div className="w-12 h-1 bg-foreground/10 peer-checked:bg-white transition-all" />
                                <div className="absolute -top-1.5 left-0 w-4 h-4 bg-foreground/40 transition-all peer-checked:translate-x-8 peer-checked:bg-background" />
                            </div>
                        </label>
                    </div>

                    <button type="submit" className="h-20 w-full bg-foreground text-background text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-6 hover:opacity-90 transition-all shadow-[0_0_40px_rgba(var(--foreground),0.05)] active:scale-95 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-background translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
                        <Save className="h-5 w-5" />
                        <span>{initialData ? t('saveChanges') : t('publishNow')}</span>
                    </button>

                    <div className="p-10 border border-border bg-foreground/[0.01] space-y-6 relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none">
                            <Sparkles size={60} />
                        </div>
                        <div className="flex items-center gap-4 text-emerald-500 opacity-60">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">EDITORIAL_INTELLIGENCE</span>
                        </div>
                        <p className="text-[10px] font-bold leading-relaxed uppercase tracking-tighter text-muted-foreground opacity-40 italic">
                            OPTIMIZE VISUAL ASSETS FOR HIGH-CONTRAST DISPLAYS. ENSURE HEADLINES ARE CONCISE AND TECHNICAL.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
