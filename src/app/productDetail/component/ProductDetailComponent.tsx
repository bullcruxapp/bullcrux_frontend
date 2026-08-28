'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import Image from 'next/image';
import { Swiper, SwiperSlide } from 'swiper/react';
import type { Swiper as SwiperType } from 'swiper';
import 'swiper/css';
import ticketIcon from '@/images/icons/ticket-icon.svg';
import shareIcon from '@/images/icons/share-icon.svg';
import fireIcon from '@/images/icons/fire-icon.svg';
import PurchaseModal from './PurchaseModal';
import { getRaffleById } from '@/services/raffles.service';
import { getAdProgress, claimAdTicket } from '@/services/ticket.service';
import AdOfferwallModal from '@/components/AdOfferwall/AdOfferwallModal';
import { Raffle } from '@/models/raffle.model';
import './product-detail-desktop.css';

interface ProductDetailComponentProps {
    productId: string;
}

const SF_PRO = '-apple-system, "SF Pro", "SF Pro Display", BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

/** Detecta si una URL es un video, mirando la extensión del archivo. */
const isVideoUrl = (url: string) => /\.(mp4|webm|mov|ogg)(\?.*)?$/i.test(url);

const ProductDetailComponent = ({ productId }: ProductDetailComponentProps) => {
    const router = useRouter();
    const { data: session } = useSession();
    const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
    const [raffle, setRaffle] = useState<Raffle | null>(null);
    const [loading, setLoading] = useState(true);
    const [claimMessage, setClaimMessage] = useState('');
    const [claiming, setClaiming] = useState(false);
    const [buyHover, setBuyHover] = useState(false);
    const [freeHover, setFreeHover] = useState(false);
    const [showAdWall, setShowAdWall] = useState(false);
    const [adProgress, setAdProgress] = useState<{ count: number; required: number } | null>(null);
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

    const handleFreeTicket = async () => {
        if (!session) { router.push('/login'); return; }
        if (claiming) return;
        setClaiming(true);
        try {
            const progress = await getAdProgress(productId, (session as any).accessToken);
            if (progress.alreadyClaimed) {
                setClaimMessage('Ya reclamaste tu ticket gratis para este sorteo');
                return;
            }
            if (!progress.canClaim) {
                setAdProgress({ count: progress.count, required: progress.required });
                setShowAdWall(true);
                return;
            }
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

    const handleCloseAdWall = async () => {
        setShowAdWall(false);
        setAdProgress(null);
        if (!session) return;
        try {
            const progress = await getAdProgress(productId, (session as any).accessToken);
            if (progress.canClaim) {
                await claimAdTicket(productId, (session as any).accessToken);
                setClaimMessage('¡Ticket gratis reclamado!');
                setTimeout(() => setClaimMessage(''), 4000);
            }
        } catch (e) {
            console.error(e);
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

    const getAutoBadge = () => {
        if (!raffle) return null;
        const available = raffle.totalTickets - raffle.ticketsSold;
        const progress = getProgress();
        if (available <= 20) return { text: 'LIMITED STOCK', color: '#FF6B35' };
        if (progress >= 70) return { text: 'SELLING FAST', color: '#8A38F5' };
        return null;
    };

    const images = getImages();
    const progress = getProgress();
    const available = raffle ? raffle.totalTickets - raffle.ticketsSold : 0;
    const isOpen = raffle?.status === 'OPEN';
    const badge = getAutoBadge();

    if (loading) {
        return (
            <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SF_PRO }}>
                <p style={{ color: '#fff' }}>Cargando...</p>
            </div>
        );
    }

    if (!raffle) {
        return (
            <div style={{ minHeight: '100vh', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: SF_PRO }}>
                <p style={{ color: '#fff' }}>Sorteo no encontrado.</p>
            </div>
        );
    }

    return (
        <>
        <div className="mobile-product-detail" style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', paddingBottom: '180px', fontFamily: SF_PRO }}>
            {/* Header con back button */}
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, padding: '52px 20px 16px' }}>
                <button onClick={() => router.back()} style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px', display: 'flex' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
            </div>

            {/* Image */}
            <div style={{ width: '100%', height: '55vh', minHeight: '380px', position: 'relative' }}>
                {images.length > 0 ? (
                    <Swiper
                        slidesPerView={1}
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        style={{ width: '100%', height: '100%' }}
                    >
                        {images.map((image, index) => (
                            <SwiperSlide key={index}>
                                <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                    {isVideoUrl(image) ? (
                                        <video
                                            src={image}
                                            controls
                                            playsInline
                                            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <Image src={image} alt={raffle.productName} fill style={{ objectFit: 'cover' }} priority={index === 0} />
                                    )}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div style={{ width: '100%', height: '100%', background: '#111', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <p style={{ color: '#666' }}>Sin imagen</p>
                    </div>
                )}
            </div>

            {/* Content */}
            <div style={{ padding: '20px 20px 0', display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Progress bar */}
                <div>
                    <div style={{ width: '100%', height: '4px', background: 'rgba(255,255,255,0.15)', borderRadius: '2px', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${progress}%`, background: '#94FF31', borderRadius: '2px' }} />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '6px', fontFamily: SF_PRO }}>
                        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>{available} Disponibles</span>
                        <span style={{ fontSize: '13px', color: '#fff', fontWeight: 700 }}>{progress}%</span>
                    </div>
                </div>

                {/* Title */}
                <h1 style={{ fontSize: '32px', fontWeight: 700, color: '#fff', margin: 0, lineHeight: 1.05, letterSpacing: '-0.02em', fontFamily: SF_PRO }}>
                    {raffle.productName}
                </h1>

                {/* Price + Badge + Share */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#94FF31', fontWeight: 700, fontSize: '15px', fontFamily: SF_PRO }}>
                        <Image src={ticketIcon} alt="Ticket" width={18} height={14} />
                        <span>B$ {raffle.ticketPriceCoins}</span>
                    </div>
                    {badge && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px', background: badge.color, borderRadius: '20px', padding: '4px 10px' }}>
                            <Image src={fireIcon} alt="" width={11} height={11} />
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff', fontFamily: SF_PRO, letterSpacing: '0.02em' }}>{badge.text}</span>
                        </div>
                    )}
                    <button style={{ background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', padding: '4px', display: 'flex' }}>
                        <Image src={shareIcon} alt="Compartir" width={22} height={22} />
                    </button>
                </div>

                {/* Separator */}
                <div style={{ width: '100%', height: '1px', background: 'rgba(255,255,255,0.12)', marginTop: '4px' }} />

                {/* Description */}
                {raffle.description && (
                    <div style={{ marginTop: '4px' }}>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 8px', fontFamily: SF_PRO }}>Title</p>
                        <p style={{ fontSize: '15px', color: '#9A9A9A', lineHeight: 1.5, margin: 0, fontFamily: SF_PRO, fontWeight: 400 }}>
                            {raffle.description}
                        </p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div style={{ padding: '24px 20px 60px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {isOpen ? (
                    <>
                        <button
                            onClick={() => { if (!session) { router.push('/login'); return; } setIsPurchaseModalOpen(true); }}
                            onMouseEnter={() => setBuyHover(true)}
                            onMouseLeave={() => setBuyHover(false)}
                            style={{ width: '100%', height: '52px', background: '#94FF31', border: 'none', borderRadius: '26px', color: '#000', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', opacity: buyHover ? 0.9 : 1, transition: 'opacity 0.2s', fontFamily: SF_PRO }}
                        >
                            <Image src={ticketIcon} alt="" width={20} height={16} style={{ filter: 'brightness(0)' }} />
                            <span>Comprar un ticket</span>
                        </button>
                        <button
                            onClick={handleFreeTicket}
                            onMouseEnter={() => setFreeHover(true)}
                            onMouseLeave={() => setFreeHover(false)}
                            disabled={claiming}
                            style={{ width: '100%', height: '52px', background: 'transparent', border: '1px solid #94FF31', borderRadius: '26px', color: '#fff', fontSize: '16px', fontWeight: 700, cursor: claiming ? 'not-allowed' : 'pointer', opacity: claiming ? 0.7 : (freeHover ? 0.9 : 1), transition: 'opacity 0.2s', fontFamily: SF_PRO }}
                        >
                            {claiming ? 'Reclamando...' : 'Obtener un ticket Gratis'}
                        </button>
                        {claimMessage && (
                            <p style={{ textAlign: 'center', fontSize: '13px', color: claimMessage.includes('¡') ? '#94FF31' : '#ff4444', margin: 0, fontFamily: SF_PRO }}>
                                {claimMessage}
                            </p>
                        )}
                    </>
                ) : (
                    <button disabled style={{ width: '100%', height: '52px', background: '#94FF31', border: 'none', borderRadius: '26px', color: '#000', fontSize: '16px', fontWeight: 700, opacity: 0.5, fontFamily: SF_PRO }}>
                        {raffle.status === 'SOLD_OUT' ? 'Sorteo cerrado' : 'Sorteo finalizado'}
                    </button>
                )}
            </div>
        </div>

        {/* ================= DESKTOP ================= */}
        <div className="desktop-product-detail">
            <div className="desktop-product-container">
                <button onClick={() => router.back()} className="desktop-back-btn">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Volver
                </button>

                <div className="desktop-product-title-row">
                    <h1 className="desktop-product-title">{raffle.productName}</h1>
                </div>

                <div className="desktop-product-grid">
                    {/* Columna izquierda: imagen + descripción */}
                    <div className="desktop-product-left">
                        <div className="desktop-product-image-box">
                            {images.length > 0 ? (
                                <Swiper slidesPerView={1} style={{ width: '100%', height: '100%' }}>
                                    {images.map((image, index) => (
                                        <SwiperSlide key={index}>
                                            <div style={{ width: '100%', height: '100%', position: 'relative' }}>
                                                {isVideoUrl(image) ? (
                                                    <video
                                                        src={image}
                                                        controls
                                                        playsInline
                                                        style={{ width: '100%', height: '100%', objectFit: 'contain' }}
                                                    />
                                                ) : (
                                                    <Image src={image} alt={raffle.productName} fill style={{ objectFit: 'contain' }} priority={index === 0} />
                                                )}
                                            </div>
                                        </SwiperSlide>
                                    ))}
                                </Swiper>
                            ) : (
                                <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <p style={{ color: '#666' }}>Sin imagen</p>
                                </div>
                            )}
                        </div>

                        {raffle.description && (
                            <div className="desktop-product-description">
                                <p className="desktop-product-description-label">Descripción</p>
                                <p className="desktop-product-description-text">{raffle.description}</p>
                            </div>
                        )}
                    </div>

                    {/* Columna derecha: card de compra */}
                    <div className="desktop-product-right">
                        <div className="desktop-purchase-card">
                            <div className="desktop-purchase-price">
                                <Image src={ticketIcon} alt="Ticket" width={20} height={16} />
                                <span>B$ {raffle.ticketPriceCoins}</span>
                            </div>

                            {badge && (
                                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: badge.color, borderRadius: '20px', padding: '4px 10px', width: 'fit-content' }}>
                                    <Image src={fireIcon} alt="" width={11} height={11} />
                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#fff' }}>{badge.text}</span>
                                </div>
                            )}

                            <div>
                                <div className="desktop-purchase-progress-bar">
                                    <div className="desktop-purchase-progress-fill" style={{ width: `${progress}%` }} />
                                </div>
                                <div className="desktop-purchase-progress-info">
                                    <span>{available} disponibles</span>
                                    <span>{progress}%</span>
                                </div>
                            </div>

                            {isOpen ? (
                                <>
                                    <button
                                        className="desktop-buy-btn"
                                        onClick={() => { if (!session) { router.push('/login'); return; } setIsPurchaseModalOpen(true); }}
                                    >
                                        <Image src={ticketIcon} alt="" width={18} height={14} style={{ filter: 'brightness(0)' }} />
                                        Comprar un ticket
                                    </button>
                                    <button
                                        className="desktop-free-btn"
                                        onClick={handleFreeTicket}
                                        disabled={claiming}
                                    >
                                        {claiming ? 'Reclamando...' : 'Obtener un ticket gratis'}
                                    </button>
                                    {claimMessage && (
                                        <p style={{ textAlign: 'center', fontSize: '13px', color: claimMessage.includes('¡') ? '#85efac' : '#ff6b6b', margin: 0 }}>
                                            {claimMessage}
                                        </p>
                                    )}
                                </>
                            ) : (
                                <button className="desktop-buy-btn" disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
                                    {raffle.status === 'SOLD_OUT' ? 'Sorteo cerrado' : 'Sorteo finalizado'}
                                </button>
                            )}

                            <button className="desktop-share-btn">
                                <Image src={shareIcon} alt="" width={16} height={16} />
                                Compartir
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

            {raffle && (
                <PurchaseModal
                    isOpen={isPurchaseModalOpen}
                    onClose={() => setIsPurchaseModalOpen(false)}
                    product={{
                        image: images[0] || '',
                        title: raffle.productName,
                        price: `B$ ${raffle.ticketPriceCoins}`,
                        priceValue: raffle.ticketPriceCoins,
                    }}
                    productId={raffle.id}
                    token={session?.accessToken || ''}
                />
            )}

            {showAdWall && session && adProgress && (
                <AdOfferwallModal
                    userId={(session.user as any).id}
                    raffleId={productId}
                    progress={adProgress.count}
                    required={adProgress.required}
                    onClose={handleCloseAdWall}
                />
            )}
        </>
    );
};

export default ProductDetailComponent;
