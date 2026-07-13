'use client'

import Image from 'next/image';
import { useState, useMemo, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import bullcruxIcon from '@/images/icons/bullcrux-icon.svg';
import searchIcon from '@/images/icons/search-icon.svg';
import NotificationComponent from './NotificationComponent';
import CategoryFilterComponent, { Category } from '@/components/CategoryFilter/CategoryFilterComponent';
import RaffleCardComponent, { BadgeType } from '@/components/RaffleCard/RaffleCardComponent';
import { Raffle } from '@/models/raffle.model';
import RaffleLargeComponent from '@/components/RaffleCard/RaffleLargeComponent';
import { claimAdTicket } from '@/services/ticket.service';

const TITLE_IMAGES = ['/rdt.png', '/tendencia.png', '/on_fire_today.png'];

interface HomePageComponentProps {
    raffles: Raffle[];
    featuredRaffle?: Raffle | null;
}

const HomePageComponent = (props: HomePageComponentProps) => {
    const { raffles, featuredRaffle } = props;
    const { data: session } = useSession();
    const router = useRouter();
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
    const [claimingId, setClaimingId] = useState<string | null>(null);
    const [claimMessages, setClaimMessages] = useState<Record<string, string>>({});
    const [wins, setWins] = useState<any[]>([]);
    const [dismissedWins, setDismissedWins] = useState<string[]>([]);

    const titleImage = useMemo(() => TITLE_IMAGES[Math.floor(Math.random() * TITLE_IMAGES.length)], []);

    useEffect(() => {
        const fetchWins = async () => {
            if (!session) return;
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/raffle/my/wins`, {
                    headers: { 'Authorization': `Bearer ${(session as any).accessToken}` }
                });
                if (res.ok) {
                    const data = await res.json();
                    setWins(data);
                }
            } catch (e) { console.error(e); }
        };
        fetchWins();

        const dismissed = localStorage.getItem('dismissedWins');
        if (dismissed) setDismissedWins(JSON.parse(dismissed));
    }, [session]);

    const handleDismissWin = (raffleId: string) => {
        const newDismissed = [...dismissedWins, raffleId];
        setDismissedWins(newDismissed);
        localStorage.setItem('dismissedWins', JSON.stringify(newDismissed));
    };

    const visibleWins = wins.filter(w => !dismissedWins.includes(w.id));

    const openRaffles = raffles.filter(r => r.status === 'OPEN' || r.status === 'SOLD_OUT');

    const getProgress = (raffle: Raffle) => {
        if (raffle.totalTickets === 0) return 0;
        return Math.round((raffle.ticketsSold / raffle.totalTickets) * 100);
    };

    const getImageUrl = (raffle: Raffle) => {
        if (raffle.productImages && raffle.productImages.length > 0) {
            return raffle.productImages[0].url;
        }
        return raffle.productImage || '';
    };

    const getAutoBadge = (raffle: Raffle): BadgeType | undefined => {
        const available = raffle.totalTickets - raffle.ticketsSold;
        const progress = getProgress(raffle);
        if (available <= 20) return 'limited-stock';
        if (progress >= 70) return 'selling-fast';
        return undefined;
    };

    const handleFreeTicket = async (raffleId: string) => {
        if (!session) { router.push('/login'); return; }
        if (claimingId === raffleId) return;
        setClaimingId(raffleId);
        try {
            await claimAdTicket(raffleId, (session as any).accessToken);
            setClaimMessages(prev => ({ ...prev, [raffleId]: '¡Ticket reclamado!' }));
        } catch (error: any) {
            const msg = error.message?.includes('Ya reclamaste')
                ? 'Ya reclamaste tu ticket gratis'
                : 'Error al reclamar';
            setClaimMessages(prev => ({ ...prev, [raffleId]: msg }));
        } finally {
            setClaimingId(null);
            setTimeout(() => {
                setClaimMessages(prev => { const next = { ...prev }; delete next[raffleId]; return next; });
            }, 3000);
        }
    };

    return (
        <div className="homepage-container">
            <div className="header flex justify-between items-center">
                <div className="bullcrux-icon">
                    <Image src={bullcruxIcon} alt="Bullcrux icon" width={24} />
                </div>
                <NotificationComponent />
                <div className="search-input">
                    <Image src={searchIcon} alt="Search icon" width={18} height={18} />
                </div>
            </div>

            {/* Winner banners */}
            {visibleWins.map(win => (
                <div key={win.id} style={{ margin: '16px 16px 0', padding: '16px', background: 'linear-gradient(135deg, #FFD700, #FFA500)', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '12px', boxShadow: '0 4px 20px rgba(255, 215, 0, 0.3)' }}>
                    <div style={{ fontSize: '32px' }}>🏆</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '13px', fontWeight: '700', color: '#000', textTransform: 'uppercase', letterSpacing: '0.05em' }}>¡Ganaste!</p>
                        <p style={{ margin: '2px 0 0', fontSize: '14px', color: '#000', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{win.productName}</p>
                        <p style={{ margin: '2px 0 0', fontSize: '12px', color: '#333' }}>Revisá tu email para coordinar la entrega</p>
                    </div>
                    <button onClick={() => handleDismissWin(win.id)} style={{ background: 'rgba(0,0,0,0.2)', border: 'none', color: '#000', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', fontSize: '18px', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 0, flexShrink: 0 }}>×</button>
                </div>
            ))}

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', marginTop: '16px', gap: '2px' }}>
                <img src="/fire.gif" alt="" style={{ width: '44px', height: '44px', objectFit: 'contain', marginTop: '8px' }} />
                <img src={titleImage} alt="Rey del ticket" style={{ height: '60px', width: 'auto', objectFit: 'contain' }} />
                <img src="/fire.gif" alt="" style={{ width: '44px', height: '44px', objectFit: 'contain', marginTop: '8px' }} />
            </div>

            {featuredRaffle && (
                <div className="raffle-large-container mt-2">
                    <RaffleLargeComponent
                        image={getImageUrl(featuredRaffle)}
                        title={featuredRaffle.title}
                        progress={getProgress(featuredRaffle)}
                        price={`C$ ${featuredRaffle.ticketPriceCoins}`}
                        onFreeTicketClick={() => handleFreeTicket(featuredRaffle.id)}
                        productId={featuredRaffle.id}
                    />
                </div>
            )}

            <CategoryFilterComponent
                selectedCategory={selectedCategory}
                onCategoryChange={(category) => setSelectedCategory(category)}
                onFilterClick={() => console.log('Filter clicked')}
            />

            <div className="raffle-cards-container mt-6">
                <div className="raffle-cards-grid">
                    {openRaffles.map(raffle => (
                        <div key={raffle.id}>
                            <RaffleCardComponent
                                image={getImageUrl(raffle)}
                                isFavorite={false}
                                badge={getAutoBadge(raffle)}
                                progress={getProgress(raffle)}
                                available={`${raffle.totalTickets - raffle.ticketsSold} disponibles`}
                                progressText={`${raffle.ticketsSold}/${raffle.totalTickets}`}
                                title={raffle.title}
                                price={`C$ ${raffle.ticketPriceCoins}`}
                                onFreeTicketClick={() => handleFreeTicket(raffle.id)}
                                productId={raffle.id}
                                winner={(raffle as any).winner}
                            />
                            {claimMessages[raffle.id] && (
                                <p style={{ textAlign: 'center', fontSize: '12px', color: '#ABDA53', marginTop: '4px' }}>
                                    {claimMessages[raffle.id]}
                                </p>
                            )}
                        </div>
                    ))}
                </div>
                {openRaffles.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--color-text-secondary)', marginTop: '2rem' }}>
                        No hay sorteos activos por el momento.
                    </p>
                )}
            </div>
        </div>
    );
};

export default HomePageComponent;
