'use client'

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import searchIcon from '../../../images/icons/search-icon.svg';
import rendimientoIcon from '../../../images/icons/rendimiento.png';
import './cartera-component.css';

const CarteraComponent = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const userName = session?.user?.name || session?.user?.email || 'Usuario';
    const userImage = session?.user?.image || null;

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };
        if (isDropdownOpen) document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, [isDropdownOpen]);

    const handleToggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

    const handleSignOut = async () => {
        await signOut({ redirect: false, callbackUrl: '/login' });
        router.push('/login');
    };

    return (
        <div className="cartera-container cartera-component">
            <div className="cartera-header flex justify-between items-center">
                <div className="user-profile-container" ref={dropdownRef}>
                    <div className="user-profile" onClick={handleToggleDropdown}>
                        {userImage ? (
                            <Image src={userImage} alt="User profile" width={40} height={40} className="profile-image" />
                        ) : (
                            <div className="profile-image-placeholder">{userName.charAt(0).toUpperCase()}</div>
                        )}
                        <span className="user-name">{userName}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`}>
                            <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {isDropdownOpen && (
                        <div className="user-dropdown">
                            <button className="dropdown-item" onClick={handleSignOut}>Cerrar sesión</button>
                        </div>
                    )}
                </div>
                <div className="search-input">
                    <Image src={searchIcon} alt="Search icon" width={18} height={18} />
                </div>
            </div>

            <div className="saldo-card">
                <div className="saldo-card-inner">
                    <div className="saldo-row">
                        <span className="saldo-amount">C$ 1.565.900,00</span>
                    </div>
                    <span className="saldo-label">Saldo actual</span>
                    <div className="saldo-separator" />
                    <button type="button" className="saldo-btn-comprar">Comprar $COINs</button>
                </div>
            </div>

            <h2 className="movimientos-title">Movimientos</h2>
            <div className="movimientos-list">
                <div className="movimiento-item movimiento-recarga">
                    <div className="movimiento-icon-wrap">
                        <Image src={rendimientoIcon} alt="Rendimiento" width={40} height={40} className="movimiento-icon" />
                    </div>
                    <div className="movimiento-info">
                        <span className="movimiento-tipo">Rendimiento</span>
                        <span className="movimiento-desc">sorteo x</span>
                    </div>
                    <div className="movimiento-monto-fecha">
                        <span className="movimiento-monto recarga">+ $978.56</span>
                        <span className="movimiento-fecha">15 de Abril</span>
                    </div>
                    <div className="movimiento-bar recarga" />
                </div>
                <div className="movimiento-item movimiento-gasto">
                    <div className="movimiento-icon-wrap">
                        <Image src={rendimientoIcon} alt="Rendimiento" width={40} height={40} className="movimiento-icon" />
                    </div>
                    <div className="movimiento-info">
                        <span className="movimiento-tipo">Rendimiento</span>
                        <span className="movimiento-desc">sorteo x</span>
                    </div>
                    <div className="movimiento-monto-fecha">
                        <span className="movimiento-monto gasto">- $250.00</span>
                        <span className="movimiento-fecha">12 de Abril</span>
                    </div>
                    <div className="movimiento-bar gasto" />
                </div>
            </div>
        </div>
    );
};

export default CarteraComponent;
