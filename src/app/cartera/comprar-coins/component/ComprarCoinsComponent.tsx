'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import cardPlaceholder from '../../../../images/card-placeholder.png';
import checkIcon from '../../../../images/icons/check2.png';
import './comprar-coins-component.css';

const RECARGAS = ['$ 500', '$ 1000', '$ 1500', '$ 2000', '$ 2500', '$ 3000'];

const ComprarCoinsComponent = () => {
    const router = useRouter();

    const handleBack = () => router.back();

    return (
        <div className="comprar-coins-container comprar-coins-component">
            <div className="comprar-coins-header">
                <button type="button" className="comprar-coins-back" onClick={handleBack} aria-label="Volver">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="comprar-coins-title">Comprar $COINs</h1>
                <div className="comprar-coins-spacer" />
            </div>

            <div className="comprar-coins-cards">
                <div className="comprar-coins-card-wrap">
                    <Image
                        src={cardPlaceholder}
                        alt="Tarjeta de crédito"
                        fill
                        sizes="(max-width: 400px) 100vw, 340px"
                        className="comprar-coins-card-img"
                    />
                </div>
                <button type="button" className="comprar-coins-add-card" aria-label="Añadir tarjeta">
                    <span className="comprar-coins-add-plus">+</span>
                </button>
            </div>

            <h2 className="comprar-coins-recargas-title">Recargas</h2>
            <div className="comprar-coins-recargas-grid">
                {RECARGAS.map((val) => (
                    <button key={val} type="button" className="comprar-coins-recarga-btn">
                        {val}
                    </button>
                ))}
            </div>

            <div className="comprar-coins-policies">
                <Image src={checkIcon} alt="" width={20} height={20} className="comprar-coins-check" />
                <p className="comprar-coins-policies-text">
                    Top transaction policies and conditions You may read about it{' '}
                    <Link href="/perfil/privacidad" className="comprar-coins-policies-link">
                        here
                    </Link>
                    .
                </p>
            </div>

            <button type="button" className="comprar-coins-pagar">
                Pagar
            </button>
        </div>
    );
};

export default ComprarCoinsComponent;
