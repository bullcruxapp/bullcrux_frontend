'use client'

import { usePathname } from 'next/navigation';
import NavbarWrapper from './NavbarWrapper';
import DesktopLayout from './DesktopLayout/DesktopLayout';

/** Rutas que se muestran a pantalla completa, sin sidebar ni navbar. */
const FULLSCREEN_ROUTES = ['/login', '/register', '/vender'];

const AppShell = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isFullscreen = FULLSCREEN_ROUTES.some(
        route => pathname === route || pathname?.startsWith(`${route}/`)
    );

    if (isFullscreen) {
        return <>{children}</>;
    }

    return (
        <>
            {/* Desktop layout (>= 1024px) */}
            <DesktopLayout>
                {children}
            </DesktopLayout>

            {/* Mobile layout (< 1024px) */}
            <div className="mobile-only-wrapper">
                <div className="app-container">
                    {children}
                    <NavbarWrapper />
                </div>
            </div>
        </>
    );
};

export default AppShell;
