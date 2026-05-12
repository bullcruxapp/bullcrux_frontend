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
import ticketIcon from '@/images/icons/ticket-icon.svg';
import ticketIconBlack from '@/images/icons/ticket-icon-black.svg';
import shareIcon from '@/images/icons/share-icon.svg';
import PurchaseModal from './PurchaseModal';
import '../productDetail.css';
import { Raffle } from '@/models/raffle.model';

interface ProductDetailComponentProps {
    productId: string;
    data: Raffle;
    userId: string;
    bearerToken: string;
}

const ProductDetailComponent = ({ productId, data, userId, bearerToken }: ProductDetailComponentProps) => {
    const router = useRouter();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);
    const productData = data
    const productImages = data.productImages || [];


    const handleBack = () => {
        router.back();
    };

    const available = productData.totalTickets - productData.ticketsSold;
    const progress = Math.round((productData.ticketsSold / productData.totalTickets) * 100);


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
                                    src={image.url}
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
                            style={{ width: `${progress}%` }}
                        />
                    </div>
                    <div className="product-detail-progress-info">
                        <span className="product-detail-available">{available}</span>
                        <span className="product-detail-progress-percent">{progress}%</span>
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
                            <span>CS {productData.ticketPriceCoins}</span>
                        </div>
                        {/* {productData.badge && (
                            <div className="product-detail-badge">
                                <Image
                                    src={productData.badge.icon}
                                    alt={productData.badge.text}
                                    width={11}
                                    height={11}
                                />
                                <span>{productData.badge.text}</span>
                            </div>
                        )} */}
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
                    <h2 className="product-detail-description-title">{productData.title}</h2>
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
                product={productData}
                productId={productId}
                userId={userId}
                token={bearerToken}
            />
        </div>
    );
};

export default ProductDetailComponent;

