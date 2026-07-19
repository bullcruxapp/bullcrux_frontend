'use client'

import Image from 'next/image';
import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import './cuenta-component.css';

import flagArg from '@/images/icons/flag-arg.png';

const CuentaComponent = () => {
    const { data: session } = useSession();
    const router = useRouter();
    const [phone, setPhone] = useState<string | null>(null);
    const [editing, setEditing] = useState(false);
    const [phoneInput, setPhoneInput] = useState('');
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');

    const userName = session?.user?.name || 'Usuario';
    const userEmail = session?.user?.email || '';

    useEffect(() => {
        const fetchUser = async () => {
            if (!session?.user?.email) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile?email=${encodeURIComponent(session.user.email)}`, {
                    headers: { 'Authorization': `Bearer ${(session as any).accessToken}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setPhone(data.phone || null);
                    setPhoneInput(data.phone || '');
                }
            } catch (e) { console.error(e); }
        };
        fetchUser();
    }, [session]);

    const handleSavePhone = async () => {
        if (!phoneInput.trim()) return;
        setSaving(true);
        setMessage('');
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/phone`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${(session as any).accessToken}`
                },
                body: JSON.stringify({ phone: phoneInput.trim() })
            });
            if (!res.ok) throw new Error('Error al guardar');
            setPhone(phoneInput.trim());
            setEditing(false);
            setMessage('Teléfono guardado');
            setTimeout(() => setMessage(''), 2000);
        } catch (e) {
            setMessage('Error al guardar');
        } finally {
            setSaving(false);
        }
    };

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

                    {editing ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '8px 0' }}>
                            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                                <div className="cuenta-phone-flag">
                                    <Image src={flagArg} alt="AR" width={24} height={18} className="cuenta-phone-flag-img" />
                                </div>
                                <input
                                    type="tel"
                                    value={phoneInput}
                                    onChange={(e) => setPhoneInput(e.target.value)}
                                    placeholder="+54 11 1234 5678"
                                    style={{ flex: 1, background: '#1a1a1a', border: '1px solid #333', color: '#fff', padding: '10px', borderRadius: '8px', fontSize: '14px', outline: 'none' }}
                                />
                            </div>
                            <div style={{ display: 'flex', gap: '8px' }}>
                                <button
                                    onClick={handleSavePhone}
                                    disabled={saving}
                                    style={{ flex: 1, padding: '10px', background: '#ABDA53', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1 }}
                                >
                                    {saving ? 'Guardando...' : 'Guardar'}
                                </button>
                                <button
                                    onClick={() => { setEditing(false); setPhoneInput(phone || ''); }}
                                    style={{ padding: '10px 16px', background: 'none', border: '1px solid #555', color: '#fff', borderRadius: '8px', cursor: 'pointer' }}
                                >
                                    Cancelar
                                </button>
                            </div>
                            {message && <p style={{ margin: 0, fontSize: '12px', color: message.includes('Error') ? '#ff4444' : '#ABDA53' }}>{message}</p>}
                        </div>
                    ) : (
                        <div className="cuenta-phone-container" onClick={() => setEditing(true)} style={{ cursor: 'pointer' }}>
                            {phone ? (
                                <>
                                    <div className="cuenta-phone-flag">
                                        <Image src={flagArg} alt="AR" width={24} height={18} className="cuenta-phone-flag-img" />
                                    </div>
                                    <span className="cuenta-value">{phone}</span>
                                    <span className="cuenta-verified-badge" style={{ background: '#ABDA53', color: '#000', cursor: 'pointer' }}>Cambiar</span>
                                </>
                            ) : (
                                <>
                                    <span className="cuenta-value" style={{ color: '#888' }}>Tocá para agregar</span>
                                    <span className="cuenta-verified-badge" style={{ background: '#ABDA53', color: '#000', cursor: 'pointer' }}>Cambiar</span>
                                </>
                            )}
                        </div>
                    )}
                    <div className="cuenta-separator"></div>
                </div>
            </div>
        </div>
    );
};

export default CuentaComponent;
