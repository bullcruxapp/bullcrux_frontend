'use client'

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import homeIcon from '../images/icons/home-icon.svg';
import heartIcon from '../images/icons/heart-icon.svg';
import heartSelectedIcon from '../images/icons/heart-selected-icon.svg';
import walletIcon from '../images/icons/shape-icon.svg';
import profileIcon from '../images/icons/profile-icon.svg';
import './navbar.css';

interface NavItem {
    label: string;
    path: string;
    icon: any;
    selectedIcon?: any;
}

const NavbarComponent = () => {
    const pathname = usePathname();

    const navItems: NavItem[] = [
        {
            label: 'Home',
            path: '/homepage',
            icon: homeIcon,
        },
        {
            label: 'Favoritos',
            path: '/favoritos',
            icon: heartIcon,
            selectedIcon: heartSelectedIcon,
        },
        {
            label: 'Cartera',
            path: '/cartera',
            icon: walletIcon,
        },
        {
            label: 'Perfil',
            path: '/perfil',
            icon: profileIcon,
        },
    ];

    const isActive = (path: string) => {
        return pathname === path || pathname?.startsWith(path + '/');
    };

    return (
        <nav className="navbar">
            {navItems.map((item) => {
                const active = isActive(item.path);
                const iconToShow = active && item.selectedIcon ? item.selectedIcon : item.icon;

                return (
                    <Link key={item.path} href={item.path} className="nav-item">
                        <div className="nav-icon-wrapper">
                            <Image
                                src={iconToShow}
                                alt={item.label}
                                width={24}
                                height={24}
                                className={active ? 'nav-icon active' : 'nav-icon'}
                            />
                        </div>
                        <span className={`nav-text ${active ? 'active' : ''}`}>
                            {item.label}
                        </span>
                    </Link>
                );
            })}
        </nav>
    );
};

export default NavbarComponent;

