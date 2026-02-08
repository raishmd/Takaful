'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from '@/i18n/routing';

// ... imports
import { uploadFile } from './file-upload';

export async function createNews(formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const imageEntry = formData.get('image');
    let imagePath = '';

    if (imageEntry instanceof File && imageEntry.size > 0) {
        const uploaded = await uploadFile(imageEntry, 'news');
        if (uploaded) imagePath = uploaded;
    } else if (typeof imageEntry === 'string') {
        imagePath = imageEntry;
    }

    const isActive = formData.get('isActive') === 'on';
    const isUrgent = formData.get('isUrgent') === 'on';

    // Temporary: Get first user as author
    const user = await prisma.user.findFirst();
    if (!user) throw new Error('No user found');

    await prisma.news.create({
        data: {
            title,
            content,
            image: imagePath,
            isActive,
            isUrgent,
            authorId: user.id,
        },
    });

    revalidatePath('/admin/news');
    redirect({ href: '/admin/news?success=created', locale: 'ar' });
}

export async function updateNews(id: string, formData: FormData) {
    const title = formData.get('title') as string;
    const content = formData.get('content') as string;

    const imageEntry = formData.get('image');
    let imagePath = undefined; // Undefined means don't update if no new file/string

    // If a new file is uploaded
    if (imageEntry instanceof File && imageEntry.size > 0) {
        const uploaded = await uploadFile(imageEntry, 'news');
        if (uploaded) imagePath = uploaded;
    } else if (typeof imageEntry === 'string' && imageEntry.trim() !== '') {
        // If it's a string, update it (e.g. if we support URL inputs or hidden input with current path)
        imagePath = imageEntry;
    }

    const isActive = formData.get('isActive') === 'on';
    const isUrgent = formData.get('isUrgent') === 'on';

    const updateData: Record<string, string | boolean | undefined> = {
        title,
        content,
        isActive,
        isUrgent,
    };
    if (imagePath) updateData.image = imagePath;

    await prisma.news.update({
        where: { id },
        data: updateData,
    });

    revalidatePath('/admin/news');
    redirect({ href: '/admin/news?success=updated', locale: 'ar' });
}

export async function deleteNews(id: string) {
    await prisma.news.delete({
        where: { id },
    });
    revalidatePath('/admin/news');
    // For delete, usually handled client side or just revalidate. 
    // If called from form action on list page, redirect isn't strictly necessary if it just reloads.
    // But if we want toast, we might need a redirect to self with param, or handle it differently.
    // The current delete button implementation in list page just invokes server action.
    // Next.js server actions form submissions will refresh the page.
    // To show toast on delete, we'd ideally return state or redirect.
    // I'll leave delete as is or add redirect to self? 
    // Redirect to self with param works.
    redirect({ href: '/admin/news?success=deleted', locale: 'ar' });
}
