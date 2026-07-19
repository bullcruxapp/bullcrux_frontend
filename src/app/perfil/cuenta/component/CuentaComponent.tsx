'use client'

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './cuenta-component.css';

import flagArg from '@/images/icons/flag-arg.png';

const CuentaComponent = () => {
    const { data: session } = useSession();
    const router = useRouter();

    const userName = session?.user?.name || 'Usuario';
    const userEmail = session?.user?.email || '';
    const userPhone = (session?.user as any)?.phone || null;
    const isPhoneVerified = !!userPhone;

    return (
        <div className="cuenta-container">
            <div className="cuenta-header">
                <button className="cuenta-back-button" onClick={() => router.back()}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="cuenta-title">Cuenta</h1>
                <div style={{ width: '24px' }}></div>
            </div>

            <div className="cuenta-info-section">
                <div className="cuenta-field">
                    <label className="cuenta-label">Nombre de usuario</label>
                    <div className="cuenta-value-container">
                        <span className="cuenta-value">{userName}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="cuenta-check-icon">
                            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="cuenta-separator"></div>
                </div>

                <div className="cuenta-field">
                    <label className="cuenta-label">Email</label>
                    <div className="cuenta-value-container">
                        <span className="cuenta-value">{userEmail}</span>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className="cuenta-check-icon">
                            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="cuenta-separator"></div>
                </div>

                <div className="cuenta-field">
                    <label className="cuenta-label">Número de celular</label>
                    <div className="cuenta-phone-container">
                        {isPhoneVerified ? (
                            <>
                                <div className="cuenta-phone-flag">
                                    <Image src={flagArg} alt="AR" width={24} height={18} className="cuenta-phone-flag-img" />
                                </div>
                                <span className="cuenta-value">{userPhone}</span>
                                <span className="cuenta-verified-badge">Verificado</span>
                            </>
                        ) : (
                            <>
                                <span className="cuenta-value" style={{ color: '#888' }}>Sin agregar</span>
                                <span className="cuenta-verified-badge" style={{ background: '#444', color: '#aaa' }}>Sin verificar</span>
                            </>
                        )}
                    </div>
                    <div className="cuenta-separator"></div>
                </div>
            </div>
        </div>
    );
};

export default CuentaComponent;
