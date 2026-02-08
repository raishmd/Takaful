'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from '@/i18n/routing';
import { AnnouncementCategory } from '@prisma/client';

// ... imports
import { uploadFile } from './file-upload';

export async function createAnnouncement(formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as AnnouncementCategory;
    const location = formData.get('location') as string;
    const contactInfo = formData.get('contactInfo') as string;

    const imageEntry = formData.get('image');
    let imagePath = '';

    if (imageEntry instanceof File && imageEntry.size > 0) {
        const uploaded = await uploadFile(imageEntry, 'announcements');
        if (uploaded) imagePath = uploaded;
    } else if (typeof imageEntry === 'string') {
        imagePath = imageEntry;
    }

    const isActive = formData.get('isActive') === 'on';
    const isUrgent = formData.get('isUrgent') === 'on';

    // Temporary: Get first user as author
    const user = await prisma.user.findFirst();
    if (!user) throw new Error('No user found');

    await prisma.announcement.create({
        data: {
            title,
            description,
            category,
            location,
            contactInfo,
            image: imagePath,
            isActive,
            isUrgent,
            authorId: user.id,
        },
    });

    revalidatePath('/admin/announcements');
    redirect({ href: '/admin/announcements?success=created', locale: 'ar' });
}

export async function updateAnnouncement(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as AnnouncementCategory;
    const location = formData.get('location') as string;
    const contactInfo = formData.get('contactInfo') as string;

    const imageEntry = formData.get('image');
    let imagePath = undefined;

    if (imageEntry instanceof File && imageEntry.size > 0) {
        const uploaded = await uploadFile(imageEntry, 'announcements');
        if (uploaded) imagePath = uploaded;
    } else if (typeof imageEntry === 'string' && imageEntry.trim() !== '') {
        imagePath = imageEntry;
    }

    const isActive = formData.get('isActive') === 'on';
    const isUrgent = formData.get('isUrgent') === 'on';

    const updateData: Record<string, string | boolean | undefined> = {
        title,
        description,
        category,
        location,
        contactInfo,
        isActive,
        isUrgent,
    };
    if (imagePath) updateData.image = imagePath;

    await prisma.announcement.update({
        where: { id },
        data: updateData,
    });

    revalidatePath('/admin/announcements');
    redirect({ href: '/admin/announcements?success=updated', locale: 'ar' });
}

export async function deleteAnnouncement(id: string) {
    await prisma.announcement.delete({
        where: { id },
    });
    revalidatePath('/admin/announcements');
    redirect({ href: '/admin/announcements?success=deleted', locale: 'ar' });
}
