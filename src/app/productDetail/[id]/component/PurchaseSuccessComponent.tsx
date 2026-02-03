'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import planeIcon from '../../../../images/icons/plane-icon.svg';
import checkIcon from '../../../../images/icons/check-icon.svg';
import ticketIcon from '../../../../images/icons/ticket-icon.svg';
import iphoneImage from '../../../../images/iphone.jpg';
import macbookImage from '../../../../images/macbook.jpg';
import tecladoImage from '../../../../images/teclado.png';
import '../purchase-success.css';

interface PurchaseSuccessComponentProps {
    productId: string;
    quantity: number;
}

const PurchaseSuccessComponent = ({ productId, quantity }: PurchaseSuccessComponentProps) => {
    const router = useRouter();

    // Datos del producto (temporal, luego vendrá de la base de datos)
    // Por ahora usamos datos estáticos basados en el productId
    const getProductData = () => {
        if (productId === 'iphone-16-pro-max') {
            return { image: iphoneImage, title: 'iPhone 16 Pro Max', price: 'BC$ 250' };
        } else if (productId === 'macbook-pro-2019') {
            return { image: macbookImage, title: 'Apple Macbook Pro 2019', price: 'BC$ 1150' };
        } else if (productId === 'kryboard-k500') {
            return { image: tecladoImage, title: 'Kryboard K500', price: 'BC$ 250' };
        }
        // Default
        return { image: iphoneImage, title: 'iPhone 16 Pro Max', price: 'BC$ 250' };
    };

    const productData = getProductData();

    const handleShare = () => {
        // Funcionalidad de compartir (a implementar)
        console.log('Compartir producto');
    };

    const handleGoHome = () => {
        router.push('/homepage');
    };

    return (
        <div className="purchase-success-container">
            {/* Card con imagen y texto */}
            <div className="purchase-success-card">
                <div className="purchase-success-image-container">
                    <Image
                        src={productData.image}
                        alt={productData.title}
                        fill
                        style={{ objectFit: 'cover' }}
                    />
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
                    <span>{productData.price}</span>
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
