'use client'

import { useState } from 'react';
import Image from 'next/image';
import ticketIconBlack from '@/images/icons/ticket-icon-black.svg';
import './purchase-modal.css';
import { Ticket } from '@/models/ticket.model';
import { buyTicket } from '@/services/ticket.service';
import { useRouter } from 'next/navigation';
import { Raffle } from '@/models/raffle.model';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: Raffle;
    productId: string;
    userId: string;
    token: string;
}

const PurchaseModal = ({ isOpen, onClose, product, productId, userId, token }: PurchaseModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    const handleIncrease = () => {
        setQuantity(quantity + 1);
    };


    const handlePurchase = async () => {
        setLoading(true);
        setErrorMsg(null);

        const ticketData: Ticket = {
            id: '',
            raffleId: productId,
            userId: userId,
            quantity: quantity,
            purchasedAt: new Date().toISOString(),
        }

        try {
            const response = await buyTicket(ticketData, token);
            console.log('Tickets purchased successfully:', response);
            router.push(`/productDetail/${productId}/success?quantity=${quantity}`);
        } catch (error: any) {
            setErrorMsg(error.message);
        } finally {
            setLoading(false);
        }
    };

    const total = product.ticketPriceCoins * quantity;
    const totalFormatted = `C$ ${total.toLocaleString('es-CR')}`;

    return (
        <div className="purchase-modal-overlay" onClick={onClose}>
            {
                loading ? (
                    <div className="purchase-modal-loading">
                        <p>Procesando tu compra...</p>
                    </div>
                ) :
                    <div className="purchase-modal-container" onClick={(e) => e.stopPropagation()}>
                        {/* Header del modal */}
                        <div className="purchase-modal-header">
                            <h2 className="purchase-modal-title">Confirma tu compra</h2>
                            <button className="purchase-modal-close" onClick={onClose}>
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Card del producto */}
                        <div className="purchase-modal-card">
                            <div className="purchase-modal-card-image">
                                <Image
                                    src={product.productImages[0].url}
                                    alt={product.title}
                                    fill
                                    style={{ objectFit: 'cover' }}
                                />
                            </div>
                            <div className="purchase-modal-card-content">
                                <h3 className="purchase-modal-product-title">{product.title}</h3>
                                <p className="purchase-modal-product-subtitle">Ticket</p>
                                <p className="purchase-modal-product-price">{product.ticketPriceCoins}</p>

                                {/* Selector de cantidad */}
                                <div className="purchase-modal-quantity">
                                    <button
                                        className="purchase-modal-quantity-button"
                                        onClick={handleDecrease}
                                        disabled={quantity === 1}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                    <span className="purchase-modal-quantity-value">{quantity}</span>
                                    <button
                                        className="purchase-modal-quantity-button"
                                        onClick={handleIncrease}
                                    >
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M8 4V12M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Divisor */}
                                <hr className="purchase-modal-divider" />

                                {/* Total */}
                                <div className="purchase-modal-total">
                                    <span className="purchase-modal-total-label">Total</span>
                                    <span className="purchase-modal-total-value">{totalFormatted}</span>
                                </div>
                            </div>
                        </div>


                        {/* Botón de comprar */}
                        <button className="purchase-modal-buy-button" onClick={handlePurchase} type="button">
                            <Image
                                src={ticketIconBlack}
                                alt="Ticket"
                                width={18}
                                height={14}
                            />
                            <span>Comprar</span>
                        </button>
                        {errorMsg && (
                            <p style={{ color: 'red', textAlign: 'center', marginBottom: '8px' }}>
                                {errorMsg}
                            </p>
                        )}
                    </div>
            }

        </div>
    );
};

export default PurchaseModal;
