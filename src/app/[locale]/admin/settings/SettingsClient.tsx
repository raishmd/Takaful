'use client';

import { useState } from 'react';
import {
    Globe, Shield, Mail, Bell,
    Save, Key, Share2, Info,
    Database, Lock, Eye, EyeOff, Trash2 as TrashIcon, Terminal, Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { updateSettings } from '@/lib/settings-actions';
import { useTranslations } from 'next-intl';

interface SettingsClientProps {
    initialSettings: Record<string, string>;
    locale: string;
}

export default function SettingsClient({ initialSettings, locale }: SettingsClientProps) {
    const t = useTranslations('admin');
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState(initialSettings);
    const [isSaving, setIsSaving] = useState(false);
    const [showSmtpPass, setShowSmtpPass] = useState(false);

    const [socialLinks, setSocialLinks] = useState<{ platform: string, url: string }[]>(() => {
        try {
            return initialSettings.socialLinks ? JSON.parse(initialSettings.socialLinks) : [];
        } catch {
            return [];
        }
    });

    const tabs = [
        { id: 'general', icon: Globe, label: t('tab_general') },
        { id: 'communication', icon: Mail, label: t('tab_comm') },
        { id: 'security', icon: Shield, label: t('tab_security') },
        { id: 'integrations', icon: Database, label: t('tab_integrations') },
    ];

    const handleChange = (key: string, value: string) => {
        setSettings(prev => ({ ...prev, [key]: value }));
    };

    const addSocialLink = () => {
        setSocialLinks([...socialLinks, { platform: '', url: '' }]);
    };

    const removeSocialLink = (index: number) => {
        setSocialLinks(socialLinks.filter((_, i) => i !== index));
    };

    const updateSocialLink = (index: number, field: 'platform' | 'url', value: string) => {
        const newLinks = [...socialLinks];
        newLinks[index][field] = value;
        setSocialLinks(newLinks);
    };

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            const updatedSettings = {
                ...settings,
                socialLinks: JSON.stringify(socialLinks)
            };
            const result = await updateSettings(updatedSettings);
            if (result.success) {
                toast.success(locale === 'ar' ? 'تم حفظ الإعدادات بنجاح' : 'Settings saved successfully');
            } else {
                throw new Error('Update failed');
            }
        } catch {
            toast.error(locale === 'ar' ? 'فشل حفظ الإعدادات' : 'Failed to save settings');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
            {/* Sidebar Navigation - Industrial Vertical Matrix */}
            <div className="lg:col-span-3 space-y-6">
                <div className="flex flex-col gap-1">
                    {tabs.map((tab, idx) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={cn(
                                "relative w-full flex items-center gap-6 px-10 h-20 transition-all duration-700 group overflow-hidden border border-border",
                                activeTab === tab.id
                                    ? "bg-foreground text-background translate-x-4 skew-x-[-2deg]"
                                    : "bg-foreground/[0.02] text-foreground hover:bg-foreground/[0.05] hover:border-foreground/20"
                            )}
                        >
                            <div className="flex flex-col items-center gap-1 shrink-0">
                                <tab.icon className={cn("h-4 w-4", activeTab === tab.id ? "text-background" : "opacity-30 group-hover:opacity-100")} />
                                <span className="text-[7px] font-black opacity-30">0{idx + 1}</span>
                            </div>
                            <div className="flex flex-col items-start translate-x-0 group-hover:translate-x-2 transition-transform">
                                <span className="text-[10px] font-black uppercase tracking-[0.3em] leading-none">{tab.label}</span>
                                {activeTab === tab.id && (
                                    <span className="text-[7px] font-bold uppercase tracking-[0.2em] opacity-40 mt-1 animate-pulse">SYSTEM_ACTIVE</span>
                                )}
                            </div>

                            {activeTab === tab.id && (
                                <div className="absolute right-0 top-0 bottom-0 w-2 bg-background opacity-10" />
                            )}
                        </button>
                    ))}
                </div>

                {/* System Stats Block */}
                <div className="p-8 border border-border bg-foreground/[0.01] space-y-4">
                    <div className="flex items-center gap-3">
                        <Activity size={10} className="text-emerald-500" />
                        <span className="text-[8px] font-black uppercase tracking-[0.3em] text-muted-foreground">NODE_STATUS: ONLINE</span>
                    </div>
                    <div className="h-px bg-border w-full" />
                    <div className="space-y-2">
                        <div className="flex justify-between text-[8px] font-mono opacity-30 uppercase">
                            <span>LATENCY</span>
                            <span>12ms</span>
                        </div>
                        <div className="h-1 bg-border w-full overflow-hidden">
                            <div className="h-full bg-emerald-500 w-[80%] animate-pulse" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area - Technical Configuration Shell */}
            <div className="lg:col-span-9">
                <form onSubmit={handleSave} className="space-y-16">

                    {/* General Section */}
                    {activeTab === 'general' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="space-y-6 group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-foreground" />
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground group-focus-within:text-foreground transition-colors">
                                            {t('org_name')}
                                        </label>
                                    </div>
                                    <input
                                        type="text"
                                        value={settings.orgName || ''}
                                        onChange={(e) => handleChange('orgName', e.target.value)}
                                        className="w-full bg-foreground/[0.02] border border-border p-6 text-xl font-black focus:border-foreground/20 focus:bg-foreground/[0.04] transition-all outline-none text-foreground uppercase tracking-tighter"
                                        placeholder="TAKAFUL_CORP"
                                    />
                                </div>
                                <div className="space-y-6 group">
                                    <div className="flex items-center gap-3">
                                        <div className="h-2 w-2 bg-foreground" />
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground group-focus-within:text-foreground transition-colors">
                                            {t('official_email')}
                                        </label>
                                    </div>
                                    <input
                                        type="email"
                                        value={settings.officialEmail || ''}
                                        onChange={(e) => handleChange('officialEmail', e.target.value)}
                                        className="w-full bg-foreground/[0.02] border border-border p-6 text-xl font-black focus:border-foreground/20 focus:bg-foreground/[0.04] transition-all outline-none text-foreground uppercase tracking-tighter"
                                        placeholder="COMMS@TAKAFUL.DZ"
                                    />
                                </div>
                            </div>

                            <div className="space-y-6 group">
                                <div className="flex items-center gap-3">
                                    <div className="h-2 w-2 bg-foreground" />
                                    <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground group-focus-within:text-foreground transition-colors">
                                        {t('org_bio')}
                                    </label>
                                </div>
                                <textarea
                                    value={settings.orgBio || ''}
                                    onChange={(e) => handleChange('orgBio', e.target.value)}
                                    rows={4}
                                    className="w-full bg-foreground/[0.02] border border-border p-8 text-sm font-bold focus:border-foreground/20 focus:bg-foreground/[0.04] transition-all outline-none resize-none leading-relaxed text-foreground/60 uppercase"
                                    placeholder="TRANSMISSION START..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                                <div className="p-10 bg-foreground/[0.01] border border-border space-y-10 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none group-hover:opacity-10 transition-opacity">
                                        <Share2 size={80} />
                                    </div>

                                    <div className="flex items-center justify-between relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 bg-foreground text-background flex items-center justify-center">
                                                <Share2 size={16} />
                                            </div>
                                            <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">{t('social_links')}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={addSocialLink}
                                            className="h-10 px-6 bg-foreground/5 text-[9px] font-black uppercase tracking-[0.2em] hover:bg-foreground hover:text-background transition-all border border-border"
                                        >
                                            + {t('add_entry')}
                                        </button>
                                    </div>

                                    <div className="space-y-4 relative z-10">
                                        {socialLinks.length === 0 && (
                                            <div className="text-center py-10 opacity-20 text-[10px] font-black uppercase tracking-widest border border-dashed border-border">
                                                {t('noResults')}
                                            </div>
                                        )}
                                        {socialLinks.map((link, idx) => (
                                            <div key={idx} className="p-6 bg-background/40 border border-border flex gap-6 items-center group/item hover:border-foreground/20 transition-all">
                                                <div className="flex-1 space-y-3">
                                                    <input
                                                        type="text"
                                                        value={link.platform}
                                                        onChange={(e) => updateSocialLink(idx, 'platform', e.target.value)}
                                                        className="w-full bg-transparent border-b border-border py-1 text-[10px] uppercase font-black focus:border-foreground outline-none text-foreground tracking-widest"
                                                        placeholder="PLATFORM"
                                                    />
                                                    <input
                                                        type="text"
                                                        value={link.url}
                                                        onChange={(e) => updateSocialLink(idx, 'url', e.target.value)}
                                                        className="w-full bg-transparent border-b border-border py-1 text-[9px] font-bold focus:border-foreground outline-none text-muted-foreground focus:text-foreground"
                                                        placeholder="HTTPS://ENDPOINT.DZ"
                                                    />
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => removeSocialLink(idx)}
                                                    className="h-10 w-10 flex items-center justify-center text-rose-500/40 hover:text-rose-500 hover:bg-rose-500/10 transition-all"
                                                >
                                                    <TrashIcon size={14} />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="p-10 bg-foreground/[0.01] border border-border space-y-8 relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-4 opacity-[0.05] pointer-events-none group-hover:opacity-10 transition-opacity">
                                        <Globe size={100} />
                                    </div>

                                    <div className="flex items-center gap-4 relative z-10">
                                        <div className="h-10 w-10 bg-foreground text-background flex items-center justify-center">
                                            <Globe size={16} />
                                        </div>
                                        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-foreground">{t('geospatial_coord')}</span>
                                    </div>
                                    <textarea
                                        value={settings.address || ''}
                                        onChange={(e) => handleChange('address', e.target.value)}
                                        rows={4}
                                        className="w-full bg-transparent border-b border-border py-4 text-sm font-bold focus:border-foreground transition-all outline-none resize-none text-muted-foreground focus:text-foreground uppercase leading-relaxed relative z-10"
                                        placeholder="ALGIERS_NORTH_HUB..."
                                    />
                                    <div className="pt-4 flex gap-1 opacity-20 relative z-10">
                                        {[...Array(12)].map((_, i) => (
                                            <div key={i} className="h-1 w-4 bg-foreground" />
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Communication/SMTP Section */}
                    {activeTab === 'communication' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="bg-foreground/[0.02] p-12 border border-border relative overflow-hidden group">
                                <div className="absolute bottom-[-50px] left-[-30px] p-4 opacity-[0.02] pointer-events-none rotate-12 text-foreground">
                                    <Mail size={300} />
                                </div>

                                <div className="flex items-center gap-6 mb-16 relative z-10">
                                    <div className="h-16 w-16 bg-foreground text-background flex items-center justify-center rotate-3">
                                        <Mail className="h-6 w-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-3xl font-black uppercase tracking-tighter text-foreground">{t('smtp_config')}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">{locale === 'ar' ? 'مطلوب لإرسال تنبيهات الحالات العاجلة' : 'CRYPTO_SECURE_MAIL_GATEWAY'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 relative z-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">{locale === 'ar' ? 'خادم البريد' : 'HOST_ENDPOINT'}</label>
                                        <input
                                            type="text"
                                            value={settings.smtpHost || ''}
                                            onChange={(e) => handleChange('smtpHost', e.target.value)}
                                            className="w-full bg-background border border-border p-6 text-[11px] font-black uppercase tracking-widest text-foreground focus:border-foreground/20 transition-all outline-none"
                                            placeholder="SMTP.SERVER.NET"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">{locale === 'ar' ? 'المنفذ' : 'PORT_INT_KEY'}</label>
                                        <input
                                            type="text"
                                            value={settings.smtpPort || ''}
                                            onChange={(e) => handleChange('smtpPort', e.target.value)}
                                            className="w-full bg-background border border-border p-6 text-[11px] font-black uppercase tracking-widest text-foreground focus:border-foreground/20 transition-all outline-none"
                                            placeholder="587"
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mt-12 relative z-10">
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">{locale === 'ar' ? 'اسم المستخدم' : 'USER_IDENTITY'}</label>
                                        <input
                                            type="text"
                                            value={settings.smtpUser || ''}
                                            onChange={(e) => handleChange('smtpUser', e.target.value)}
                                            className="w-full bg-background border border-border p-6 text-[11px] font-black tracking-widest text-foreground focus:border-foreground/20 transition-all outline-none"
                                        />
                                    </div>
                                    <div className="space-y-4">
                                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-muted-foreground opacity-40">{locale === 'ar' ? 'كلمة المرور' : 'ACCESS_PHRASE'}</label>
                                        <div className="relative">
                                            <input
                                                type={showSmtpPass ? 'text' : 'password'}
                                                value={settings.smtpPass || ''}
                                                onChange={(e) => handleChange('smtpPass', e.target.value)}
                                                className="w-full bg-background border border-border p-6 text-[11px] font-black tracking-widest text-foreground focus:border-foreground/20 transition-all outline-none pr-16"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => setShowSmtpPass(!showSmtpPass)}
                                                className="absolute right-6 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                                            >
                                                {showSmtpPass ? <EyeOff size={16} /> : <Eye size={16} />}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-12 border border-border bg-foreground/[0.01] space-y-12">
                                <div className="flex items-center gap-6 border-b border-border pb-8">
                                    <Bell className="h-6 w-6 opacity-40" />
                                    <span className="text-[12px] font-black uppercase tracking-[0.5em] text-foreground/50">{locale === 'ar' ? 'تفضيلات التنبيهات' : 'NOTIFICATION_MATRIX'}</span>
                                </div>
                                <div className="flex items-center justify-between group">
                                    <div className="space-y-2">
                                        <p className="text-sm font-black uppercase tracking-tighter text-foreground group-hover:text-accent transition-colors">{locale === 'ar' ? 'تنبيهات الحالات الجديدة' : 'GLOBAL_SIGNAL_BROADCAST'}</p>
                                        <p className="text-[10px] font-bold text-muted-foreground opacity-40 uppercase tracking-widest">{locale === 'ar' ? 'إرسال بريد إلكتروني عند إضافة حالة جديدة' : 'AUTOMATIC INTERNAL CORE ALERT ON ENTRY'}</p>
                                    </div>
                                    <div className="h-10 w-20 bg-foreground/5 border border-border p-1 cursor-pointer transition-all hover:border-foreground/30">
                                        <div className="h-full w-8 bg-foreground" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Security Section */}
                    {activeTab === 'security' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="border border-border p-16 space-y-16 bg-foreground/[0.01] relative overflow-hidden group">
                                <div className="absolute top-[-40px] right-[-40px] p-4 opacity-[0.02] group-hover:opacity-[0.05] transition-opacity pointer-events-none text-foreground">
                                    <Lock size={200} />
                                </div>

                                <div className="flex items-center gap-10 relative z-10">
                                    <div className="h-20 w-20 bg-foreground text-background flex items-center justify-center -rotate-6">
                                        <Key className="h-8 w-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-4xl font-black uppercase tracking-tighter text-foreground">{t('security_config')}</h3>
                                        <p className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40 italic">{locale === 'ar' ? 'تحديث بيانات الدخول للمشرف' : 'REWRITE_ACCESS_PERMISSIONS'}</p>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 relative z-10">
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">{locale === 'ar' ? 'كلمة المرور الحالية' : 'CURRENT_HASH'}</label>
                                        <input
                                            type="password"
                                            className="w-full bg-transparent border-b border-border py-4 text-xl font-black focus:border-foreground outline-none transition-all text-foreground"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div className="space-y-6">
                                        <label className="text-[10px] font-black uppercase tracking-[0.4em] text-muted-foreground opacity-40">{locale === 'ar' ? 'كلمة المرور الجديدة' : 'NEW_ENCRYPT_PHRASE'}</label>
                                        <input
                                            type="password"
                                            className="w-full bg-transparent border-b border-border py-4 text-xl font-black focus:border-foreground outline-none transition-all text-foreground"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="border border-accent/20 bg-accent/5 p-16 space-y-10 relative group border-s-8">
                                <div className="flex items-center gap-8">
                                    <div className="h-14 w-14 bg-accent/20 flex items-center justify-center text-accent rounded-full animate-pulse">
                                        <Shield size={24} />
                                    </div>
                                    <h4 className="text-2xl font-black uppercase tracking-tighter text-accent">{locale === 'ar' ? 'إجراءات حساسة' : 'CRITICAL_SYSTEM_LEVEL_ACTIONS'}</h4>
                                </div>
                                <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-12">
                                    <p className="text-sm font-bold text-muted-foreground leading-relaxed max-w-2xl uppercase tracking-tight">
                                        {locale === 'ar'
                                            ? 'سيؤدي تنفيذ هذا الإجراء إلى تسجيل خروج جميع المستخدمين الحاليين وطلب تغيير كلمة المرور فوراً.'
                                            : 'Executing this protocol will terminate all active session tokens and mandate an immediate global authentication override for all admin endpoints.'}
                                    </p>
                                    <button className="h-20 px-12 bg-accent text-white text-[11px] font-black uppercase tracking-[0.4em] hover:opacity-90 transition-all whitespace-nowrap shadow-[0_0_30px_rgba(var(--accent),0.1)]">
                                        {locale === 'ar' ? 'إعادة ضبط الجلسات' : 'INITIATE_SESSION_PURGE'}
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Integrations Section */}
                    {activeTab === 'integrations' && (
                        <div className="space-y-16 animate-in fade-in slide-in-from-right-4 duration-700">
                            <div className="border border-border p-16 space-y-16 bg-foreground/[0.01]">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-20">
                                    <div className="space-y-8 group">
                                        <div className="flex items-center gap-4 text-muted-foreground group-focus-within:text-foreground transition-colors">
                                            <Database className="h-5 w-5" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.5em]">{t('geospatial_coord')} (API)</span>
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={settings.googleMapsKey || ''}
                                                onChange={(e) => handleChange('googleMapsKey', e.target.value)}
                                                className="w-full bg-background border border-border p-6 text-[11px] font-black tracking-widest text-foreground focus:border-foreground transition-all outline-none"
                                                placeholder="GOOGLE_MAPS_KEY_INFRA"
                                            />
                                            <div className="flex items-center gap-2 text-[8px] font-black text-emerald-500/40 uppercase tracking-widest">
                                                <div className="h-1 w-1 bg-emerald-500 rounded-full" />
                                                <span>SYSTEM_REQUIREMENT: SPATIAL_MAPPING</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-8 group">
                                        <div className="flex items-center gap-4 text-muted-foreground group-focus-within:text-foreground transition-colors">
                                            <Shield className="h-5 w-5" />
                                            <span className="text-[11px] font-black uppercase tracking-[0.5em]">{locale === 'ar' ? 'كابتشا (v3)' : 'BOT_MITIGATION_ID'}</span>
                                        </div>
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                value={settings.recaptchaKey || ''}
                                                onChange={(e) => handleChange('recaptchaKey', e.target.value)}
                                                className="w-full bg-background border border-border p-6 text-[11px] font-black tracking-widest text-foreground focus:border-foreground transition-all outline-none"
                                                placeholder="RECAPTCHA_PUBLIC_RELOAD"
                                            />
                                            <div className="flex items-center gap-2 text-[8px] font-black text-emerald-500/40 uppercase tracking-widest">
                                                <div className="h-1 w-1 bg-emerald-500 rounded-full" />
                                                <span>SYSTEM_REQUIREMENT: DDoS_SHIELD</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-foreground text-background p-16 flex flex-col items-center text-center space-y-10 group overflow-hidden relative">
                                <div className="absolute top-0 left-0 h-full w-2 bg-background opacity-10 group-hover:bg-accent transition-all duration-700" />
                                <Info className="h-12 w-12 opacity-60 group-hover:rotate-12 transition-transform" />
                                <div className="max-w-2xl space-y-6">
                                    <h4 className="text-4xl font-black uppercase tracking-tighter leading-none">{locale === 'ar' ? 'نسخ احتياطي خارجي' : 'CORE_DATA_ARCHIVAL_PROTOCOL'}</h4>
                                    <p className="text-[11px] font-bold leading-relaxed uppercase tracking-[0.1em] opacity-60">
                                        {locale === 'ar'
                                            ? 'يوصى بجدولة نسخ احتياطي لقاعدة البيانات أسبوعياً. يمكنك تحميل نسخة مشفرة كاملة من هنا.'
                                            : 'Executing a full system snapshot will encapsulate the current operational database into a secure encrypted archive. This procedure is recommended at 168-hour intervals.'}
                                    </p>
                                </div>
                                <button className="h-20 px-16 border-2 border-background hover:bg-background hover:text-foreground text-[11px] font-black uppercase tracking-[0.5em] transition-all relative overflow-hidden group/btn">
                                    <span className="relative z-10">{locale === 'ar' ? 'بدء تصدير البيانات' : 'INITIATE_EXFILTRATION'}</span>
                                    <div className="absolute inset-0 bg-background translate-y-full group-hover/btn:translate-y-0 transition-transform duration-500" />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Industrial Fixed Action Bar */}
                    <div className="sticky bottom-10 z-[50] -mx-4 px-4 pointer-events-none">
                        <div className="bg-background/80 backdrop-blur-2xl border border-border p-8 flex items-center justify-between shadow-[0_30px_60px_rgba(0,0,0,0.4)] pointer-events-auto max-w-5xl mx-auto">
                            <div className="hidden md:flex flex-col gap-1">
                                <div className="flex items-center gap-3 text-[10px] font-black uppercase text-emerald-500 tracking-[0.4em]">
                                    <Terminal className="h-3 w-3" />
                                    {locale === 'ar' ? 'النظام جاهز للمزامنة' : 'SYSTEM_READY_FOR_SYNC'}
                                </div>
                                <span className="text-[8px] font-bold text-foreground/20 uppercase tracking-[0.5em]">LAST_SAVE: {new Date().toLocaleTimeString()}</span>
                            </div>

                            <button
                                disabled={isSaving}
                                className={cn(
                                    "h-20 px-20 bg-foreground text-background text-[12px] font-black uppercase tracking-[0.5em] transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-6 group overflow-hidden relative",
                                    isSaving && "opacity-50"
                                )}
                            >
                                <div className="absolute inset-0 bg-background translate-y-full group-hover:translate-y-0 transition-transform duration-500 opacity-20" />
                                <div className="relative z-10 flex items-center gap-6">
                                    {isSaving ? (
                                        <>
                                            <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                                            <span>{locale === 'ar' ? 'جاري المزامنة...' : 'SYNCING_PROTOCOL...'}</span>
                                        </>
                                    ) : (
                                        <>
                                            <Save className="h-5 w-5" />
                                            <span>{locale === 'ar' ? 'حفظ التغييرات' : 'COMMIT_CHANGES'}</span>
                                        </>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
}
