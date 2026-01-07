'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import heartIcon from '../images/icons/heart-icon.svg';
import heartSelectedIcon from '../images/icons/heart-selected-icon.svg';
import clockIcon from '../images/icons/clock-icon.svg';
import fireIcon from '../images/icons/fire-icon.svg';
import exclamationIcon from '../images/icons/exclamation-icon.svg';
import limitedIcon from '../images/icons/limited-icon.svg';
import ticketIcon from '../images/icons/ticket-icon.svg';
import FreeTicketButton from './FreeTicketButton';
import './raffle-card.css';

export type BadgeType = 'last-day' | 'selling-fast' | 'ends-soon' | 'limited-stock';

interface RaffleCardComponentProps {
    image: string | any;
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
        onClick
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

    const getBadgeConfig = () => {
        switch (badge) {
            case 'last-day':
                return { text: 'LAST DAY', icon: clockIcon };
            case 'selling-fast':
                return { text: 'SELLING FAST', icon: fireIcon };
            case 'ends-soon':
                return { text: 'ENDS SOON', icon: exclamationIcon };
            case 'limited-stock':
                return { text: 'LIMITED STOCK', icon: limitedIcon };
            default:
                return null;
        }
    };

    const badgeConfig = getBadgeConfig();

    return (
        <div className="raffle-card" onClick={handleCardClick} style={{ cursor: (onClick || productId) ? 'pointer' : 'default' }}>
            <div className="raffle-card-image-container">
                <Image
                    src={image}
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
                        <Image
                            src={badgeConfig.icon}
                            alt={badgeConfig.text}
                            width={11}
                            height={11}
                        />
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
                {description && (
                    <p className="raffle-card-description">{description}</p>
                )}
                <div className="raffle-card-footer">
                    <div className="raffle-card-price">
                        <Image
                            src={ticketIcon}
                            alt="Ticket"
                            width={17}
                            height={13}
                            className="raffle-card-ticket-icon"
                        />
                        <span>{price}</span>
                    </div>
                    <div onClick={handleFreeTicketClick}>
                        <FreeTicketButton onClick={handleFreeTicketClick} />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RaffleCardComponent;

