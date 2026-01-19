'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FreeTicketButton from './FreeTicketButton';
import bellIcon from '../images/icons/icon-bell.svg';
import './raffle-large.css';

interface RaffleLargeComponentProps {
    image: string | any;
    title: string;
    progress: number; // 0-100
    price: string;
    onFreeTicketClick?: () => void;
    productId?: string;
    onClick?: () => void;
    isFavoritesView?: boolean; // Nueva prop para vista de favoritos
    available?: string; // Texto de disponibles para vista de favoritos
    progressText?: string; // Texto de progreso (ej: "23/127") para vista de favoritos
}

const RaffleLargeComponent = (props: RaffleLargeComponentProps) => {
    const { image, title, progress, price, onFreeTicketClick, productId, onClick, isFavoritesView = false, available, progressText } = props;
    const router = useRouter();

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
        e.stopPropagation(); // Evita que se active el onClick del card
        if (productId) {
            router.push(`/productDetail/${productId}`);
        }
    };

    return (
        <div
            className={`raffle-large ${isFavoritesView ? 'raffle-large-favorites' : ''}`}
            onClick={isFavoritesView ? undefined : handleCardClick}
            style={{ cursor: (onClick || productId) && !isFavoritesView ? 'pointer' : 'default' }}
        >
            <div className={`raffle-large-image ${isFavoritesView ? 'raffle-large-image-favorites' : ''}`}>
                <Image
                    src={image}
                    alt={title}
                    width={185}
                    height={isFavoritesView ? 164 : 122}
                    style={{ objectFit: 'cover', borderRadius: '16px 0 0 16px' }}
                />
            </div>
            <div className={`raffle-large-content ${isFavoritesView ? 'raffle-large-content-favorites' : ''}`}>
                {isFavoritesView && (
                    <>
                        <div className="raffle-large-header-favorites">
                            <button className="raffle-large-bell-button" onClick={(e) => e.stopPropagation()}>
                                <Image src={bellIcon} alt="Notifications" width={18} height={18} />
                            </button>
                        </div>
                        <h3 className={`raffle-large-title ${isFavoritesView ? 'raffle-large-title-favorites' : ''}`}>{title}</h3>
                    </>
                )}
                {!isFavoritesView && (
                    <h3 className="raffle-large-title">{title}</h3>
                )}
                {isFavoritesView ? (
                    <div className="raffle-large-progress-section-favorites">
                        <div className="raffle-large-progress-info-favorites">
                            {available && (
                                <span className="raffle-large-available-favorites">{available}</span>
                            )}
                            {progressText && (
                                <span className="raffle-large-progress-text-favorites">{progressText}</span>
                            )}
                        </div>
                        <div className="raffle-large-progress-bar-favorites">
                            <div
                                className="raffle-large-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                ) : (
                    <div className="raffle-large-progress-container">
                        <div className="raffle-large-progress-bar">
                            <div
                                className="raffle-large-progress-fill"
                                style={{ width: `${progress}%` }}
                            />
                        </div>
                    </div>
                )}
                {isFavoritesView ? (
                    <button className="raffle-large-details-button" onClick={handleDetailsClick}>
                        Detalles
                    </button>
                ) : (
                    <>
                        <p className="raffle-large-price">
                            <span className="raffle-large-price-label">Valuado: </span>
                            <span className="raffle-large-price-value">{price}</span>
                        </p>
                        <div onClick={handleFreeTicketClick}>
                            <FreeTicketButton onClick={() => onFreeTicketClick?.()} />
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default RaffleLargeComponent;

