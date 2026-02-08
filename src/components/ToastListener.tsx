'use client';

import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import { useEffect, Suspense } from 'react';
import { toast } from 'sonner';

function ToastListenerContent() {
    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();

    useEffect(() => {
        const success = searchParams.get('success');
        const error = searchParams.get('error');

        if (success) {
            let message = 'تمت العملية بنجاح';
            if (success === 'created') message = 'تم إنشاء العنصر بنجاح';
            if (success === 'updated') message = 'تم تحديث البيانات بنجاح';
            if (success === 'deleted') message = 'تم حذف العنصر بنجاح';

            toast.success(message, {
                position: 'bottom-left',
                className: 'font-ibm-plex text-right',
            });

            // Clean up URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete('success');
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }

        if (error) {
            toast.error('حدث خطأ ما', {
                description: 'يرجى المحاولة مرة أخرى',
                position: 'bottom-left',
                className: 'font-ibm-plex text-right',
            });
            // Clean up URL
            const params = new URLSearchParams(searchParams.toString());
            params.delete('error');
            router.replace(`${pathname}?${params.toString()}`, { scroll: false });
        }
    }, [searchParams, pathname, router]);

    return null;
}

export default function ToastListener() {
    return (
        <Suspense fallback={null}>
            <ToastListenerContent />
        </Suspense>
    );
}
