'use client'

import Image from 'next/image';
import bullcruxIcon from '../../../images/icons/bullcrux-icon.svg';
import searchIcon from '../../../images/icons/search-icon.svg';
import NotificationComponent from './NotificationComponent';
import reyDelTicketIcon from '../../../images/rey-del-ticket.png';
import macbookImage from '../../../images/macbook.jpg';
import iphoneImage from '../../../images/iphone.jpg';
import tecladoImage from '../../../images/teclado.png';
import CategoryFilterComponent from '../../../components/CategoryFilter/CategoryFilterComponent';
import RaffleCardComponent from 'components/RaffleCard/RaffleCardComponent';
import RaffleLargeComponent from 'components/RaffleCard/RaffleLargeComponent';

interface HomePageComponentProps {
}

const HomePageComponent = (props: HomePageComponentProps) => {

    return (
        <div className="homepage-container">
            <div className="header flex justify-between items-center">
                {/* Bullcrux icon */}
                <div className="bullcrux-icon">
                    <Image src={bullcruxIcon} alt="Bullcrux icon" width={24} />
                </div>
                {/* Notification */}
                <NotificationComponent
                    username="@user1234"
                    message="compró"
                    product="iPhone15ProMax"
                    ticketsCount={5}
                />
                {/* Search input */}
                <div className="search-input">
                    <Image src={searchIcon} alt="Search icon" width={18} height={18} />
                </div>
            </div>
            <div className='rey-del-ticket flex justify-center items-center mt-4'>
                <Image src={reyDelTicketIcon} alt="Rey del ticket" width={197} height={54} />
            </div>

            {/* Raffle Large Card */}
            <div className="raffle-large-container mt-6">
                <RaffleLargeComponent
                    image={macbookImage}
                    title="Apple Macbook Pro 2019"
                    progress={65}
                    price="C$1.200.000"
                    onFreeTicketClick={() => console.log('Free ticket clicked')}
                    productId="macbook-pro-2019"
                />
            </div>

            {/* Category Filter */}
            <CategoryFilterComponent
                selectedCategory="Tecnología"
                onCategoryChange={(category) => console.log('Category changed:', category)}
                onFilterClick={() => console.log('Filter clicked')}
            />

            {/* Raffle Cards Grid */}
            <div className="raffle-cards-container mt-6">
                <div className="raffle-cards-grid">
                    <RaffleCardComponent
                        image={tecladoImage}
                        badge="last-day"
                        isFavorite={false}
                        progress={23}
                        available="250 Disponibles"
                        progressText="75/325"
                        title="Kryboard K500"
                        description="Ergonomic Design"
                        price="C$ 250"
                        onFreeTicketClick={() => console.log('Free ticket clicked')}
                        productId="kryboard-k500"
                    />
                    <RaffleCardComponent
                        image={iphoneImage}
                        badge="selling-fast"
                        isFavorite={true}
                        progress={23}
                        available="250 Disponibles"
                        progressText="75/325"
                        title="iPhone 16"
                        description="250GB"
                        price="C$ 250"
                        onFreeTicketClick={() => console.log('Free ticket clicked')}
                        productId="iphone-16-pro-max"
                    />
                </div>
            </div>
        </div>
    )
}

export default HomePageComponent

