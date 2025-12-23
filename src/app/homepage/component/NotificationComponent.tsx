'use client'

import Image from 'next/image';
import "./notification.css";

interface NotificationComponentProps {
    username?: string;
    message?: string;
    product?: string;
    ticketsCount?: number;
    profileImage?: string;
}

const NotificationComponent = (props: NotificationComponentProps) => {
    const {
        username = "@user1234",
        message = "compró",
        product = "iPhone15ProMax",
        ticketsCount = 5,
        profileImage
    } = props;

    return (
        <div className="notification-container">
            {profileImage ? (
                <Image
                    src={profileImage}
                    alt="Profile"
                    width={32}
                    height={32}
                    className="notification-profile-image"
                />
            ) : (
                <div className="notification-profile-placeholder" />
            )}
            <span className="notification-text">
                {username} {message} {ticketsCount}tks de {product}
            </span>
        </div>
    )
}

export default NotificationComponent

