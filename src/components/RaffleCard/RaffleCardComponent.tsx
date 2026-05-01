'use client'

import { useState } from 'react';
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
import { RaffleImage } from '@/models/raffleImage.model';

export type BadgeType = 'last-day' | 'selling-fast' | 'ends-soon' | 'limited-stock' | 'activo';

interface RaffleCardComponentProps {
    image: RaffleImage[]
    badge?: BadgeType;
    isFavorite?: boolean;
    onFavoriteClick?: () => void;
    progress: number; // 0-100
    available: string;
    progressText: string;
    title: string;
    description?: string;
    price: string;
    onFreeTicketClick?: () => void;
    productId?: string;
    onClick?: () => void;
    isMyRafflesView?: boolean;
}

const RaffleCardComponent = (props: RaffleCardComponentProps) => {
    const {
        image,
        badge,
        isFavorite = false,
        onFavoriteClick,
        progress,
        available,
        progressText,
        title,
        description,
        price,
        onFreeTicketClick,
        productId,
        onClick,
        isMyRafflesView = false
    } = props;

    const router = useRouter();
    const [favorite, setFavorite] = useState(isFavorite);

    const handleFavoriteClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que se active el onClick del card
        setFavorite(!favorite);
        onFavoriteClick?.();
    };

    const handleCardClick = () => {
        if (onClick) {
            onClick();
        } else if (productId) {
            router.push(`/productDetail/${productId}`);
        }
    };

    const handleFreeTicketClick = (e: React.MouseEvent) => {
        e.stopPropagation(); // Evita que se active el onClick del card
        onFreeTicketClick?.();
    };

    const handleDetailsClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        if (productId) {
            router.push(`/productDetail/${productId}`);
        }
    };

    const getBadgeConfig = () => {
        if (isMyRafflesView) {
            return { text: 'ACTIVO', icon: null }; // Badge "ACTIVO" sin ícono en vista de "Mis Sorteos"
        }
        switch (badge) {
            case 'last-day':
                return { text: 'LAST DAY', icon: clockIcon };
            case 'selling-fast':
                return { text: 'SELLING FAST', icon: fireIcon };
            case 'ends-soon':
                return { text: 'ENDS SOON', icon: exclamationIcon };
            case 'limited-stock':
                return { text: 'LIMITED STOCK', icon: limitedIcon };
            case 'activo':
                return { text: 'ACTIVO', icon: checkIcon };
            default:
                return null;
        }
    };

    const badgeConfig = getBadgeConfig();

    return (
        <div className={`raffle-card ${isMyRafflesView ? 'raffle-card-my-raffles' : ''}`} onClick={isMyRafflesView ? undefined : handleCardClick} style={{ cursor: (onClick || productId) && !isMyRafflesView ? 'pointer' : 'default' }}>
            <div className="raffle-card-image-container">
                <Image
                    src={image[0].url}
                    alt={title}
                    width={176}
                    height={120}
                    style={{ objectFit: 'cover', borderRadius: '16px 16px 0 0' }}
                />
                <button
                    className="raffle-card-favorite"
                    onClick={handleFavoriteClick}
                >
                    <Image
                        src={favorite ? heartSelectedIcon : heartIcon}
                        alt="Favorite"
                    />
                </button>
                {badgeConfig && (
                    <div className="raffle-card-badge">
                        {badgeConfig.icon && (
                            <Image
                                src={badgeConfig.icon}
                                alt={badgeConfig.text}
                                width={11}
                                height={11}
                            />
                        )}
                        <span>{badgeConfig.text}</span>
                    </div>
                )}
            </div>
            <div className="raffle-card-content">
                <div className="raffle-card-progress-section">
                    <div className="raffle-card-progress-bar">
                        <div
                            className="raffle-card-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="raffle-card-progress-info">
                        <span className="raffle-card-available">{available}</span>
                        <span className="raffle-card-progress-text">{progressText}</span>
                    </div>
                </div>
                <h3 className="raffle-card-title">{title}</h3>
                {isMyRafflesView ? (
                    <div className="raffle-card-price-description">
                        <Image
                            src={ticketArrowIcon}
                            alt="Ticket arrow"
                            width={20}
                            height={16}
                        />
                        <span>{price}</span>
                    </div>
                ) : (
                    description && (
                        <p className="raffle-card-description">{description}</p>
                    )
                )}
                <div className="raffle-card-footer">
                    {isMyRafflesView ? (
                        <button className="raffle-card-details-button" onClick={handleDetailsClick}>
                            Detalles
                        </button>
                    ) : (
                        <>
                            <div className="raffle-card-price">
                                <Image
                                    src={ticketIcon || '../images/teclado.png'}
                                    alt="Ticket"
                                    width={17}
                                    height={13}
                                    className="raffle-card-ticket-icon"
                                />
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

