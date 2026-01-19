'use client'

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import searchIcon from '../../../images/icons/search-icon.svg';
import RaffleLargeComponent from '../../../components/RaffleLargeComponent';
import macbookImage from '../../../images/macbook.jpg';
import './favoritos-component.css';

interface FavoritosComponentProps {
}

const FavoritosComponent = (props: FavoritosComponentProps) => {
    const { data: session } = useSession();
    const router = useRouter();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'favoritos' | 'mis-sorteos'>('favoritos');
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
        <div className="favoritos-container">
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

            {/* Tabs */}
            <div className="tabs-container">
                <button
                    className={`tab-item ${activeTab === 'favoritos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('favoritos')}
                >
                    Favoritos
                </button>
                <button
                    className={`tab-item ${activeTab === 'mis-sorteos' ? 'active' : ''}`}
                    onClick={() => setActiveTab('mis-sorteos')}
                >
                    Mis Sorteos
                </button>
            </div>

            <div className="favoritos-content">
                {activeTab === 'favoritos' ? (
                    <div className="raffle-large-container">
                        <RaffleLargeComponent
                            image={macbookImage}
                            title="Apple Macbook Pro 2019"
                            progress={65}
                            price="C$1.200.000"
                            onFreeTicketClick={() => console.log('Free ticket clicked')}
                            productId="macbook-pro-2019"
                            isFavoritesView={true}
                            available="150 Disponibles"
                            progressText="23/127"
                        />
                    </div>
                ) : (
                    <>
                        <h1>Mis Sorteos</h1>
                        {/* Aquí irá el contenido de mis sorteos */}
                    </>
                )}
            </div>
        </div>
    )
}

export default FavoritosComponent
