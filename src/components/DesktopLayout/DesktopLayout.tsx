'use client'

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import bullcruxLogo from '@/images/icons/bullcrux-logo.svg';
import NotificationComponent from '@/app/(home)/component/NotificationComponent';
import './desktop-layout.css';

interface DesktopLayoutProps {
    children: React.ReactNode;
}

const SF_PRO = '-apple-system, "SF Pro", "SF Pro Display", BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

/* ---------- Iconos de línea (sin dependencias externas) ---------- */
const IconHome = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path d="M3 11L12 3L21 11" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 9.5V20a1 1 0 0 0 1 1h4v-6h4v6h4a1 1 0 0 0 1-1V9.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconHeart = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <path d="M12 20.5s-7.5-4.6-10-9.3C.5 7.8 2.3 4.5 5.6 4c2-.3 3.9.6 5 2.2a5.7 5.7 0 0 1 5-2.2c3.3.5 5.1 3.8 3.6 7.2-2.5 4.7-10 9.3-10 9.3z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const IconWallet = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <rect x="2" y="6" width="20" height="14" rx="2.5" stroke="currentColor" strokeWidth="2" />
        <path d="M2 10h20" stroke="currentColor" strokeWidth="2" />
        <path d="M16 15h3" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const IconUser = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="2" />
        <path d="M4 20.5c1.6-3.6 4.7-5.5 8-5.5s6.4 1.9 8 5.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
);

const IconSettings = () => (
    <svg width="19" height="19" viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2" />
        <path d="M19.4 13.5a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1h-.2a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1.1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3h.1a1.7 1.7 0 0 0 1-1.6v-.2a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6h.1a1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9v.1a1.7 1.7 0 0 0 1.6 1h.2a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

const ICONS: Record<string, () => JSX.Element> = {
    home: IconHome,
    favoritos: IconHeart,
    cartera: IconWallet,
    perfil: IconUser,
    admin: IconSettings,
};

const DesktopLayout = ({ children }: DesktopLayoutProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const pathname = usePathname();
    const [balance, setBalance] = useState<number>(0);

    useEffect(() => {
        const fetchBalance = async () => {
            if (!session) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/me`, {
                    headers: { 'Authorization': `Bearer ${(session as any).accessToken}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setBalance(data.balanceCoins || 0);
                }
            } catch (e) { console.error(e); }
        };
        fetchBalance();
    }, [session]);

    const isAdmin = (session as any)?.isAdmin;

    const menuItems = [
        { id: 'home', label: 'Home', path: '/' },
        { id: 'favoritos', label: 'Favoritos', path: '/favoritos' },
        { id: 'cartera', label: 'Cartera', path: '/cartera' },
        { id: 'perfil', label: 'Perfil', path: '/perfil' },
    ];

    if (isAdmin) {
        menuItems.push({ id: 'admin', label: 'Admin', path: '/admin' });
    }

    return (
        <div className="desktop-layout" style={{ fontFamily: SF_PRO }}>
            {/* Sidebar */}
            <aside className="desktop-sidebar">
                <div className="desktop-sidebar-logo" onClick={() => router.push('/')}>
                    <Image src={bullcruxLogo} alt="BullCrux" width={104} height={30} />
                </div>

                <nav className="desktop-sidebar-nav">
                    {menuItems.map(item => {
                        const Icon = ICONS[item.id];
                        return (
                            <button
                                key={item.id}
                                className={`desktop-nav-item ${pathname === item.path ? 'active' : ''}`}
                                onClick={() => router.push(item.path)}
                            >
                                <span className="desktop-nav-icon"><Icon /></span>
                                <span className="desktop-nav-label">{item.label}</span>
                            </button>
                        );
                    })}
                </nav>

                <button
                    className="desktop-recharge-btn"
                    onClick={() => router.push('/cartera')}
                >
                    + Comprar $COINS
                </button>
            </aside>

            {/* Main area */}
            <div className="desktop-main">
                {/* Header */}
                <header className="desktop-header">
                    <div className="desktop-search">
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                            <path d="M21 21L16.65 16.65M19 11C19 15.4183 15.4183 19 11 19C6.58172 19 3 15.4183 3 11C3 6.58172 6.58172 3 11 3C15.4183 3 19 6.58172 19 11Z" stroke="#666" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input type="text" placeholder="Buscar sorteos..." />
                    </div>

                    <div className="desktop-header-center">
                        <NotificationComponent />
                    </div>

                    <div className="desktop-header-right">
                        {session ? (
                            <>
                                <div className="desktop-balance">
                                    <span className="desktop-balance-label">Balance</span>
                                    <span className="desktop-balance-value">C$ {balance.toLocaleString()}</span>
                                </div>
                                <button
                                    className="desktop-avatar"
                                    onClick={() => router.push('/perfil')}
                                >
                                    {session.user?.image ? (
                                        <img src={session.user.image} alt="avatar" />
                                    ) : (
                                        <span>{session.user?.name?.charAt(0) || 'U'}</span>
                                    )}
                                </button>
                            </>
                        ) : (
                            <button
                                className="desktop-login-btn"
                                onClick={() => router.push('/login')}
                            >
                                Iniciar sesión
                            </button>
                        )}
                    </div>
                </header>

                {/* Content */}
                <main className="desktop-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default DesktopLayout;
