'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import planeIcon from '@/images/icons/plane-icon.svg';
import checkIcon from '@/images/icons/check-icon.svg';
import ticketIcon from '@/images/icons/ticket-icon.svg';
import iphoneImage from '@/images/iphone.jpg';
import macbookImage from '@/images/macbook.jpg';
import tecladoImage from '@/images/teclado.png';
import '../purchase-success.css';
import { Raffle } from '@/models/raffle.model';

interface PurchaseSuccessComponentProps {
    productId: string;
    quantity: number;
    data: Raffle;
}

const PurchaseSuccessComponent = ({ productId, quantity, data }: PurchaseSuccessComponentProps) => {
    const router = useRouter();

    const productData = data;

    const handleShare = () => {
        // Funcionalidad de compartir (a implementar)
        console.log('Compartir producto');
    };

    const handleGoHome = () => {
        router.push('/');
    };

    return (
        <div className="purchase-success-container">
            {/* Card con imagen y texto */}
            <div className="purchase-success-card">
                <div className="purchase-success-image-container">
                    {productData.productImages && productData.productImages.length > 0 && (
                        <Image
                            src={productData.productImages[0].url}
                            alt={productData.title}
                            fill
                            style={{ objectFit: 'cover' }}
                        />
                    )}
                    {/* Texto sobre la imagen */}
                    <div className="purchase-success-text-overlay">
                        <h1>Ya estás participando!</h1>
                    </div>
                </div>
                {/* Check icon en posición absoluta */}
                <div className="purchase-success-check">
                    <Image
                        src={checkIcon}
                        alt="Check"
                        width={132}
                        height={132}
                    />
                </div>
            </div>

            {/* Información del producto */}
            <div className="purchase-success-info">
                <h2 className="purchase-success-product-title">{productData.title}</h2>
                <div className="purchase-success-product-price">
                    <Image
                        src={ticketIcon}
                        alt="Ticket"
                        width={12}
                        height={10}
                    />
                    <span>{productData.ticketPriceCoins}</span>
                </div>
            </div>

            {/* Botones */}
            <div className="purchase-success-buttons">
                <button className="purchase-success-share-button" onClick={handleShare}>
                    <Image
                        src={planeIcon}
                        alt="Compartir"
                        width={16}
                        height={14}
                    />
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
