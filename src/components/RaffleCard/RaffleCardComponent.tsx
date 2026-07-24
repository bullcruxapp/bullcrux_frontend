'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import heartIcon from '@/images/icons/heart-icon.svg';
import heartSelectedIcon from '@/images/icons/heart-selected-icon.svg';
import clockIcon from '@/images/icons/clock-icon.svg';
import fireIcon from '@/images/icons/fire-icon.svg';
import exclamationIcon from '@/images/icons/exclamation-icon.svg';
import limitedIcon from '@/images/icons/limited-icon.svg';
import checkIcon from '@/images/icons/check-icon.svg';
import ticketIcon from '@/images/icons/ticket-icon.svg';
import ticketArrowIcon from '@/images/icons/ticket-arrow.svg';
import './raffle-card.css';
import FreeTicketButton from '../FreeTicketButton/FreeTicketButton';

export type BadgeType = 'last-day' | 'selling-fast' | 'ends-soon' | 'limited-stock' | 'activo';

interface RaffleCardComponentProps {
    image: string | any;
    badge?: BadgeType;
    isFavorite?: boolean;
    onFavoriteClick?: () => void;
    progress: number;
    available: string;
    progressText: string;
    title: string;
    description?: string;
    price: string;
    onFreeTicketClick?: () => void;
    productId?: string;
    onClick?: () => void;
    isMyRafflesView?: boolean;
    winner?: { name: string } | null;
    countdownStartedAt?: string | null;
    ticketsRemaining?: number | null;
}

const COUNTDOWN_HOURS = 10;

const formatCountdown = (msRemaining: number): string => {
    if (msRemaining <= 0) return 'Finalizando...';
    const hours = Math.floor(msRemaining / (1000 * 60 * 60));
    const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((msRemaining % (1000 * 60)) / 1000);
    return `${hours}h ${minutes}m ${seconds}s`;
};

const RaffleCardComponent = (props: RaffleCardComponentProps) => {
    const {
        image, badge, isFavorite = false, onFavoriteClick, progress, available, progressText,
        title, description, price, onFreeTicketClick, productId, onClick,
        isMyRafflesView = false, winner, countdownStartedAt, ticketsRemaining
    } = props;

    const router = useRouter();
    const [favorite, setFavorite] = useState(isFavorite);
    const [now, setNow] = useState(Date.now());

    useEffect(() => { setFavorite(isFavorite); }, [isFavorite]);

    useEffect(() => {
        if (!countdownStartedAt) return;
        const interval = setInterval(() => setNow(Date.now()), 1000);
        return () => clearInterval(interval);
    }, [countdownStartedAt]);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setFavorite(!favorite);
        onFavoriteClick?.();
    };

    const handleCardClick = () => {
        if (onClick) onClick();
        else if (productId) router.push(`/productDetail/${productId}`);
    };

    const handleFreeTicketClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        onFreeTicketClick?.();
    };

    const handleDetailsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (productId) router.push(`/productDetail/${productId}`);
    };

    const getBadgeConfig = () => {
        if (isMyRafflesView) return { text: 'ACTIVO', icon: null };
        switch (badge) {
            case 'last-day': return { text: 'LAST DAY', icon: clockIcon };
            case 'selling-fast': return { text: 'SELLING FAST', icon: fireIcon };
            case 'ends-soon': return { text: 'ENDS SOON', icon: exclamationIcon };
            case 'limited-stock': return { text: 'LIMITED STOCK', icon: limitedIcon };
            case 'activo': return { text: 'ACTIVO', icon: checkIcon };
            default: return null;
        }
    };

    const badgeConfig = getBadgeConfig();

    let countdownMs = 0;
    if (countdownStartedAt) {
        const endsAt = new Date(countdownStartedAt).getTime() + COUNTDOWN_HOURS * 60 * 60 * 1000;
        countdownMs = endsAt - now;
    }
    const showCountdown = !winner && countdownStartedAt && countdownMs > 0;
    const showTicketsRemaining = !winner && !countdownStartedAt && ticketsRemaining && ticketsRemaining > 0;

    return (
        <div className={`raffle-card ${isMyRafflesView ? 'raffle-card-my-raffles' : ''}`} onClick={isMyRafflesView ? undefined : handleCardClick} style={{ cursor: (onClick || productId) && !isMyRafflesView ? 'pointer' : 'default' }}>
            <div className="raffle-card-image-container">
                <Image src={image} alt={title} width={176} height={120} style={{ objectFit: 'cover', borderRadius: '16px 16px 0 0' }} />
                <button className="raffle-card-favorite" onClick={handleFavoriteClick}>
                    <Image src={favorite ? heartSelectedIcon : heartIcon} alt="Favorite" />
                </button>

                {winner && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(135deg, #FFD700, #FFA500)', padding: '6px 10px', display: 'flex', alignItems: 'center', gap: '6px', borderRadius: '16px 16px 0 0', zIndex: 5 }}>
                        <span style={{ fontSize: '14px' }}>🏆</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>Ganador: {winner.name}</span>
                    </div>
                )}

                {showCountdown && (
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, background: 'linear-gradient(135deg, #FF6B35, #FF3D00)', padding: '6px 10px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', borderRadius: '16px 16px 0 0', zIndex: 5 }}>
                        <span style={{ fontSize: '12px' }}>⏱️</span>
                        <span style={{ fontSize: '11px', fontWeight: '700', color: '#fff' }}>Sorteo en {formatCountdown(countdownMs)}</span>
                    </div>
                )}

                {badgeConfig && !winner && !showCountdown && (
                    <div className="raffle-card-badge">
                        {badgeConfig.icon && <Image src={badgeConfig.icon} alt={badgeConfig.text} width={11} height={11} />}
                        <span>{badgeConfig.text}</span>
                    </div>
                )}
            </div>

            <div className="raffle-card-content">
                <div className="raffle-card-progress-section">
                    <div className="raffle-card-progress-bar">
                        <div className="raffle-card-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="raffle-card-progress-info">
                        <span className="raffle-card-available">{available}</span>
                        <span className="raffle-card-progress-text">{progressText}</span>
                    </div>
                </div>

                {showTicketsRemaining && (
                    <p style={{ fontSize: '11px', color: '#FFA500', margin: '4px 0 0', fontWeight: 600 }}>
                        Faltan {ticketsRemaining} tickets para activar el sorteo
                    </p>
                )}

                <h3 className="raffle-card-title">{title}</h3>
                {isMyRafflesView ? (
                    <div className="raffle-card-price-description">
                        <Image src={ticketArrowIcon} alt="Ticket arrow" width={20} height={16} />
                        <span>{price}</span>
                    </div>
                ) : (description && <p className="raffle-card-description">{description}</p>)}

                <div className="raffle-card-footer">
                    {isMyRafflesView ? (
                        <button className="raffle-card-details-button" onClick={handleDetailsClick}>Detalles</button>
                    ) : (
                        <>
                            <div className="raffle-card-price">
                                <Image src={ticketIcon} alt="Ticket" width={17} height={13} className="raffle-card-ticket-icon" />
                                <span>{price}</span>
                            </div>
                            <div onClick={handleFreeTicketClick}>
                                <FreeTicketButton onClick={() => onFreeTicketClick?.()} />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default RaffleCardComponent;
