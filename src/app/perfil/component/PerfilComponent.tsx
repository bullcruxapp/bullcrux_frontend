'use client'

import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './perfil-component.css';

import cuentaIcon from '../../../images/icons/cuenta.png';
import contrasenaIcon from '../../../images/icons/contrasena.png';
import politicasIcon from '../../../images/icons/politicas.png';
import notificacionesIcon from '../../../images/icons/notificaciones.png';
import idiomaIcon from '../../../images/icons/idioma.png';

interface PerfilComponentProps {
}

const PerfilComponent = (props: PerfilComponentProps) => {
    const { data: session } = useSession();
    const router = useRouter();

    // Obtener nombre del usuario desde la sesión
    const userName = session?.user?.name || session?.user?.email || 'Usuario';
    const userImage = session?.user?.image || null;

    const handleBack = () => {
        router.back();
    };

    const handleSignOut = async () => {
        await signOut({
            redirect: false,
            callbackUrl: '/login'
        });
        router.push('/login');
    };

    const menuItems = [
        { id: 'cuenta', label: 'Cuenta', icon: cuentaIcon },
        { id: 'contraseña', label: 'Contraseña', icon: contrasenaIcon },
        { id: 'privacidad', label: 'Política de privacidad', icon: politicasIcon },
        { id: 'notificaciones', label: 'Notificaciones', icon: notificacionesIcon },
        { id: 'idioma', label: 'Idioma', icon: idiomaIcon },
    ];

    const handleMenuItemClick = (itemId: string) => {
        if (itemId === 'cuenta') {
            router.push('/perfil/cuenta');
        } else if (itemId === 'contraseña') {
            router.push('/perfil/contrasena');
        } else if (itemId === 'privacidad') {
            router.push('/perfil/privacidad');
        } else if (itemId === 'notificaciones') {
            router.push('/perfil/notificaciones');
        } else if (itemId === 'idioma') {
            router.push('/perfil/idioma');
        }
    };

    return (
        <div className="perfil-container">
            {/* Header con flecha de volver y título */}
            <div className="perfil-header">
                <button className="perfil-back-button" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="perfil-title">Perfil</h1>
                <div style={{ width: '24px' }}></div> {/* Spacer para centrar el título */}
            </div>

            {/* Información del usuario */}
            <div className="perfil-user-info">
                {userImage ? (
                    <Image
                        src={userImage}
                        alt="User profile"
                        width={80}
                        height={80}
                        className="perfil-user-image"
                    />
                ) : (
                    <div className="perfil-user-image-placeholder">
                        {userName.charAt(0).toUpperCase()}
                    </div>
                )}
                <h2 className="perfil-greeting">Hola {userName.split(' ')[0]}!</h2>
            </div>

            {/* Lista de opciones del menú */}
            <div className="perfil-menu-list">
                {menuItems.map((item, index) => (
                    <div key={item.id}>
                        <button
                            className="perfil-menu-item"
                            onClick={() => handleMenuItemClick(item.id)}
                        >
                            <span className="perfil-menu-icon">
                                <img src={item.icon.src} alt="" width={8} height={8} className="perfil-menu-icon-img" />
                            </span>
                            <span className="perfil-menu-label">{item.label}</span>
                            <svg
                                width="16"
                                height="16"
                                viewBox="0 0 16 16"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="perfil-menu-arrow"
                            >
                                <path d="M6 12L10 8L6 4" stroke="#626262" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                            </svg>
                        </button>
                        {index < menuItems.length - 1 && <div className="perfil-menu-separator"></div>}
                    </div>
                ))}
            </div>

            {/* Botón de cerrar sesión */}
            <button className="perfil-logout-button" onClick={handleSignOut}>
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="perfil-logout-icon"
                >
                    <path d="M7.5 17.5H4.16667C3.72464 17.5 3.30072 17.3244 2.98816 17.0118C2.67559 16.6993 2.5 16.2754 2.5 15.8333V4.16667C2.5 3.72464 2.67559 3.30072 2.98816 2.98816C3.30072 2.67559 3.72464 2.5 4.16667 2.5H7.5M13.3333 14.1667L17.5 10M17.5 10L13.3333 5.83333M17.5 10H7.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Cerrar sesión</span>
            </button>
        </div>
    )
}

export default PerfilComponent
