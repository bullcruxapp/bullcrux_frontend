'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import fireIcon from '@/images/icons/fire-icon.svg';
import ticketIcon from '@/images/icons/ticket-icon.svg';
import shareIcon from '@/images/icons/share-icon.svg';
import PurchaseModal from './PurchaseModal';
import '../productDetail.css';
import { getRaffleById } from '@/services/raffles.service';
import { claimAdTicket } from '@/services/ticket.service';
import { Raffle } from '@/models/raffle.model';

interface ProductDetailComponentProps {
    productId: string;
}

const ProductDetailComponent = ({ productId }: ProductDetailComponentProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [activeIndex, setActiveIndex] = useState(0);
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [raffle, setRaffle] = useState<Raffle | null>(null);
    const [loading, setLoading] = useState(true);
    const [claimMessage, setClaimMessage] = useState('');
    const [claiming, setClaiming] = useState(false);
    const swiperRef = useRef<SwiperType | null>(null);

    useEffect(() => {
        const fetchRaffle = async () => {
            try {
                const data = await getRaffleById(productId);
                setRaffle(data);
            } catch (error) {
                console.error('Error fetching raffle:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchRaffle();
    }, [productId]);

    const handleBack = () => router.back();

    const handleFreeTicket = async () => {
        if (!session) { router.push('/login'); return; }
        if (claiming) return;

        setClaiming(true);
        try {
            await claimAdTicket(productId, (session as any).accessToken);
            setClaimMessage('¡Ticket gratis reclamado!');
        } catch (error: any) {
            const msg = error.message?.includes('Ya reclamaste')
                ? 'Ya reclamaste tu ticket gratis para este sorteo'
                : 'Error al reclamar el ticket';
            setClaimMessage(msg);
        } finally {
            setClaiming(false);
            setTimeout(() => setClaimMessage(''), 4000);
        }
    };

    const getProgress = () => {
        if (!raffle || raffle.totalTickets === 0) return 0;
        return Math.round((raffle.ticketsSold / raffle.totalTickets) * 100);
    };

    const getImages = () => {
        if (raffle?.productImages && raffle.productImages.length > 0) {
            return raffle.productImages.map(img => img.url);
        }
        if (raffle?.productImage) return [raffle.productImage];
        return [];
    };

    const images = getImages();
    const progress = getProgress();
    const available = raffle ? raffle.totalTickets - raffle.ticketsSold : 0;
    const isOpen = raffle?.status === 'OPEN';

    if (loading) {
        return (
            <div className="product-detail-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#fff' }}>Cargando...</p>
            </div>
        );
    }

    if (!raffle) {
        return (
            <div className="product-detail-container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <p style={{ color: '#fff' }}>Sorteo no encontrado.</p>
            </div>
        );
    }

    return (
        <div className="product-detail-container">
            <div className="product-detail-header">
                <button className="product-detail-back-button" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            <div className="product-detail-slider-container">
                {images.length > 0 ? (
                    <Swiper
                        modules={[Navigation, Pagination]}
                        spaceBetween={0}
                        slidesPerView={1}
                        pagination={{ clickable: true }}
                        onSlideChange={(swiper) => setActiveIndex(swiper.activeIndex)}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        className="product-detail-swiper"
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div className="product-detail-slide">
                                    <Image
                                        src={image}
                                        alt={`${raffle.productName} - Imagen ${index + 1}`}
                                        fill
                                        style={{ objectFit: 'cover' }}
                                        priority={index === 0}
                                        unoptimized
                                    />
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="product-detail-slide" style={{ background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: '#666' }}>Sin imagen</p>
                    </div>
                )}
            </div>

            <div className="product-detail-content">
                <div className="product-detail-title-row">
                    <h1 className="product-detail-title">{raffle.productName}</h1>
                    <button className="product-detail-share-button">
                        <Image src={shareIcon} alt="Compartir" width={20} height={20} />
                    </button>
                </div>

                <div className="product-detail-badge">
                    <Image src={fireIcon} alt="Badge" width={12} height={12} />
                    <span>{raffle.status === 'SOLD_OUT' ? 'AGOTADO' : 'ACTIVO'}</span>
                </div>

                <div className="product-detail-progress-section">
                    <div className="product-detail-progress-bar">
                        <div className="product-detail-progress-fill" style={{ width: `${progress}%` }} />
                    </div>
                    <div className="product-detail-progress-info">
                        <span>{available} disponibles</span>
                        <span>{raffle.ticketsSold}/{raffle.totalTickets}</span>
                    </div>
                </div>

                <p className="product-detail-description">{raffle.description}</p>

                <div className="product-detail-price-row">
                    <div className="product-detail-price">
                        <Image src={ticketIcon} alt="Ticket" width={17} height={13} />
                        <span>C$ {raffle.ticketPriceCoins} por participación</span>
                    </div>
                </div>
            </div>

            <div className="product-detail-footer">
                {isOpen ? (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>
                        <button
                            className="product-detail-buy-button"
                            onClick={() => {
                                if (!session) { router.push('/login'); return; }
                                setIsPurchaseModalOpen(true);
                            }}
                        >
                            <Image src={ticketIcon} alt="Ticket" width={18} height={14} />
                            <span>Comprar participación</span>
                        </button>
                        <button
                            className="product-detail-free-button"
                            onClick={handleFreeTicket}
                            disabled={claiming}
                            style={{ opacity: claiming ? 0.7 : 1 }}
                        >
                            <span>{claiming ? 'Reclamando...' : 'Obtener un ticket Gratis'}</span>
                        </button>
                        {claimMessage && (
                            <p style={{ textAlign: 'center', fontSize: '13px', color: claimMessage.includes('¡') ? '#ABDA53' : '#ff4444', margin: 0 }}>
                                {claimMessage}
                            </p>
                        )}
                    </div>
                ) : (
                    <button className="product-detail-buy-button" disabled style={{ opacity: 0.5 }}>
                        <span>{raffle.status === 'SOLD_OUT' ? 'Sorteo cerrado' : 'Sorteo finalizado'}</span>
                    </button>
                )}
            </div>

            {raffle && (
                <PurchaseModal
                    isOpen={isPurchaseModalOpen}
                    onClose={() => setIsPurchaseModalOpen(false)}
                    product={{
                        image: images[0] || '',
                        title: raffle.productName,
                        price: `C$ ${raffle.ticketPriceCoins}`,
                        priceValue: raffle.ticketPriceCoins,
                    }}
                    productId={raffle.id}
                    token={session?.accessToken || ''}
                />
            )}
        </div>
    );
};

export default ProductDetailComponent;
