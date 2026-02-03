'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import './contrasena-component.css';

interface ContrasenaComponentProps {
}

const ContrasenaComponent = (props: ContrasenaComponentProps) => {
    const router = useRouter();
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showOldPassword, setShowOldPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(true);
    const [showConfirmPassword, setShowConfirmPassword] = useState(true);

    const handleBack = () => {
        router.back();
    };

    const handleChangePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        
        // Validaciones
        if (!oldPassword || !newPassword || !confirmPassword) {
            alert('Por favor completa todos los campos');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('Las contraseñas no coinciden');
            return;
        }

        if (newPassword.length < 8) {
            alert('La nueva contraseña debe tener al menos 8 caracteres');
            return;
        }

        // Aquí iría la llamada a la API para cambiar la contraseña
        console.log('Cambiar contraseña:', { oldPassword, newPassword });
        
        // Por ahora solo mostramos un mensaje
        alert('Contraseña cambiada exitosamente');
        router.back();
    };

    return (
        <div className="contrasena-container">
            {/* Header con flecha de volver y título */}
            <div className="contrasena-header">
                <button className="contrasena-back-button" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="contrasena-title">Contraseña</h1>
                <div style={{ width: '24px' }}></div> {/* Spacer para centrar el título */}
            </div>

            {/* Formulario de cambio de contraseña */}
            <form className="contrasena-form" onSubmit={handleChangePassword}>
                {/* Campo: Antigua contraseña */}
                <div className="contrasena-field">
                    <label className="contrasena-label">Antigua contraseña</label>
                    <div className="contrasena-input-container">
                        <input
                            type={showOldPassword ? 'text' : 'password'}
                            className="contrasena-input"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                            placeholder="Ingresa tu contraseña actual"
                        />
                        <button
                            type="button"
                            className="contrasena-toggle-button"
                            onClick={() => setShowOldPassword(!showOldPassword)}
                        >
                            {showOldPassword ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 2.5L17.5 17.5M8.33333 8.33333C7.89131 8.77535 7.5 9.44102 7.5 10C7.5 10.8284 8.17157 11.5 9 11.5C9.55898 11.5 10.2247 11.1087 10.6667 10.6667M5.83333 5.83333C4.66667 6.66667 3.33333 8.33333 2.5 10C3.33333 11.6667 4.66667 13.3333 5.83333 14.1667C7 15 8.33333 15.4167 10 15.4167C11.6667 15.4167 13 15 14.1667 14.1667L5.83333 5.83333ZM14.1667 14.1667C15.3333 13.3333 16.6667 11.6667 17.5 10C16.6667 8.33333 15.3333 6.66667 14.1667 5.83333C13 5 11.6667 4.58333 10 4.58333C8.33333 4.58333 7 5 5.83333 5.83333" stroke="#949596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 10C2.5 10 5.83333 4.58333 10 4.58333C14.1667 4.58333 17.5 10 17.5 10C17.5 10 14.1667 15.4167 10 15.4167C5.83333 15.4167 2.5 10 2.5 10Z" stroke="#949596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#949596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="contrasena-separator"></div>
                </div>

                {/* Campo: Nueva contraseña */}
                <div className="contrasena-field">
                    <label className="contrasena-label">Nueva contraseña</label>
                    <div className="contrasena-input-container">
                        <input
                            type={showNewPassword ? 'text' : 'password'}
                            className="contrasena-input"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Ingresa tu nueva contraseña"
                        />
                        <button
                            type="button"
                            className="contrasena-toggle-button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                        >
                            {showNewPassword ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 2.5L17.5 17.5M8.33333 8.33333C7.89131 8.77535 7.5 9.44102 7.5 10C7.5 10.8284 8.17157 11.5 9 11.5C9.55898 11.5 10.2247 11.1087 10.6667 10.6667M5.83333 5.83333C4.66667 6.66667 3.33333 8.33333 2.5 10C3.33333 11.6667 4.66667 13.3333 5.83333 14.1667C7 15 8.33333 15.4167 10 15.4167C11.6667 15.4167 13 15 14.1667 14.1667L5.83333 5.83333ZM14.1667 14.1667C15.3333 13.3333 16.6667 11.6667 17.5 10C16.6667 8.33333 15.3333 6.66667 14.1667 5.83333C13 5 11.6667 4.58333 10 4.58333C8.33333 4.58333 7 5 5.83333 5.83333" stroke="#949596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 10C2.5 10 5.83333 4.58333 10 4.58333C14.1667 4.58333 17.5 10 17.5 10C17.5 10 14.1667 15.4167 10 15.4167C5.83333 15.4167 2.5 10 2.5 10Z" stroke="#949596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#949596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="contrasena-separator"></div>
                </div>

                {/* Campo: Confirmar nueva contraseña */}
                <div className="contrasena-field">
                    <label className="contrasena-label">Confirmar nueva contraseña</label>
                    <div className="contrasena-input-container">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            className="contrasena-input"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Confirma tu nueva contraseña"
                        />
                        <button
                            type="button"
                            className="contrasena-toggle-button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                            {showConfirmPassword ? (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 2.5L17.5 17.5M8.33333 8.33333C7.89131 8.77535 7.5 9.44102 7.5 10C7.5 10.8284 8.17157 11.5 9 11.5C9.55898 11.5 10.2247 11.1087 10.6667 10.6667M5.83333 5.83333C4.66667 6.66667 3.33333 8.33333 2.5 10C3.33333 11.6667 4.66667 13.3333 5.83333 14.1667C7 15 8.33333 15.4167 10 15.4167C11.6667 15.4167 13 15 14.1667 14.1667L5.83333 5.83333ZM14.1667 14.1667C15.3333 13.3333 16.6667 11.6667 17.5 10C16.6667 8.33333 15.3333 6.66667 14.1667 5.83333C13 5 11.6667 4.58333 10 4.58333C8.33333 4.58333 7 5 5.83333 5.83333" stroke="#949596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            ) : (
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M2.5 10C2.5 10 5.83333 4.58333 10 4.58333C14.1667 4.58333 17.5 10 17.5 10C17.5 10 14.1667 15.4167 10 15.4167C5.83333 15.4167 2.5 10 2.5 10Z" stroke="#949596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                    <path d="M10 12.5C11.3807 12.5 12.5 11.3807 12.5 10C12.5 8.61929 11.3807 7.5 10 7.5C8.61929 7.5 7.5 8.61929 7.5 10C7.5 11.3807 8.61929 12.5 10 12.5Z" stroke="#949596" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                            )}
                        </button>
                    </div>
                    <div className="contrasena-separator"></div>
                </div>

                {/* Botón de cambiar contraseña */}
                <button type="submit" className="contrasena-submit-button">
                    Cambiar contraseña
                </button>
            </form>
        </div>
    )
}

export default ContrasenaComponent
