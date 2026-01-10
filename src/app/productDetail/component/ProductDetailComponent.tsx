'use client'

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import iphoneImage from '../../../images/iphone.jpg';
import macbookImage from '../../../images/macbook.jpg';
import tecladoImage from '../../../images/teclado.png';
import fireIcon from '../../../images/icons/fire-icon.svg';
import ticketIcon from '../../../images/icons/ticket-icon.svg';
import ticketIconBlack from '../../../images/icons/ticket-icon-black.svg';
import shareIcon from '../../../images/icons/share-icon.svg';
import FreeTicketButton from '../../../components/FreeTicketButton';
import PurchaseModal from './PurchaseModal';
import '../productDetail.css';

interface ProductDetailComponentProps {
    productId: string;
}

const ProductDetailComponent = ({ productId }: ProductDetailComponentProps) => {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);

    // Por ahora usamos imágenes estáticas, luego se cambiarán desde la base de datos
    const productImages = [
        iphoneImage,
        macbookImage,
        tecladoImage,
        iphoneImage,
        macbookImage,
    ];

    const handleBack = () => {
        router.back();
    };

    // Datos del producto (temporal, luego vendrá de la base de datos)
    const productData = {
        title: 'iPhone 16 Pro Max',
        price: 'CS 250',
        priceValue: 250, // Valor numérico para cálculos
        badge: {
            text: 'SELLING FAST',
            icon: fireIcon,
        },
        progress: 25,
        available: '250 Disponibles',
        description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
        image: productImages[0], // Primera imagen del slider
    };

    return (
        <div className="product-detail-container">
            {/* Header con botón de retroceso */}
            <div className="product-detail-header">
                <button className="product-detail-back-button" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Slider de imágenes */}
            <div className="product-detail-slider-container">
                <Swiper
                    modules={[Navigation, Pagination]}
                    spaceBetween={0}
                    slidesPerView={1}
                    pagination={{
                        clickable: true,
                    }}
                    onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                    onSwiper={(swiper) => (swiperRef.current = swiper)}
                    className="product-detail-swiper"
                >
                    {productImages.map((image, index) => (
                        <SwiperSlide key={index}>
                            <div className="product-detail-slide">
                                <Image
                                    src={image}
                                    alt={`${productData.title} - Imagen ${index + 1}`}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                    priority={index === 0}
                                />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            </div>

            {/* Contenido del producto */}
            <div className="product-detail-content">
                {/* Barra de progreso */}
                <div className="product-detail-progress-section">
                    <div className="product-detail-progress-bar">
                        <div
                            className="product-detail-progress-fill"
                            style={{ width: `${productData.progress}%` }}
                        />
                    </div>
                    <div className="product-detail-progress-info">
                        <span className="product-detail-available">{productData.available}</span>
                        <span className="product-detail-progress-percent">{productData.progress}%</span>
                    </div>
                </div>

                {/* Título y precio */}
                <div className="product-detail-title-section">
                    <h1 className="product-detail-title">{productData.title}</h1>
                    <div className="product-detail-price-section">
                        <div className="product-detail-price">
                            <Image
                                src={ticketIcon}
                                alt="Ticket"
                                width={20}
                                height={16}
                            />
                            <span>{productData.price}</span>
                        </div>
                        {productData.badge && (
                            <div className="product-detail-badge">
                                <Image
                                    src={productData.badge.icon}
                                    alt={productData.badge.text}
                                    width={11}
                                    height={11}
                                />
                                <span>{productData.badge.text}</span>
                            </div>
                        )}
                        <button className="product-detail-share-button">
                            <Image
                                src={shareIcon}
                                alt="Compartir"
                                width={20}
                                height={20}
                            />
                        </button>
                    </div>
                </div>

                {/* Descripción */}
                <div className="product-detail-description-section">
                    <h2 className="product-detail-description-title">Title</h2>
                    <p className="product-detail-description-text">{productData.description}</p>
                </div>

                {/* Botones de acción */}
                <div className="product-detail-actions">
                    <button
                        className="product-detail-buy-button"
                        onClick={() => setIsPurchaseModalOpen(true)}
                    >
                        <Image
                            src={ticketIconBlack}
                            alt="Ticket"
                            width={18}
                            height={14}
                        />
                        <span>Comprar un ticket</span>
                    </button>
                    <button className="product-detail-free-button">
                        <span>Obtener un ticket Gratis</span>
                    </button>
                </div>
            </div>

            {/* Modal de compra */}
            <PurchaseModal
                isOpen={isPurchaseModalOpen}
                onClose={() => setIsPurchaseModalOpen(false)}
                product={{
                    image: productData.image,
                    title: productData.title,
                    price: productData.price,
                    priceValue: productData.priceValue,
                }}
                productId={productId}
            />
        </div>
    );
};

export default ProductDetailComponent;

