'use client'

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

interface ProductImage {
    url: string;
    order: number;
}

interface Raffle {
    id: string;
    title: string;
    productName: string;
    description: string;
    ticketPriceCoins: number;
    totalTickets: number;
    ticketsSold: number;
    status: string;
    featured: boolean;
    productImages: ProductImage[];
}

interface AdminComponentProps {
    token: string;
}

const emptyForm = {
    title: '',
    productName: '',
    description: '',
    ticketPriceCoins: '',
    totalTickets: '',
    imageUrl: '',
    featured: false,
};

const AdminComponent = ({ token }: AdminComponentProps) => {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [raffles, setRaffles] = useState<Raffle[]>([]);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [form, setForm] = useState(emptyForm);

    const fetchRaffles = async () => {
        try {
            const res = await fetch(`${API_URL}/raffle`);
            const data = await res.json();
            setRaffles(data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => {
        fetchRaffles();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleEdit = (raffle: Raffle) => {
        setEditingId(raffle.id);
        setForm({
            title: raffle.title,
            productName: raffle.productName,
            description: raffle.description || '',
            ticketPriceCoins: String(raffle.ticketPriceCoins),
            totalTickets: String(raffle.totalTickets),
            imageUrl: raffle.productImages?.[0]?.url || '',
            featured: raffle.featured || false,
        });
        window.scrollTo(0, 0);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Seguro que querés eliminar este sorteo?')) return;
        try {
            const res = await fetch(`${API_URL}/raffle/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            if (res.ok) {
                setSuccess('Sorteo eliminado');
                fetchRaffles();
            } else {
                setError('Error al eliminar');
            }
        } catch (e) {
            setError('Error al eliminar');
        }
    };

    const handleToggleFeatured = async (raffle: Raffle) => {
        try {
            const res = await fetch(`${API_URL}/raffle/${raffle.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({ ...raffle, featured: !raffle.featured }),
            });
            if (res.ok) {
                fetchRaffles();
            }
        } catch (e) {
            console.error(e);
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async () => {
        setLoading(true);
        setError('');
        setSuccess('');

        try {
            const body: any = {
                title: form.title,
                productName: form.productName,
                description: form.description,
                ticketPriceCoins: parseInt(form.ticketPriceCoins),
                totalTickets: parseInt(form.totalTickets),
                featured: form.featured,
            };

            if (form.imageUrl) {
                body.productImages = [{ url: form.imageUrl, order: 0 }];
            }

            const url = editingId ? `${API_URL}/raffle/${editingId}` : `${API_URL}/raffle`;
            const method = editingId ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify(body),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Error');
            }

            setSuccess(editingId ? '¡Sorteo actualizado!' : '¡Sorteo creado!');
            setForm(emptyForm);
            setEditingId(null);
            fetchRaffles();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const inputStyle = { padding: '12px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' as const };

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '500', margin: 0 }}>Panel de admin</h1>
                <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #555', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>
                    ← Volver
                </button>
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>
                {editingId ? 'Editar sorteo' : 'Crear sorteo'}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input name="title" placeholder="Título" value={form.title} onChange={handleChange} style={inputStyle} />
                <input name="productName" placeholder="Nombre del producto" value={form.productName} onChange={handleChange} style={inputStyle} />
                <textarea name="description" placeholder="Descripción corta (aparece en Rey del Ticket)" value={form.description} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'none' }} />
                <input name="ticketPriceCoins" placeholder="Precio del ticket (coins)" type="number" value={form.ticketPriceCoins} onChange={handleChange} style={inputStyle} />
                <input name="totalTickets" placeholder="Total de tickets" type="number" value={form.totalTickets} onChange={handleChange} style={inputStyle} />
                <input name="imageUrl" placeholder="URL de imagen (ej: https://i.imgur.com/xxx.jpg)" value={form.imageUrl} onChange={handleChange} style={inputStyle} />

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}>
                    <input
                        type="checkbox"
                        id="featured"
                        checked={form.featured}
                        onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                        style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                    />
                    <label htmlFor="featured" style={{ cursor: 'pointer', fontSize: '14px' }}>
                        ⭐ Destacar en Rey del Ticket
                    </label>
                </div>

                {error && <p style={{ color: '#ff4444', margin: 0 }}>{error}</p>}
                {success && <p style={{ color: '#44ff44', margin: 0 }}>{success}</p>}

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '14px', borderRadius: '8px', background: '#ABDA53', color: '#000', fontWeight: '500', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear sorteo'}
                    </button>
                    {editingId && (
                        <button onClick={handleCancel} style={{ padding: '14px 20px', borderRadius: '8px', background: 'none', border: '1px solid #555', color: '#fff', cursor: 'pointer' }}>
                            Cancelar
                        </button>
                    )}
                </div>
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: '500', margin: '32px 0 16px' }}>Sorteos existentes</h2>

            {raffles.length === 0 ? (
                <p style={{ color: '#666' }}>No hay sorteos.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {raffles.map(raffle => (
                        <div key={raffle.id} style={{ background: '#1a1a1a', border: `1px solid ${raffle.featured ? '#ABDA53' : '#333'}`, borderRadius: '8px', padding: '16px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                        <p style={{ margin: 0, fontWeight: '500' }}>{raffle.title}</p>
                                        {raffle.featured && <span style={{ fontSize: '11px', color: '#ABDA53', border: '1px solid #ABDA53', borderRadius: '4px', padding: '1px 6px' }}>REY DEL TICKET</span>}
                                    </div>
                                    <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#aaa' }}>{raffle.ticketsSold}/{raffle.totalTickets} tickets · C$ {raffle.ticketPriceCoins}</p>
                                    <p style={{ margin: 0, fontSize: '12px', color: raffle.status === 'OPEN' ? '#ABDA53' : '#888' }}>{raffle.status}</p>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end' }}>
                                    <button
                                        onClick={() => handleToggleFeatured(raffle)}
                                        style={{ padding: '6px 10px', borderRadius: '6px', background: raffle.featured ? '#ABDA53' : 'none', border: `1px solid ${raffle.featured ? '#ABDA53' : '#555'}`, color: raffle.featured ? '#000' : '#fff', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        ⭐ {raffle.featured ? 'Destacado' : 'Destacar'}
                                    </button>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <button onClick={() => handleEdit(raffle)} style={{ padding: '6px 10px', borderRadius: '6px', background: 'none', border: '1px solid #555', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>
                                            Editar
                                        </button>
                                        <button onClick={() => handleDelete(raffle.id)} style={{ padding: '6px 10px', borderRadius: '6px', background: 'none', border: '1px solid #ff4444', color: '#ff4444', cursor: 'pointer', fontSize: '12px' }}>
                                            Eliminar
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default AdminComponent;
