'use client'

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import searchIcon from '../../../images/icons/search-icon.svg';
import './perfil-component.css';

interface PerfilComponentProps {
}

const PerfilComponent = (props: PerfilComponentProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Obtener nombre del usuario desde la sesión
    const userName = session?.user?.name || session?.user?.email || 'Usuario';
    const userImage = session?.user?.image || null;

    // Cerrar dropdown al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        if (isDropdownOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isDropdownOpen]);

    const handleToggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    const handleSignOut = async () => {
        await signOut({
            redirect: false,
            callbackUrl: '/login'
        });
        router.push('/login');
    };

    return (
        <div className="perfil-container">
            <div className="header flex justify-between items-center">
                {/* Perfil del usuario */}
                <div className="user-profile-container" ref={dropdownRef}>
                    <div className="user-profile" onClick={handleToggleDropdown}>
                        {userImage ? (
                            <Image
                                src={userImage}
                                alt="User profile"
                                width={40}
                                height={40}
                                className="profile-image"
                            />
                        ) : (
                            <div className="profile-image-placeholder">
                                {userName.charAt(0).toUpperCase()}
                            </div>
                        )}
                        <span className="user-name">{userName}</span>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 16 16"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                            className={`chevron-icon ${isDropdownOpen ? 'open' : ''}`}
                        >
                            <path d="M6 12L10 8L6 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                    </div>
                    {/* Dropdown menu */}
                    {isDropdownOpen && (
                        <div className="user-dropdown">
                            <button
                                className="dropdown-item"
                                onClick={handleSignOut}
                            >
                                Cerrar sesión
                            </button>
                        </div>
                    )}
                </div>
                {/* Search input */}
                <div className="search-input">
                    <Image src={searchIcon} alt="Search icon" width={18} height={18} />
                </div>
            </div>

            <div className="perfil-content">
                {/* Contenido del perfil */}
            </div>
        </div>
    )
}

export default PerfilComponent
