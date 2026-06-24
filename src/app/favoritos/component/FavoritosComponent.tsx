'use client'

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import searchIcon from '@/images/icons/search-icon.svg';
import './favoritos-component.css';
import RaffleCardComponent from '@/components/RaffleCard/RaffleCardComponent';

interface Ticket {
    id: string;
    number: number;
    raffleId: string;
    purchasedAt: string;
    raffle: {
        id: string;
        productName: string;
        ticketPriceCoins: number;
        totalTickets: number;
        ticketsSold: number;
        status: string;
        productImages: { url: string }[];
        productImage?: string;
    };
}

interface FavoritosComponentProps {
    tickets: Ticket[];
}

const FavoritosComponent = ({ tickets }: FavoritosComponentProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'favoritos' | 'mis-sorteos'>('favoritos');
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

    const handleSignOut = async () => {
        await signOut({ redirect: false, callbackUrl: '/login' });
        router.push('/login');
    };

    const getImageUrl = (ticket: Ticket) => {
        if (ticket.raffle.productImages && ticket.raffle.productImages.length > 0) {
            return ticket.raffle.productImages[0].url;
        }
        return ticket.raffle.productImage || '';
    };

    const getProgress = (ticket: Ticket) => {
        if (ticket.raffle.totalTickets === 0) return 0;
        return Math.round((ticket.raffle.ticketsSold / ticket.raffle.totalTickets) * 100);
    };

    const uniqueRaffles = tickets.reduce((acc: Ticket[], ticket) => {
        if (!acc.find(t => t.raffleId === ticket.raffleId)) {
            acc.push(ticket);
        }
        return acc;
    }, []);

    return (
        <div className="favoritos-container">
            <div className="header flex justify-between items-center">
                <div className="user-profile-container" ref={dropdownRef}>
                    <div className="user-profile" onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
                        {userImage ? (
                            <Image src={userImage} alt="User profile" width={40} height={40} className="profile-image" />
                        ) : (
                            <div className="profile-image-placeholder">{userName.charAt(0).toUpperCase()}</div>
                        )}
                        <span className="user-name">{userName}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`}>
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

            <div className="tabs-container">
                <button className={`tab-item ${activeTab === 'favoritos' ? 'active' : ''}`} onClick={() => setActiveTab('favoritos')}>
                    Favoritos
                </button>
                <button className={`tab-item ${activeTab === 'mis-sorteos' ? 'active' : ''}`} onClick={() => setActiveTab('mis-sorteos')}>
                    Mis Participaciones
                </button>
            </div>

            <div className="favoritos-content">
                {activeTab === 'favoritos' ? (
                    <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                        No tenés favoritos todavía.
                    </p>
                ) : (
                    <div className="raffle-cards-container">
                        {uniqueRaffles.length === 0 ? (
                            <p style={{ color: 'var(--color-text-secondary)', textAlign: 'center', marginTop: '2rem' }}>
                                No tenés participaciones todavía.
                            </p>
                        ) : (
                            <div className="raffle-cards-grid">
                                {uniqueRaffles.map((ticket) => (
                                    <RaffleCardComponent
                                        key={ticket.id}
                                        image={getImageUrl(ticket)}
                                        isFavorite={false}
                                        progress={getProgress(ticket)}
                                        available={`${ticket.raffle.totalTickets - ticket.raffle.ticketsSold} disponibles`}
                                        progressText={`${ticket.raffle.ticketsSold}/${ticket.raffle.totalTickets}`}
                                        title={ticket.raffle.productName}
                                        price={`C$ ${ticket.raffle.ticketPriceCoins}`}
                                        productId={ticket.raffle.id}
                                        isMyRafflesView={true}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default FavoritosComponent;
