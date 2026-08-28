'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './faq-component.css';

interface FaqItem {
    question: string;
    answer: string;
}

const FAQ_ITEMS: FaqItem[] = [
    {
        question: '¿Qué es BullCrux?',
        answer: 'BullCrux es una plataforma donde participás en sorteos de productos reales (celulares, notebooks, autos, y más). Comprás participaciones con $BULL o las conseguís gratis viendo anuncios, y si tu número sale sorteado, ganás el premio.',
    },
    {
        question: '¿Qué son los $BULL?',
        answer: '$BULL son unidades digitales de uso interno de BullCrux. No son dinero, ni una criptomoneda, ni un instrumento de inversión — solo sirven para comprar participaciones dentro de la plataforma.',
    },
    {
        question: '¿Cómo consigo una participación gratis?',
        answer: 'Tocá "Obtener un ticket Gratis" en el sorteo que te interese, y mirá 5 anuncios cortos. Al completar los 5, se te acredita automáticamente una participación en ese sorteo, sin gastar $BULL. El progreso es específico de cada sorteo.',
    },
    {
        question: '¿Cómo compro $BULL?',
        answer: 'Desde "Cartera" podés comprar $BULL con MercadoPago (tarjeta, dinero en cuenta, etc.). Una vez acreditados, podés usarlos para comprar participaciones en cualquier sorteo activo.',
    },
    {
        question: '¿Cómo se elige al ganador?',
        answer: 'Cada participación tiene un número. Cuando un sorteo se completa (se agotan las participaciones o se cumple la condición para arrancar la cuenta regresiva), el sistema sortea un número ganador entre todos los participantes de ese sorteo.',
    },
    {
        question: '¿Cómo sé si gané?',
        answer: 'Si tu número sale sorteado, te contactamos por mail dentro de las 48 horas para coordinar la entrega del premio. También vas a ver el resultado en la sección "Finalizados" del sitio.',
    },
    {
        question: '¿Dónde veo mis números de participación?',
        answer: 'En "Favoritos" → pestaña "Mis Participaciones" vas a ver todos los sorteos en los que estás participando, con cada uno de tus números. También te los mandamos por mail apenas se confirma tu participación.',
    },
    {
        question: '¿Puedo participar más de una vez en el mismo sorteo?',
        answer: 'Sí, comprando más participaciones — cada una suma un número nuevo y más chances de ganar. La participación gratuita por anuncios es una sola vez por sorteo, no acumulable.',
    },
    {
        question: '¿Es seguro y legal?',
        answer: 'Sí. Podés leer el detalle completo de cómo tratamos tus datos y el funcionamiento de $BULL en nuestra Política de Privacidad.',
    },
];

const FaqComponent = () => {
    const router = useRouter();
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    const toggle = (index: number) => {
        setOpenIndex(prev => (prev === index ? null : index));
    };

    return (
        <div className="faq-container">
            <div className="faq-header">
                <button className="faq-back-button" onClick={() => router.back()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="faq-title">Cómo funciona</h1>
                <div style={{ width: '24px' }} />
            </div>

            <div className="faq-content">
                {FAQ_ITEMS.map((item, index) => {
                    const isOpen = openIndex === index;
                    return (
                        <div key={index} className={`faq-item ${isOpen ? 'open' : ''}`}>
                            <button className="faq-question" onClick={() => toggle(index)}>
                                <span>{item.question}</span>
                                <svg
                                    className="faq-chevron"
                                    width="18" height="18" viewBox="0 0 24 24" fill="none"
                                >
                                    <path d="M6 9L12 15L18 9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            </button>
                            {isOpen && <p className="faq-answer">{item.answer}</p>}
                        </div>
                    );
                })}

                <p className="faq-footer-note">
                    ¿Todavía tenés dudas? Escribinos y te ayudamos —{' '}
                    <a href="/perfil/privacidad">ver Política de Privacidad</a>
                </p>
            </div>
        </div>
    );
};

export default FaqComponent;
