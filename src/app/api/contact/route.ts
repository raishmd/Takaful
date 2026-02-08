import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const contactSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional(),
    subject: z.string().min(3),
    message: z.string().min(10),
});

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const result = contactSchema.safeParse(body);

        if (!result.success) {
            return NextResponse.json(
                { error: 'Invalid input', details: result.error.flatten() },
                { status: 400 }
            );
        }

        const { name, email, phone, subject, message } = result.data;

        const submission = await prisma.contactSubmission.create({
            data: {
                name,
                email,
                phone: phone || null,
                subject,
                message,
            },
        });

        return NextResponse.json({ success: true, id: submission.id });
    } catch (error) {
        console.error('Contact submission error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
