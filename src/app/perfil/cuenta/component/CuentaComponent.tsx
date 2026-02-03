'use client'

import Image from 'next/image';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './cuenta-component.css';

import flagArg from '../../../../images/icons/flag-arg.png';

interface CuentaComponentProps {
}

const CuentaComponent = (props: CuentaComponentProps) => {
    const { data: session } = useSession();
    const router = useRouter();

    // Obtener datos del usuario desde la sesión
    const userName = session?.user?.name || 'NicolasCruz';
    const userEmail = session?.user?.email || 'test@gmail.com';
    const userPhone = '+54 11 22846510'; // Por ahora estático, luego vendrá de la sesión o API

    const handleBack = () => {
        router.back();
    };

    return (
        <div className="cuenta-container">
            {/* Header con flecha de volver y título */}
            <div className="cuenta-header">
                <button className="cuenta-back-button" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="cuenta-title">Cuenta</h1>
                <div style={{ width: '24px' }}></div> {/* Spacer para centrar el título */}
            </div>

            {/* Información del usuario */}
            <div className="cuenta-info-section">
                {/* Nombre de usuario */}
                <div className="cuenta-field">
                    <label className="cuenta-label">Nombre de usuario</label>
                    <div className="cuenta-value-container">
                        <span className="cuenta-value">{userName}</span>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cuenta-check-icon"
                        >
                            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="cuenta-separator"></div>
                </div>

                {/* Email */}
                <div className="cuenta-field">
                    <label className="cuenta-label">Email</label>
                    <div className="cuenta-value-container">
                        <span className="cuenta-value">{userEmail}</span>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className="cuenta-check-icon"
                        >
                            <path d="M13.3333 4L6 11.3333L2.66667 8" stroke="#34C759" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    <div className="cuenta-separator"></div>
                </div>

                {/* Número de celular */}
                <div className="cuenta-field">
                    <label className="cuenta-label">Número de celular</label>
                    <div className="cuenta-phone-container">
                        <div className="cuenta-phone-flag">
                            <Image src={flagArg} alt="AR" width={24} height={18} className="cuenta-phone-flag-img" />
                        </div>
                        <span className="cuenta-value">{userPhone}</span>
                        <span className="cuenta-verified-badge">Verificado</span>
                    </div>
                    <div className="cuenta-separator"></div>
                </div>
            </div>
        </div>
    )
}

export default CuentaComponent
