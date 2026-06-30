'use client'

import { useSession } from 'next-auth/react';
import { useRouter, usePathname } from 'next/navigation';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import bullcruxIcon from '@/images/icons/bullcrux-icon.svg';
import './desktop-layout.css';

interface DesktopLayoutProps {
    children: React.ReactNode;
}

const SF_PRO = '-apple-system, "SF Pro", "SF Pro Display", BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

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
        { id: 'home', label: 'Home', path: '/', icon: '🏠' },
        { id: 'favoritos', label: 'Favoritos', path: '/favoritos', icon: '❤️' },
        { id: 'cartera', label: 'Cartera', path: '/cartera', icon: '💳' },
        { id: 'perfil', label: 'Perfil', path: '/perfil', icon: '👤' },
    ];

    if (isAdmin) {
        menuItems.push({ id: 'admin', label: 'Admin', path: '/admin', icon: '⚙️' });
    }

    return (
        <div className="desktop-layout" style={{ fontFamily: SF_PRO }}>
            {/* Sidebar */}
            <aside className="desktop-sidebar">
                <div className="desktop-sidebar-logo" onClick={() => router.push('/')}>
                    <Image src={bullcruxIcon} alt="BullCrux" width={36} height={36} />
                </div>

                <nav className="desktop-sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`desktop-nav-item ${pathname === item.path ? 'active' : ''}`}
                            onClick={() => router.push(item.path)}
                        >
                            <span className="desktop-nav-icon">{item.icon}</span>
                            <span className="desktop-nav-label">{item.label}</span>
                        </button>
                    ))}
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
