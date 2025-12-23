'use client'

import Image from 'next/image';
import './raffle-large.css';
import FreeTicketButton from 'components/FreeTicketButton/FreeTicketButton';

interface RaffleLargeComponentProps {
    image: string | any;
    title: string;
    progress: number; // 0-100
    price: string;
    onFreeTicketClick?: () => void;
}

const RaffleLargeComponent = (props: RaffleLargeComponentProps) => {
    const { image, title, progress, price, onFreeTicketClick } = props;

    return (
        <div className="raffle-large">
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
                <FreeTicketButton onClick={onFreeTicketClick} />
            </div>
        </div>
    );
};

export default RaffleLargeComponent;

