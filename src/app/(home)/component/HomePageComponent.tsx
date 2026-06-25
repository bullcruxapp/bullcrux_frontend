'use client'

import Image from 'next/image';
import bullcruxIcon from '@/images/icons/bullcrux-icon.svg';
import searchIcon from '@/images/icons/search-icon.svg';
import NotificationComponent from './NotificationComponent';
import reyDelTicketIcon from '@/images/rey-del-ticket.png';
import CategoryFilterComponent, { Category } from '@/components/CategoryFilter/CategoryFilterComponent';
import RaffleCardComponent, { BadgeType } from '@/components/RaffleCard/RaffleCardComponent';
import { Raffle } from '@/models/raffle.model';
import RaffleLargeComponent from '@/components/RaffleCard/RaffleLargeComponent';
import { useState } from 'react';

interface HomePageComponentProps {
    raffles: Raffle[];
    featuredRaffle?: Raffle | null;
}

const HomePageComponent = (props: HomePageComponentProps) => {
    const { raffles, featuredRaffle } = props;
    const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);

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
                <Image src={reyDelTicketIcon} alt="Rey del ticket" width={197} height={54} />
            </div>

            {featuredRaffle && (
                <div className="raffle-large-container mt-6">
                    <RaffleLargeComponent
                        image={getImageUrl(featuredRaffle)}
                        title={featuredRaffle.title}
                        progress={getProgress(featuredRaffle)}
                        price={`C$ ${featuredRaffle.ticketPriceCoins}`}
                        onFreeTicketClick={() => console.log('Free ticket clicked')}
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
                        <RaffleCardComponent
                            key={raffle.id}
                            image={getImageUrl(raffle)}
                            isFavorite={false}
                            badge={getAutoBadge(raffle)}
                            progress={getProgress(raffle)}
                            available={`${raffle.totalTickets - raffle.ticketsSold} disponibles`}
                            progressText={`${raffle.ticketsSold}/${raffle.totalTickets}`}
                            title={raffle.title}
                            price={`C$ ${raffle.ticketPriceCoins}`}
                            onFreeTicketClick={() => console.log('Free ticket clicked')}
                            productId={raffle.id}
                        />
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
