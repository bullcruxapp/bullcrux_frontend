'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import FreeTicketButton from './FreeTicketButton';
import './raffle-large.css';

interface RaffleLargeComponentProps {
    image: string | any;
    title: string;
    progress: number; // 0-100
    price: string;
    onFreeTicketClick?: () => void;
    productId?: string;
    onClick?: () => void;
}

const RaffleLargeComponent = (props: RaffleLargeComponentProps) => {
    const { image, title, progress, price, onFreeTicketClick, productId, onClick } = props;
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

    return (
        <div
            className="raffle-large"
            onClick={handleCardClick}
            style={{ cursor: (onClick || productId) ? 'pointer' : 'default' }}
        >
            <div className="raffle-large-image">
                <Image
                    src={image}
                    alt={title}
                    width={185}
                    height={122}
                    style={{ objectFit: 'cover', borderRadius: '16px 0 0 16px' }}
                />
            </div>
            <div className="raffle-large-content">
                <h3 className="raffle-large-title">{title}</h3>
                <div className="raffle-large-progress-container">
                    <div className="raffle-large-progress-bar">
                        <div
                            className="raffle-large-progress-fill"
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                </div>
                <p className="raffle-large-price">
                    <span className="raffle-large-price-label">Valuado: </span>
                    <span className="raffle-large-price-value">{price}</span>
                </p>
                <div onClick={handleFreeTicketClick}>
                    <FreeTicketButton onClick={handleFreeTicketClick} />
                </div>
            </div>
        </div>
    );
};

export default RaffleLargeComponent;

