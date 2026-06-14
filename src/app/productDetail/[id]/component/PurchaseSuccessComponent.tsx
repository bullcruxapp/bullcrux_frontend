'use client'

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import planeIcon from '@/images/icons/plane-icon.svg';
import checkIcon from '@/images/icons/check-icon.svg';
import ticketIcon from '@/images/icons/ticket-icon.svg';
import '../purchase-success.css';
import { getRaffleById } from '@/services/raffles.service';
import { Raffle } from '@/models/raffle.model';

interface PurchaseSuccessComponentProps {
    productId: string;
    quantity: number;
}

const PurchaseSuccessComponent = ({ productId, quantity }: PurchaseSuccessComponentProps) => {
    const router = useRouter();
    const [raffle, setRaffle] = useState<Raffle | null>(null);

    useEffect(() => {
        getRaffleById(productId).then(setRaffle).catch(console.error);
    }, [productId]);

    const getImageUrl = () => {
        if (raffle?.productImages && raffle.productImages.length > 0) {
            return raffle.productImages[0].url;
        }
        return raffle?.productImage || '';
    };

    const handleShare = () => {
        if (navigator.share) {
            navigator.share({
                title: `¡Estoy participando por un ${raffle?.productName}!`,
                text: `Compré ${quantity} participación(es) en BullCrux. ¡Sumate vos también!`,
                url: window.location.href,
            });
        }
    };

    const handleGoHome = () => router.push('/');

    const imageUrl = getImageUrl();

    return (
        <div className="purchase-success-container">
            <div className="purchase-success-card">
                <div className="purchase-success-image-container">
                    {imageUrl ? (
                        <Image
                            src={imageUrl}
                            alt={raffle?.productName || 'Producto'}
                            fill
                            style={{ objectFit: 'cover' }}
                            unoptimized
                        />
                    ) : (
                        <div style={{ background: '#111', width: '100%', height: '100%' }} />
                    )}
                    <div className="purchase-success-text-overlay">
                        <h1>¡Ya estás participando!</h1>
                    </div>
                </div>
                <div className="purchase-success-check">
                    <Image src={checkIcon} alt="Check" width={132} height={132} />
                </div>
            </div>

            <div className="purchase-success-info">
                <h2 className="purchase-success-product-title">
                    {raffle?.productName || 'Cargando...'}
                </h2>
                <div className="purchase-success-product-price">
                    <Image src={ticketIcon} alt="Ticket" width={12} height={10} />
                    <span>{quantity} participación{quantity > 1 ? 'es' : ''} — C$ {(raffle?.ticketPriceCoins || 0) * quantity}</span>
                </div>
            </div>

            <div className="purchase-success-buttons">
                <button className="purchase-success-share-button" onClick={handleShare}>
                    <Image src={planeIcon} alt="Compartir" width={16} height={14} />
                    <span>Compartir</span>
                </button>
                <button className="purchase-success-home-button" onClick={handleGoHome}>
                    <span>Volver a Home</span>
                </button>
            </div>
        </div>
    );
};

export default PurchaseSuccessComponent;
