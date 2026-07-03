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

interface Participant {
    id: string;
    number: number;
    source: string;
    purchasedAt: string;
    user: {
        id: string;
        name: string;
        email: string;
        image?: string;
    };
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
    const [participantsModal, setParticipantsModal] = useState<{ raffle: Raffle; participants: Participant[] } | null>(null);
    const [loadingParticipants, setLoadingParticipants] = useState(false);

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

    const handleCancel = () => {
        setEditingId(null);
        setForm(emptyForm);
        setError('');
        setSuccess('');
    };

    const handleSubmit = async () => {
        setError('');
        setSuccess('');
        setLoading(true);
        try {
            const body: any = {
                title: form.title,
                productName: form.productName,
                description: form.description,
                ticketPriceCoins: parseInt(form.ticketPriceCoins),
                totalTickets: parseInt(form.totalTickets),
                featured: form.featured,
                productImages: form.imageUrl ? [{ url: form.imageUrl, order: 0 }] : [],
            };
            const url = editingId ? `${API_URL}/raffle/${editingId}` : `${API_URL}/raffle`;
            const method = editingId ? 'PUT' : 'POST';
            const res = await fetch(url, {
                method,
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify(body),
            });
            if (!res.ok) throw new Error('Error');
            setSuccess(editingId ? 'Sorteo actualizado' : 'Sorteo creado');
            setForm(emptyForm);
            setEditingId(null);
            fetchRaffles();
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este sorteo?')) return;
        try {
            await fetch(`${API_URL}/raffle/${id}`, { method: 'DELETE', headers: { 'Authorization': `Bearer ${token}` } });
            fetchRaffles();
        } catch (e) { console.error(e); }
    };

    const handleToggleFeatured = async (raffle: Raffle) => {
        try {
            await fetch(`${API_URL}/raffle/${raffle.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ featured: !raffle.featured }),
            });
            fetchRaffles();
        } catch (e) { console.error(e); }
    };

    const handleViewParticipants = async (raffle: Raffle) => {
        setLoadingParticipants(true);
        try {
            const res = await fetch(`${API_URL}/raffle/${raffle.id}/participants`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            setParticipantsModal({ raffle, participants: data });
        } catch (e) {
            console.error(e);
        } finally {
            setLoadingParticipants(false);
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
                                    <button
                                        onClick={() => handleViewParticipants(raffle)}
                                        style={{ padding: '6px 10px', borderRadius: '6px', background: 'none', border: '1px solid #4A9EFF', color: '#4A9EFF', cursor: 'pointer', fontSize: '12px' }}
                                    >
                                        👥 Ver participantes ({raffle.ticketsSold})
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

            {/* Modal de participantes */}
            {participantsModal && (
                <div
                    onClick={() => setParticipantsModal(null)}
                    style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #333' }}
                    >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Participantes: {participantsModal.raffle.title}</h3>
                            <button
                                onClick={() => setParticipantsModal(null)}
                                style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', padding: 0, lineHeight: 1 }}
                            >
                                ×
                            </button>
                        </div>

                        <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 16px' }}>
                            Total: {participantsModal.participants.length} tickets vendidos
                        </p>

                        {participantsModal.participants.length === 0 ? (
                            <p style={{ color: '#666', textAlign: 'center', margin: '20px 0' }}>Sin participantes aún</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {participantsModal.participants.map(p => (
                                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#0a0a0a', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                                        <div style={{ background: '#ABDA53', color: '#000', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>
                                            #{p.number}
                                        </div>
                                        <div style={{ flex: 1, minWidth: 0 }}>
                                            <p style={{ margin: 0, fontSize: '14px', fontWeight: '500', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.user.name}</p>
                                            <p style={{ margin: 0, fontSize: '12px', color: '#888', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{p.user.email}</p>
                                        </div>
                                        <span style={{ fontSize: '10px', color: p.source === 'PAID' ? '#ABDA53' : '#4A9EFF', border: `1px solid ${p.source === 'PAID' ? '#ABDA53' : '#4A9EFF'}`, borderRadius: '4px', padding: '2px 6px', flexShrink: 0 }}>
                                            {p.source === 'PAID' ? 'PAGO' : 'GRATIS'}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {loadingParticipants && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
                    <p style={{ color: '#fff' }}>Cargando...</p>
                </div>
            )}
        </div>
    );
};

export default AdminComponent;
