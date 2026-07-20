'use client'

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import searchIcon from '@/images/icons/search-icon.svg';
import rendimientoIcon from '@/images/icons/rendimiento.png';
import './cartera-component.css';
import { TransactionType } from '@/models/enums/TransactionType';

interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    createdAt: string;
    status: string;
}

interface CarteraComponentProps {
    balance: number;
    transactions: Transaction[];
}

const CarteraComponent = (props: CarteraComponentProps) => {

    const { data: session } = useSession();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const { balance, transactions } = props;

    console.log(balance, 'balance');
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

    const formateDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' });
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
            </div>

            <div className="saldo-card">
                <div className="saldo-card-inner">
                    <div className="saldo-row">
                        <span className="saldo-amount">C$ {balance.toLocaleString('es-ES')} </span>
                    </div>
                    <span className="saldo-label">Saldo actual</span>
                    <div className="saldo-separator" />
                    <button type="button" className="saldo-btn-comprar" onClick={() => router.push('/cartera/comprar-coins')}>
                        Comprar $COINs
                    </button>
                </div>
            </div>

            <h2 className="movimientos-title">Movimientos</h2>
            <div className="movimientos-list">
                {transactions.length === 0 ? (
                    <p className="no-movimientos">No hay movimientos recientes.</p>
                ) : (
                    transactions.map((tx) => (
                        <div className={`movimiento-item ${(tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WIN) ? 'movimiento-recarga' : 'movimiento-gasto'}`} key={tx.id}>
                            <div className="movimiento-icon-wrap">
                                <Image src={rendimientoIcon} alt="Rendimiento" width={40} height={40} className="movimiento-icon" />
                            </div>
                            <div className="movimiento-info">
                                <span className="movimiento-tipo">{tx.type}</span>
                                <span className="movimiento-desc" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', maxWidth: '100%' }}>{tx.description?.replace(/participación\(es\)/g, '$COINS')}</span>
                            </div>
                            <div className="movimiento-monto-fecha">
                                <span className={`movimiento-monto ${tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WIN ? 'recarga' : 'gasto'}`}>{(tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WIN) ? '+' : '-'} ${tx.amount.toLocaleString('es-ES')}</span>
                                <span className="movimiento-fecha">{formateDate(tx.createdAt)}</span>
                            </div>
                            <div className={`movimiento-bar ${tx.type === TransactionType.DEPOSIT || tx.type === TransactionType.WIN ? 'recarga' : 'gasto'}`} />
                        </div>
                    ))
                )
                }

            </div>
        </div>
    );
};

export default CarteraComponent;
