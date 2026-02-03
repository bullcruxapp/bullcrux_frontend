'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './notificaciones-component.css';

interface NotificacionesComponentProps {
}

const NotificacionesComponent = (props: NotificacionesComponentProps) => {
    const router = useRouter();
    const [notificationsEnabled, setNotificationsEnabled] = useState(false);

    const handleBack = () => {
        router.back();
    };

    const handleToggleNotifications = () => {
        setNotificationsEnabled(!notificationsEnabled);
        // Aquí iría la llamada a la API para guardar la preferencia
        console.log('Notificaciones:', !notificationsEnabled ? 'activadas' : 'desactivadas');
    };

    return (
        <div className="notificaciones-container">
            {/* Header con flecha de volver y título */}
            <div className="notificaciones-header">
                <button className="notificaciones-back-button" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="notificaciones-title">Notificaciones</h1>
                <div style={{ width: '24px' }}></div> {/* Spacer para centrar el título */}
            </div>

            {/* Opción de activar notificaciones */}
            <div className="notificaciones-option">
                <label className="notificaciones-label">¿Activar notificaciones?</label>
                <button
                    type="button"
                    className={`notificaciones-toggle ${notificationsEnabled ? 'active' : ''}`}
                    onClick={handleToggleNotifications}
                    aria-label={notificationsEnabled ? 'Desactivar notificaciones' : 'Activar notificaciones'}
                >
                    <span className="notificaciones-toggle-slider"></span>
                </button>
            </div>
        </div>
    )
}

export default NotificacionesComponent
