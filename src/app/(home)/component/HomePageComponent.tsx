'use client'

import Image from 'next/image';
import bullcruxIcon from '@/images/icons/bullcrux-icon.svg';
import searchIcon from '@/images/icons/search-icon.svg';
import NotificationComponent from './NotificationComponent';
import reyDelTicketIcon from '@/images/rey-del-ticket.png';
import CategoryFilterComponent from '@/components/CategoryFilter/CategoryFilterComponent';
import RaffleCardComponent from '@/components/RaffleCard/RaffleCardComponent';
import { Raffle } from '@/models/raffle.model';
import RaffleLargeComponent from '@/components/RaffleCard/RaffleLargeComponent';
import { useState } from 'react';

interface HomePageComponentProps {
    raffles: Raffle[];
}

const HomePageComponent = (props: HomePageComponentProps) => {
    const { raffles } = props;
    const [selectedCategory, setSelectedCategory] = useState('Todos');

    const openRaffles = raffles.filter(r => r.status === 'OPEN' || r.status === 'SOLD_OUT');
    const featuredRaffle = openRaffles[0] || null;
    const restRaffles = openRaffles.slice(1);

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

    return (
        <div className="homepage-container">
            <div className="header flex justify-between items-center">
                <div className="bullcrux-icon">
                    <Image src={bullcruxIcon} alt="Bullcrux icon" width={24} />
                </div>
                <NotificationComponent
                    username="@bullcrux"
                    message="sorteo activo"
                    product={featuredRaffle?.productName || ''}
                    ticketsCount={featuredRaffle?.ticketsSold || 0}
                />
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
                        title={featuredRaffle.productName}
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
                    {restRaffles.map(raffle => (
                        <RaffleCardComponent
                            key={raffle.id}
                            image={getImageUrl(raffle)}
                            isFavorite={false}
                            progress={getProgress(raffle)}
                            available={`${raffle.totalTickets - raffle.ticketsSold} disponibles`}
                            progressText={`${raffle.ticketsSold}/${raffle.totalTickets}`}
                            title={raffle.title}
                            description={raffle.description}
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
