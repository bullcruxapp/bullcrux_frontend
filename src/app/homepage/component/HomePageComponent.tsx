'use client'

import Image from 'next/image';
import bullcruxIcon from '../../../images/bullcrux-icon.svg';
import searchIcon from '../../../images/search-icon.svg';
import NotificationComponent from './NotificationComponent';
import reyDelTicketIcon from '../../../images/rey-del-ticket.png';

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
        </div>
    )
}

export default HomePageComponent

