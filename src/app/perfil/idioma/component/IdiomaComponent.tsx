'use client'

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import './idioma-component.css';

interface IdiomaComponentProps {
}

const IdiomaComponent = (props: IdiomaComponentProps) => {
    const router = useRouter();
    const [selectedLanguage, setSelectedLanguage] = useState('Español Latinoamérica');
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const languages = [
        'Español Latinoamérica',
        'Español España',
        'English',
        'Português',
        'Français',
    ];

    const handleBack = () => {
        router.back();
    };

    const handleLanguageSelect = (language: string) => {
        setSelectedLanguage(language);
        setIsDropdownOpen(false);
        // Aquí iría la llamada a la API para guardar el idioma seleccionado
        console.log('Idioma seleccionado:', language);
    };

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

    return (
        <div className="idioma-container">
            {/* Header con flecha de volver y título */}
            <div className="idioma-header">
                <button className="idioma-back-button" onClick={handleBack}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M15 18L9 12L15 6" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <h1 className="idioma-title">Idioma</h1>
                <div style={{ width: '24px' }}></div> {/* Spacer para centrar el título */}
            </div>

            {/* Selector de idioma */}
            <div className="idioma-selector-wrapper" ref={dropdownRef}>
                <button
                    type="button"
                    className="idioma-selector"
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                >
                    <span className="idioma-selected-text">{selectedLanguage}</span>
                    <svg
                        width="16"
                        height="16"
                        viewBox="0 0 16 16"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                        className={`idioma-chevron ${isDropdownOpen ? 'open' : ''}`}
                    >
                        <path d="M4 6L8 10L12 6" stroke="#626262" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                </button>
                <div className="idioma-separator"></div>

                {/* Dropdown de idiomas */}
                {isDropdownOpen && (
                    <div className="idioma-dropdown">
                        {languages.map((language) => (
                            <button
                                key={language}
                                type="button"
                                className={`idioma-option ${selectedLanguage === language ? 'selected' : ''}`}
                                onClick={() => handleLanguageSelect(language)}
                            >
                                {language}
                            </button>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}

export default IdiomaComponent
