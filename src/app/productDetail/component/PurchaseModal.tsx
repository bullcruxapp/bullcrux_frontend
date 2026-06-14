'use client'

import { useState } from 'react';
import Image from 'next/image';
import ticketIconBlack from '@/images/icons/ticket-icon-black.svg';
import './purchase-modal.css';
import { createPaymentPreference } from '@/services/payment.service';

interface PurchaseModalProps {
    isOpen: boolean;
    onClose: () => void;
    product: {
        image: string | any;
        title: string;
        price: string;
        priceValue: number;
    };
    productId: string;
    token: string;
}

const PurchaseModal = ({ isOpen, onClose, product, productId, token }: PurchaseModalProps) => {
    const [quantity, setQuantity] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const handleDecrease = () => { if (quantity > 1) setQuantity(quantity - 1); };
    const handleIncrease = () => { if (quantity < 100) setQuantity(quantity + 1); };

    const handlePurchase = async () => {
        if (!token) {
            setError('Tenés que iniciar sesión para comprar.');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            const preference = await createPaymentPreference(productId, quantity, token);
            // Redirigir al checkout de MercadoPago
            if (preference?.init_point) {
                window.location.href = preference.init_point;
            } else {
                throw new Error('No se pudo generar el link de pago');
            }
        } catch (err: any) {
            setError(err.message || 'Error al procesar el pago. Intentá de nuevo.');
            setLoading(false);
        }
    };

    const total = product.priceValue * quantity;
    const totalFormatted = `C$ ${total.toLocaleString('es-CR')}`;

    return (
        <div className="purchase-modal-overlay" onClick={onClose}>
            <div className="purchase-modal-container" onClick={(e) => e.stopPropagation()}>
                <div className="purchase-modal-header">
                    <h2 className="purchase-modal-title">Confirmá tu compra</h2>
                    <button className="purchase-modal-close" onClick={onClose}>
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                            <path d="M18 6L6 18M6 6L18 18" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </button>
                </div>

                <div className="purchase-modal-card">
                    <div className="purchase-modal-card-image">
                        <Image src={product.image} alt={product.title} fill style={{ objectFit: 'cover' }} unoptimized />
                    </div>
                    <div className="purchase-modal-card-content">
                        <h3 className="purchase-modal-product-title">{product.title}</h3>
                        <p className="purchase-modal-product-subtitle">Participación</p>
                        <p className="purchase-modal-product-price">{product.price} c/u</p>

                        <div className="purchase-modal-quantity">
                            <button className="purchase-modal-quantity-button" onClick={handleDecrease} disabled={quantity === 1}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            <span className="purchase-modal-quantity-value">{quantity}</span>
                            <button className="purchase-modal-quantity-button" onClick={handleIncrease} disabled={quantity >= 100}>
                                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                    <path d="M8 4V12M4 8H12" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                        </div>

                        <hr className="purchase-modal-divider" />

                        <div className="purchase-modal-total">
                            <span className="purchase-modal-total-label">Total</span>
                            <span className="purchase-modal-total-value">{totalFormatted}</span>
                        </div>
                    </div>
                </div>

                {error && (
                    <p style={{ color: '#ff4444', fontSize: '13px', textAlign: 'center', margin: '8px 0' }}>
                        {error}
                    </p>
                )}

                <button
                    className="purchase-modal-buy-button"
                    onClick={handlePurchase}
                    disabled={loading}
                    style={{ opacity: loading ? 0.7 : 1 }}
                >
                    <Image src={ticketIconBlack} alt="Ticket" width={18} height={14} />
                    <span>{loading ? 'Procesando...' : 'Ir a pagar'}</span>
                </button>
            </div>
        </div>
    );
};

export default PurchaseModal;
