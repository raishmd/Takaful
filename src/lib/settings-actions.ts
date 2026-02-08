'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

export async function updateSettings(settings: Record<string, string>) {
    const entries = Object.entries(settings);

    try {
        await Promise.all(
            entries.map(([key, value]) =>
                prisma.settings.upsert({
                    where: { key },
                    update: { value },
                    create: { key, value }
                })
            )
        );

        revalidatePath('/admin/settings');
        return { success: true };
    } catch (error) {
        console.error('Failed to update settings:', error);
        return { success: false, error: 'Failed to update settings' };
    }
}

export async function getSettings() {
    try {
        const settings = await prisma.settings.findMany();
        return settings.reduce((acc, curr) => {
            acc[curr.key] = curr.value;
            return acc;
        }, {} as Record<string, string>);
    } catch (error) {
        console.error('Failed to fetch settings:', error);
        return {};
    }
}
