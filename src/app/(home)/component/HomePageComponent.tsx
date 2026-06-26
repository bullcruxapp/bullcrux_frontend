'use client'

import Image from 'next/image';
import { useState } from 'react';
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
        if (!session) {
            router.push('/login');
            return;
        }

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
                setClaimMessages(prev => {
                    const next = { ...prev };
                    delete next[raffleId];
                    return next;
                });
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

            <div className='rey-del-ticket flex justify-center items-center mt-4'>
                <img src="/fire.gif" alt="" width={36} height={36} style={{ marginRight: '4px' }} />
                <img src="/rdt.png" alt="Rey del ticket" height={54} style={{ height: '54px', width: 'auto' }} />
                <img src="/fire.gif" alt="" width={36} height={36} style={{ marginLeft: '4px' }} />
            </div>

            {featuredRaffle && (
                <div className="raffle-large-container mt-6">
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
