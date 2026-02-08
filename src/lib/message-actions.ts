'use server';

import { prisma } from './prisma';
import { revalidatePath } from 'next/cache';

export async function deleteMessage(id: string) {
    await prisma.contactSubmission.delete({
        where: { id },
    });
    revalidatePath('/admin/messages');
}

export async function markMessageAsRead(id: string) {
    await prisma.contactSubmission.update({
        where: { id },
        data: { isRead: true },
    });
    revalidatePath('/admin/messages');
}
