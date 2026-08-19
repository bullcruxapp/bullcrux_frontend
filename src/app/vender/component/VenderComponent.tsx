'use client'

import { useState } from 'react';
import { joinWaitlist } from '@/services/waitlist.service';

const SF_PRO = '-apple-system, "SF Pro", "SF Pro Display", BlinkMacSystemFont, "Segoe UI", system-ui, sans-serif';

const VenderComponent = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
    const [errorMsg, setErrorMsg] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (status === 'loading') return;
        setStatus('loading');
        setErrorMsg('');
        try {
            await joinWaitlist(email);
            setStatus('success');
        } catch (err: any) {
            setErrorMsg(err.message || 'Algo salió mal, probá de nuevo');
            setStatus('error');
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            background: '#101014',
            color: '#fafafa',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '24px',
            fontFamily: SF_PRO,
        }}>
            <div style={{ width: '100%', maxWidth: '440px', textAlign: 'center' }}>
                <div style={{
                    width: '56px',
                    height: '56px',
                    borderRadius: '16px',
                    background: 'rgba(133, 239, 172, 0.12)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 24px',
                    fontSize: '26px',
                }}>
                    🏷️
                </div>

                <h1 style={{ fontSize: '28px', fontWeight: 800, margin: '0 0 12px', letterSpacing: '-0.02em' }}>
                    Publicá tus propios sorteos
                </h1>
                <p style={{ fontSize: '15px', color: '#a0a3a7', lineHeight: 1.5, margin: '0 0 32px' }}>
                    Todavía no está abierto para todos. Dejanos tu email y te avisamos apenas puedas empezar a publicar productos en BullCrux.
                </p>

                {status === 'success' ? (
                    <div style={{
                        background: 'rgba(133, 239, 172, 0.1)',
                        border: '1px solid rgba(133, 239, 172, 0.3)',
                        borderRadius: '14px',
                        padding: '20px',
                    }}>
                        <p style={{ fontSize: '15px', fontWeight: 700, color: '#85efac', margin: 0 }}>
                            ¡Listo, ya estás anotado! 🎉
                        </p>
                        <p style={{ fontSize: '13px', color: '#a0a3a7', margin: '6px 0 0' }}>
                            Te vamos a avisar por mail apenas se habilite.
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="tu@email.com"
                            style={{
                                width: '100%',
                                padding: '14px 16px',
                                borderRadius: '12px',
                                border: '1px solid #272a2d',
                                background: '#18181c',
                                color: '#fafafa',
                                fontSize: '15px',
                                fontFamily: SF_PRO,
                                outline: 'none',
                                boxSizing: 'border-box',
                            }}
                        />
                        <button
                            type="submit"
                            disabled={status === 'loading'}
                            style={{
                                width: '100%',
                                padding: '14px',
                                borderRadius: '12px',
                                border: 'none',
                                background: '#85efac',
                                color: '#101014',
                                fontSize: '15px',
                                fontWeight: 700,
                                cursor: status === 'loading' ? 'not-allowed' : 'pointer',
                                opacity: status === 'loading' ? 0.7 : 1,
                                fontFamily: SF_PRO,
                            }}
                        >
                            {status === 'loading' ? 'Anotando...' : 'Avisame cuando esté disponible'}
                        </button>
                        {status === 'error' && (
                            <p style={{ fontSize: '13px', color: '#ff6b6b', margin: 0 }}>{errorMsg}</p>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
};

export default VenderComponent;
