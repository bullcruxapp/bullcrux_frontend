'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface AdminComponentProps {
    token: string;
}

const AdminComponent = ({ token }: AdminComponentProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');

    const [form, setForm] = useState({
        title: '',
        productName: '',
        description: '',
        ticketPriceCoins: '',
        totalTickets: '',
        imageUrl: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const body: any = {
                title: form.title,
                productName: form.productName,
                description: form.description,
                ticketPriceCoins: parseInt(form.ticketPriceCoins),
                totalTickets: parseInt(form.totalTickets),
            };

            if (form.imageUrl) {
                body.productImages = [{ url: form.imageUrl, order: 0 }];
            }

            const response = await fetch(`${API_URL}/raffle`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error al crear el sorteo');
            }

            setSuccess(true);
            setForm({
                title: '',
                productName: '',
                description: '',
                ticketPriceCoins: '',
                totalTickets: '',
                imageUrl: '',
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '24px', fontWeight: 'bold' }}>Panel de Admin</h1>
                <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #555', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                    ← Volver
                </button>
            </div>

            <h2 style={{ fontSize: '18px', marginBottom: '16px' }}>Crear sorteo</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input
                    name="title"
                    placeholder="Título"
                    value={form.title}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff' }}
                />
                <input
                    name="productName"
                    placeholder="Nombre del producto"
                    value={form.productName}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff' }}
                />
                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={form.description}
                    onChange={handleChange}
                    rows={3}
                    style={{ padding: '12px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', resize: 'none' }}
                />
                <input
                    name="ticketPriceCoins"
                    placeholder="Precio del ticket (coins)"
                    type="number"
                    value={form.ticketPriceCoins}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff' }}
                />
                <input
                    name="totalTickets"
                    placeholder="Total de tickets"
                    type="number"
                    value={form.totalTickets}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff' }}
                />
                <input
                    name="imageUrl"
                    placeholder="URL de imagen (opcional)"
                    value={form.imageUrl}
                    onChange={handleChange}
                    style={{ padding: '12px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff' }}
                />

                {error && <p style={{ color: '#ff4444' }}>{error}</p>}
                {success && <p style={{ color: '#44ff44' }}>¡Sorteo creado exitosamente!</p>}

                <button
                    onClick={handleSubmit}
                    disabled={loading}
                    style={{ padding: '14px', borderRadius: '8px', background: '#ABDA53', color: '#000', fontWeight: 'bold', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}
                >
                    {loading ? 'Creando...' : 'Crear sorteo'}
                </button>
            </div>
        </div>
    );
};

export default AdminComponent;
