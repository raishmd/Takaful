'use client';

import { useState } from 'react';
import dynamic from 'next/dynamic';
import { useTranslations } from 'next-intl';
import { Save, MapPin, Phone, Sparkles, Upload, FileText, Database, ShieldAlert, Activity } from 'lucide-react';
import { AnnouncementCategory } from '@prisma/client';

const TiptapEditor = dynamic(() => import('./TiptapEditor'), { ssr: false });

interface AnnouncementFormProps {
    action: (formData: FormData) => Promise<void>;
    initialData?: {
        title: string;
        description: string;
        image?: string | null;
        location?: string | null;
        contactInfo?: string | null;
        category: AnnouncementCategory;
        isActive: boolean;
        isUrgent: boolean;
    };
}

export default function AnnouncementForm({ action, initialData }: AnnouncementFormProps) {
    const t = useTranslations('admin');
    const [description, setDescription] = useState(initialData?.description || '');
    const [imagePreview, setImagePreview] = useState<string | null>(initialData?.image || null);

    const categories = Object.values(AnnouncementCategory);

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
                                {t('title')}_INDEX
                            </label>
                        </div>
                        <input
                            name="title"
                            required
                            defaultValue={initialData?.title}
                            placeholder="CASE_IDENTIFIER_TITLE..."
                            className="w-full bg-foreground/[0.02] border border-border p-8 text-3xl font-black uppercase tracking-tighter focus:border-foreground/20 transition-all outline-none text-foreground placeholder:opacity-10"
                        />
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center gap-3">
                            <Database size={14} className="text-foreground opacity-40" />
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground">
                                {t('description')}_DATA_BODY
                            </label>
                        </div>
                        <div className="bg-foreground/[0.02] border border-border p-1">
                            <div className="prose prose-invert max-w-none">
                                <TiptapEditor
                                    content={description}
                                    onChange={setDescription}
                                />
                                <input type="hidden" name="description" value={description} />
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                        <div className="space-y-6 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">GEOSPATIAL_COORD</label>
                            <div className="relative">
                                <input
                                    name="location"
                                    defaultValue={initialData?.location || ''}
                                    placeholder="NORTH_SECTOR / STREET..."
                                    className="w-full bg-foreground/[0.02] border border-border p-6 pl-16 text-[11px] font-black uppercase tracking-widest focus:border-foreground transition-all outline-none text-foreground"
                                />
                                <MapPin className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                            </div>
                        </div>
                        <div className="space-y-6 group">
                            <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">COMM_ENDPOINT</label>
                            <div className="relative">
                                <input
                                    name="contactInfo"
                                    defaultValue={initialData?.contactInfo || ''}
                                    placeholder="+213_SYS_LINK..."
                                    className="w-full bg-foreground/[0.02] border border-border p-6 pl-16 text-[11px] font-black uppercase tracking-widest focus:border-foreground transition-all outline-none text-foreground"
                                />
                                <Phone className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 opacity-40 group-focus-within:opacity-100 transition-opacity" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-4 space-y-12">
                <div className="space-y-12">
                    <div className="space-y-6 group">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">{t('category')}_BRANCH</label>
                        <div className="relative">
                            <select
                                name="category"
                                required
                                defaultValue={initialData?.category}
                                className="w-full bg-foreground/[0.04] border border-border p-6 text-[11px] font-black uppercase tracking-[0.4em] focus:border-foreground/20 transition-all outline-none appearance-none cursor-pointer text-foreground bg-card"
                            >
                                {categories.map((cat) => (
                                    <option key={cat} value={cat} className="bg-card text-foreground">
                                        {t(`cat_${cat.toLowerCase()}` as `cat_${string}`).toUpperCase()}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none opacity-40">
                                <Database size={14} />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">VISUAL_ASSET</label>
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
                                            <p className="text-[10px] font-black uppercase tracking-[0.3em]">INIT_MEDIA_UPLOAD</p>
                                            <p className="text-[8px] font-bold text-muted-foreground opacity-30 tracking-[0.2em]">ENC_STREAM: JPG_PNG</p>
                                        </div>
                                    </>
                                )}
                                <div className="absolute inset-0 bg-background/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center pointer-events-none">
                                    <span className="text-[10px] font-black uppercase tracking-widest text-foreground border border-foreground/20 px-4 py-2 bg-background/60">REWRITE_STREAM</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-px bg-border border border-border">
                        <label className="flex items-center justify-between p-6 bg-card cursor-pointer group hover:bg-foreground transition-all">
                            <div className="flex items-center gap-4">
                                <Activity size={14} className="text-emerald-500 group-hover:text-background" />
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
                                <ShieldAlert size={14} className="text-accent group-hover:text-white" />
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground group-hover:text-white">{t('isUrgent')}</span>
                            </div>
                            <div className="relative">
                                <input type="checkbox" name="isUrgent" defaultChecked={initialData?.isUrgent} className="sr-only peer" />
                                <div className="w-12 h-1 bg-foreground/10 peer-checked:bg-white transition-all" />
                                <div className="absolute -top-1.5 left-0 w-4 h-4 bg-foreground/40 transition-all peer-checked:translate-x-8 peer-checked:bg-background" />
                            </div>
                        </label>
                    </div>

                    <button type="submit" className="h-20 w-full bg-foreground text-background text-[12px] font-black uppercase tracking-[0.5em] flex items-center justify-center gap-6 hover:bg-emerald-500 hover:text-white transition-all shadow-[0_0_40px_rgba(var(--foreground),0.05)] active:scale-95 group overflow-hidden relative">
                        <div className="absolute inset-0 bg-background translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-10" />
                        <Save className="h-5 w-5" />
                        <span>{initialData ? t('saveChanges') : 'SYNC_NEW_CASE'}</span>
                    </button>

                    <div className="p-10 border border-border bg-foreground/[0.01] space-y-6 relative overflow-hidden">
                        <div className="absolute bottom-[-20px] left-[-20px] p-4 opacity-[0.05] pointer-events-none text-foreground">
                            <ShieldAlert size={100} />
                        </div>
                        <div className="flex items-center gap-4 text-accent opacity-60">
                            <Sparkles className="h-4 w-4" />
                            <span className="text-[9px] font-black uppercase tracking-[0.3em]">VALIDATION_MATRIX</span>
                        </div>
                        <p className="text-[10px] font-bold leading-relaxed uppercase tracking-tighter text-muted-foreground opacity-40 italic">
                            PRECISION IN GEOSPATIAL AND CONTACT METADATA IS CRITICAL FOR MISSION SUCCESS AND RESPONSE EFFICIENCY.
                        </p>
                    </div>
                </div>
            </div>
        </form>
    );
}
