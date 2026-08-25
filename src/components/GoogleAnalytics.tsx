'use client'

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, Suspense } from 'react';

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;

declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        dataLayer: any[];
    }
}

/**
 * Dispara un page_view cada vez que cambia la ruta.
 * Necesario porque en el App Router las navegaciones internas
 * no recargan la página, y gtag.js por defecto solo mide la carga inicial.
 */
const GAPageViewTracker = () => {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        if (!GA_MEASUREMENT_ID || typeof window.gtag !== 'function') return;

        const url = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');
        window.gtag('config', GA_MEASUREMENT_ID, { page_path: url });
    }, [pathname, searchParams]);

    return null;
};

const GoogleAnalytics = () => {
    if (!GA_MEASUREMENT_ID) return null;

    return (
        <>
            <Script
                src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
                strategy="afterInteractive"
            />
            <Script id="ga-init" strategy="afterInteractive">
                {`
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){dataLayer.push(arguments);}
                    gtag('js', new Date());
                    gtag('config', '${GA_MEASUREMENT_ID}');
                `}
            </Script>
            <Suspense fallback={null}>
                <GAPageViewTracker />
            </Suspense>
        </>
    );
};

export default GoogleAnalytics;
