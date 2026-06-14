'use client'

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import checkIcon from '@/images/icons/check-icon.svg';
import ticketIcon from '@/images/icons/ticket-icon.svg';

interface DrawResult {
    raffleId: string;
    productName: string;
    drawnAt: string;
    winner: {
        id: string;
        name: string | null;
        email: string;
    };
}

interface DrawResultComponentProps {
    result: DrawResult | null;
    raffleId: string;
}

const DrawResultComponent = ({ result, raffleId }: DrawResultComponentProps) => {
    const router = useRouter();

    if (!result) {
        return (
            <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: '1rem' }}>
                <p style={{ fontSize: '18px' }}>Este sorteo todavía no fue realizado.</p>
                <button onClick={() => router.push('/')} style={{ background: '#8BFF00', color: '#000', border: 'none', borderRadius: '12px', padding: '12px 24px', fontWeight: 600, cursor: 'pointer' }}>
                    Volver al inicio
                </button>
            </div>
        );
    }

    const winnerName = result.winner.name || result.winner.email;
    const drawnDate = new Date(result.drawnAt).toLocaleDateString('es-AR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
    });

    return (
        <div style={{ minHeight: '100vh', background: '#000', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem', gap: '2rem' }}>

            <div style={{ textAlign: 'center' }}>
                <Image src={checkIcon} alt="Ganador" width={80} height={80} />
            </div>

            <div style={{ textAlign: 'center' }}>
                <p style={{ color: '#8BFF00', fontSize: '14px', fontWeight: 600, letterSpacing: '0.1em', marginBottom: '8px' }}>SORTEO FINALIZADO</p>
                <h1 style={{ fontSize: '28px', fontWeight: 700, marginBottom: '8px' }}>{result.productName}</h1>
                <p style={{ color: '#888', fontSize: '14px' }}>{drawnDate}</p>
            </div>

            <div style={{ background: '#111', borderRadius: '16px', padding: '24px', width: '100%', maxWidth: '360px', textAlign: 'center' }}>
                <p style={{ color: '#888', fontSize: '13px', marginBottom: '8px' }}>GANADOR</p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px' }}>
                    <Image src={ticketIcon} alt="Ticket" width={16} height={12} />
                    <p style={{ fontSize: '20px', fontWeight: 600 }}>{winnerName}</p>
                </div>
            </div>

            <button
                onClick={() => router.push('/')}
                style={{ background: '#8BFF00', color: '#000', border: 'none', borderRadius: '12px', padding: '14px 32px', fontWeight: 700, fontSize: '16px', cursor: 'pointer', width: '100%', maxWidth: '360px' }}
            >
                Volver al inicio
            </button>
        </div>
    );
};

export default DrawResultComponent;
