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
    productPriceCoins: number;
    totalTickets: number;
    ticketsSold: number;
    status: string;
    featured: boolean;
    productImages: ProductImage[];
    winnerId?: string;
    winner?: { id: string; name: string; email: string };
    drawnAt?: string;
    countdownStartedAt?: string;
}

interface Participant {
    id: string;
    number: number;
    source: string;
    purchasedAt: string;
    user: { id: string; name: string; email: string };
}

interface AdminComponentProps {
    token: string;
}

const emptyForm = {
    title: '',
    productName: '',
    description: '',
    ticketPriceCoins: '',
    productPriceCoins: '',
    totalTickets: '',
    mediaUrls: [''] as string[],
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
    const [drawResult, setDrawResult] = useState<any>(null);
    const [drawing, setDrawing] = useState(false);

    const fetchRaffles = async () => {
        try {
            const res = await fetch(`${API_URL}/raffle`);
            const data = await res.json();
            setRaffles(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchRaffles(); }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleMediaUrlChange = (index: number, value: string) => {
        const next = [...form.mediaUrls];
        next[index] = value;
        setForm({ ...form, mediaUrls: next });
    };

    const handleAddMediaUrl = () => {
        setForm({ ...form, mediaUrls: [...form.mediaUrls, ''] });
    };

    const handleRemoveMediaUrl = (index: number) => {
        const next = form.mediaUrls.filter((_, i) => i !== index);
        setForm({ ...form, mediaUrls: next.length > 0 ? next : [''] });
    };

    const handleEdit = (raffle: Raffle) => {
        setEditingId(raffle.id);
        const existingUrls = (raffle.productImages || [])
            .sort((a, b) => a.order - b.order)
            .map(img => img.url);
        setForm({
            title: raffle.title,
            productName: raffle.productName,
            description: raffle.description || '',
            ticketPriceCoins: String(raffle.ticketPriceCoins),
            productPriceCoins: String(raffle.productPriceCoins || ''),
            totalTickets: String(raffle.totalTickets),
            mediaUrls: existingUrls.length > 0 ? existingUrls : [''],
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
        setError(''); setSuccess(''); setLoading(true);
        try {
            const body: any = {
                title: form.title,
                productName: form.productName,
                description: form.description,
                ticketPriceCoins: parseInt(form.ticketPriceCoins),
                productPriceCoins: parseInt(form.productPriceCoins) || 0,
                totalTickets: parseInt(form.totalTickets),
                featured: form.featured,
                productImages: form.mediaUrls
                    .map(u => u.trim())
                    .filter(Boolean)
                    .map((url, order) => ({ url, order })),
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
        } finally { setLoading(false); }
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
        } catch (e) { console.error(e); }
        finally { setLoadingParticipants(false); }
    };

    const handleDrawWinner = async (raffle: Raffle) => {
        if (!confirm(`¿Realizar sorteo de "${raffle.title}"? Esta acción es irreversible.`)) return;
        setDrawing(true);
        try {
            const res = await fetch(`${API_URL}/raffle/${raffle.id}/draw`, {
                method: 'POST',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message || 'Error al sortear');
            setDrawResult(data);
            fetchRaffles();
        } catch (err: any) {
            alert('Error: ' + err.message);
        } finally { setDrawing(false); }
    };

    const inputStyle = { padding: '12px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' as const };

    return (
        <div style={{ padding: '24px', maxWidth: '600px', margin: '0 auto', color: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <h1 style={{ fontSize: '22px', fontWeight: '500', margin: 0 }}>Panel de admin</h1>
                <button onClick={() => router.push('/')} style={{ background: 'none', border: '1px solid #555', color: '#fff', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer' }}>← Volver</button>
            </div>

            <h2 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>{editingId ? 'Editar sorteo' : 'Crear sorteo'}</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <input name="title" placeholder="Título" value={form.title} onChange={handleChange} style={inputStyle} />
                <input name="productName" placeholder="Nombre del producto" value={form.productName} onChange={handleChange} style={inputStyle} />
                <textarea name="description" placeholder="Descripción" value={form.description} onChange={handleChange} rows={2} style={{ ...inputStyle, resize: 'none' }} />
                <input name="ticketPriceCoins" placeholder="Precio del ticket (coins)" type="number" value={form.ticketPriceCoins} onChange={handleChange} style={inputStyle} />
                <input name="productPriceCoins" placeholder="Precio del producto (coins) - activa countdown al llegarse" type="number" value={form.productPriceCoins} onChange={handleChange} style={inputStyle} />
                <input name="totalTickets" placeholder="Total de tickets" type="number" value={form.totalTickets} onChange={handleChange} style={inputStyle} />

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '13px', color: '#aaa' }}>Fotos o videos del producto (URL) — el primero es la portada</label>
                    {form.mediaUrls.map((url, index) => (
                        <div key={index} style={{ display: 'flex', gap: '8px' }}>
                            <input
                                placeholder={`URL ${index + 1} (imagen o video .mp4)`}
                                value={url}
                                onChange={(e) => handleMediaUrlChange(index, e.target.value)}
                                style={{ ...inputStyle, flex: 1 }}
                            />
                            {form.mediaUrls.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => handleRemoveMediaUrl(index)}
                                    style={{ background: '#331a1a', border: '1px solid #663333', color: '#ff8888', borderRadius: '8px', padding: '0 14px', cursor: 'pointer' }}
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={handleAddMediaUrl}
                        style={{ background: 'none', border: '1px dashed #555', color: '#ABDA53', borderRadius: '8px', padding: '10px', cursor: 'pointer', fontSize: '13px' }}
                    >
                        + Agregar otra foto o video
                    </button>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', background: '#1a1a1a', border: '1px solid #333', borderRadius: '8px' }}>
                    <input type="checkbox" id="featured" checked={form.featured} onChange={(e) => setForm({ ...form, featured: e.target.checked })} style={{ width: '18px', height: '18px', cursor: 'pointer' }} />
                    <label htmlFor="featured" style={{ cursor: 'pointer', fontSize: '14px' }}>⭐ Destacar en Rey del Ticket</label>
                </div>

                {error && <p style={{ color: '#ff4444', margin: 0 }}>{error}</p>}
                {success && <p style={{ color: '#44ff44', margin: 0 }}>{success}</p>}

                <div style={{ display: 'flex', gap: '8px' }}>
                    <button onClick={handleSubmit} disabled={loading} style={{ flex: 1, padding: '14px', borderRadius: '8px', background: '#ABDA53', color: '#000', fontWeight: '500', border: 'none', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Guardando...' : editingId ? 'Guardar cambios' : 'Crear sorteo'}
                    </button>
                    {editingId && <button onClick={handleCancel} style={{ padding: '14px 20px', borderRadius: '8px', background: 'none', border: '1px solid #555', color: '#fff', cursor: 'pointer' }}>Cancelar</button>}
                </div>
            </div>

            <HouseAdsSection token={token} />

            <h2 style={{ fontSize: '16px', fontWeight: '500', margin: '32px 0 16px' }}>Sorteos existentes</h2>

            {raffles.length === 0 ? (
                <p style={{ color: '#666' }}>No hay sorteos.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {raffles.map(raffle => {
                        const raised = raffle.ticketsSold * raffle.ticketPriceCoins;
                        const goal = raffle.productPriceCoins;
                        const countdownActive = !!raffle.countdownStartedAt && !raffle.winnerId;
                        return (
                            <div key={raffle.id} style={{ background: '#1a1a1a', border: `1px solid ${raffle.winnerId ? '#FFD700' : countdownActive ? '#FF6B35' : raffle.featured ? '#ABDA53' : '#333'}`, borderRadius: '8px', padding: '16px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px' }}>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                                            <p style={{ margin: 0, fontWeight: '500' }}>{raffle.title}</p>
                                            {raffle.featured && <span style={{ fontSize: '11px', color: '#ABDA53', border: '1px solid #ABDA53', borderRadius: '4px', padding: '1px 6px' }}>REY DEL TICKET</span>}
                                            {countdownActive && <span style={{ fontSize: '11px', color: '#FF6B35', border: '1px solid #FF6B35', borderRadius: '4px', padding: '1px 6px' }}>⏱️ COUNTDOWN</span>}
                                            {raffle.winnerId && <span style={{ fontSize: '11px', color: '#FFD700', border: '1px solid #FFD700', borderRadius: '4px', padding: '1px 6px' }}>🏆 SORTEADO</span>}
                                        </div>
                                        <p style={{ margin: '0 0 4px', fontSize: '13px', color: '#aaa' }}>{raffle.ticketsSold}/{raffle.totalTickets} tickets · B$ {raffle.ticketPriceCoins}</p>
                                        {goal > 0 && (
                                            <p style={{ margin: '0 0 4px', fontSize: '12px', color: raised >= goal ? '#ABDA53' : '#888' }}>
                                                Recaudado: B$ {raised} / B$ {goal} {raised >= goal ? '✓' : ''}
                                            </p>
                                        )}
                                        <p style={{ margin: 0, fontSize: '12px', color: raffle.status === 'OPEN' ? '#ABDA53' : '#888' }}>{raffle.status}</p>
                                        {raffle.winner && (
                                            <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#FFD700' }}>
                                                Ganador: <strong>{raffle.winner.name}</strong> ({raffle.winner.email})
                                            </p>
                                        )}
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', alignItems: 'flex-end', flexShrink: 0 }}>
                                        {!raffle.winnerId && (
                                            <button onClick={() => handleToggleFeatured(raffle)} style={{ padding: '6px 10px', borderRadius: '6px', background: raffle.featured ? '#ABDA53' : 'none', border: `1px solid ${raffle.featured ? '#ABDA53' : '#555'}`, color: raffle.featured ? '#000' : '#fff', cursor: 'pointer', fontSize: '12px' }}>
                                                ⭐ {raffle.featured ? 'Destacado' : 'Destacar'}
                                            </button>
                                        )}
                                        <button onClick={() => handleViewParticipants(raffle)} style={{ padding: '6px 10px', borderRadius: '6px', background: 'none', border: '1px solid #4A9EFF', color: '#4A9EFF', cursor: 'pointer', fontSize: '12px' }}>
                                            👥 Ver participantes ({raffle.ticketsSold})
                                        </button>
                                        {!raffle.winnerId && raffle.ticketsSold > 0 && (
                                            <button onClick={() => handleDrawWinner(raffle)} disabled={drawing} style={{ padding: '6px 10px', borderRadius: '6px', background: '#FFD700', border: 'none', color: '#000', cursor: drawing ? 'not-allowed' : 'pointer', fontSize: '12px', fontWeight: '600', opacity: drawing ? 0.7 : 1 }}>
                                                🎲 Sortear ganador
                                            </button>
                                        )}
                                        {!raffle.winnerId && (
                                            <div style={{ display: 'flex', gap: '8px' }}>
                                                <button onClick={() => handleEdit(raffle)} style={{ padding: '6px 10px', borderRadius: '6px', background: 'none', border: '1px solid #555', color: '#fff', cursor: 'pointer', fontSize: '12px' }}>Editar</button>
                                                <button onClick={() => handleDelete(raffle.id)} style={{ padding: '6px 10px', borderRadius: '6px', background: 'none', border: '1px solid #ff4444', color: '#ff4444', cursor: 'pointer', fontSize: '12px' }}>Eliminar</button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {participantsModal && (
                <div onClick={() => setParticipantsModal(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: '#1a1a1a', borderRadius: '12px', padding: '24px', maxWidth: '500px', width: '100%', maxHeight: '80vh', overflowY: 'auto', border: '1px solid #333' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                            <h3 style={{ margin: 0, fontSize: '18px' }}>Participantes: {participantsModal.raffle.title}</h3>
                            <button onClick={() => setParticipantsModal(null)} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '24px', cursor: 'pointer', padding: 0, lineHeight: 1 }}>×</button>
                        </div>
                        <p style={{ fontSize: '13px', color: '#aaa', margin: '0 0 16px' }}>Total: {participantsModal.participants.length} tickets vendidos</p>
                        {participantsModal.participants.length === 0 ? (
                            <p style={{ color: '#666', textAlign: 'center', margin: '20px 0' }}>Sin participantes aún</p>
                        ) : (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                {participantsModal.participants.map(p => (
                                    <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#0a0a0a', borderRadius: '8px', border: '1px solid #2a2a2a' }}>
                                        <div style={{ background: '#ABDA53', color: '#000', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px', flexShrink: 0 }}>#{p.number}</div>
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

            {drawResult && (
                <div onClick={() => setDrawResult(null)} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
                    <div onClick={(e) => e.stopPropagation()} style={{ background: 'linear-gradient(135deg, #1a1a1a, #2a2a1a)', borderRadius: '16px', padding: '32px', maxWidth: '480px', width: '100%', border: '2px solid #FFD700', textAlign: 'center' }}>
                        <div style={{ fontSize: '64px', marginBottom: '16px' }}>🏆</div>
                        <h2 style={{ margin: '0 0 8px', fontSize: '24px', color: '#FFD700' }}>¡Ganador!</h2>
                        <p style={{ margin: '0 0 24px', fontSize: '14px', color: '#aaa' }}>{drawResult.raffle.title}</p>
                        <div style={{ background: '#0a0a0a', borderRadius: '12px', padding: '20px', marginBottom: '20px', border: '1px solid #FFD70044' }}>
                            <p style={{ margin: '0 0 8px', fontSize: '12px', color: '#888', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Ticket ganador</p>
                            <p style={{ margin: '0 0 16px', fontSize: '48px', fontWeight: '900', color: '#FFD700' }}>#{drawResult.winningTicket.number}</p>
                            <p style={{ margin: '0 0 4px', fontSize: '18px', fontWeight: '600', color: '#fff' }}>{drawResult.winningTicket.user.name}</p>
                            <p style={{ margin: 0, fontSize: '13px', color: '#aaa' }}>{drawResult.winningTicket.user.email}</p>
                        </div>
                        <button onClick={() => setDrawResult(null)} style={{ width: '100%', padding: '14px', borderRadius: '10px', background: '#FFD700', color: '#000', fontWeight: '700', border: 'none', cursor: 'pointer', fontSize: '15px' }}>Cerrar</button>
                    </div>
                </div>
            )}

            {(loadingParticipants || drawing) && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 999 }}>
                    <p style={{ color: '#fff' }}>{drawing ? 'Sorteando...' : 'Cargando...'}</p>
                </div>
            )}
        </div>
    );
};

export default AdminComponent;

/** Sección para manejar tus propios videos de publicidad (los que se muestran al pedir ticket gratis). */
function HouseAdsSection({ token }: { token: string }) {
    const [ads, setAds] = useState<{ id: string; videoUrl: string; active: boolean }[]>([]);
    const [newUrl, setNewUrl] = useState('');
    const [loading, setLoading] = useState(false);

    const fetchAds = async () => {
        try {
            const res = await fetch(`${API_URL}/house-ad`, {
                headers: { 'Authorization': `Bearer ${token}` },
            });
            const data = await res.json();
            setAds(data);
        } catch (e) { console.error(e); }
    };

    useEffect(() => { fetchAds(); }, []);

    const handleAdd = async () => {
        if (!newUrl.trim()) return;
        setLoading(true);
        try {
            await fetch(`${API_URL}/house-ad`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                body: JSON.stringify({ videoUrl: newUrl.trim() }),
            });
            setNewUrl('');
            fetchAds();
        } catch (e) { console.error(e); }
        finally { setLoading(false); }
    };

    const handleToggle = async (id: string) => {
        try {
            await fetch(`${API_URL}/house-ad/${id}/toggle`, {
                method: 'PUT',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            fetchAds();
        } catch (e) { console.error(e); }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('¿Eliminar este anuncio?')) return;
        try {
            await fetch(`${API_URL}/house-ad/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` },
            });
            fetchAds();
        } catch (e) { console.error(e); }
    };

    const inputStyle = { padding: '12px', borderRadius: '8px', background: '#1a1a1a', border: '1px solid #333', color: '#fff', fontSize: '14px', outline: 'none', width: '100%', boxSizing: 'border-box' as const };

    return (
        <div style={{ marginTop: '32px', padding: '16px', background: '#141414', border: '1px solid #333', borderRadius: '10px' }}>
            <h2 style={{ fontSize: '16px', fontWeight: '500', margin: '0 0 4px' }}>🎬 Mis anuncios (ticket gratis)</h2>
            <p style={{ fontSize: '12.5px', color: '#888', margin: '0 0 16px' }}>
                Videos propios que se muestran cuando alguien pide un ticket gratis. Rotan al azar entre los que estén activos.
            </p>

            <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                <input
                    placeholder="URL del video (.mp4)"
                    value={newUrl}
                    onChange={(e) => setNewUrl(e.target.value)}
                    style={{ ...inputStyle, flex: 1 }}
                />
                <button
                    onClick={handleAdd}
                    disabled={loading}
                    style={{ padding: '0 20px', borderRadius: '8px', background: '#ABDA53', color: '#000', fontWeight: '500', border: 'none', cursor: loading ? 'not-allowed' : 'pointer' }}
                >
                    Agregar
                </button>
            </div>

            {ads.length === 0 ? (
                <p style={{ color: '#666', fontSize: '13px' }}>Todavía no cargaste ningún anuncio.</p>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {ads.map(ad => (
                        <div key={ad.id} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px', background: '#1a1a1a', borderRadius: '8px', border: `1px solid ${ad.active ? '#ABDA5344' : '#333'}` }}>
                            <span style={{ flex: 1, fontSize: '13px', color: ad.active ? '#fff' : '#666', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                {ad.videoUrl}
                            </span>
                            <button
                                onClick={() => handleToggle(ad.id)}
                                style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', border: 'none', cursor: 'pointer', background: ad.active ? '#ABDA5333' : '#333', color: ad.active ? '#ABDA53' : '#888' }}
                            >
                                {ad.active ? 'Activo' : 'Pausado'}
                            </button>
                            <button
                                onClick={() => handleDelete(ad.id)}
                                style={{ fontSize: '12px', padding: '6px 10px', borderRadius: '6px', background: '#331a1a', border: '1px solid #663333', color: '#ff8888', cursor: 'pointer' }}
                            >
                                ✕
                            </button>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
