'use client'

import { useState, useEffect } from 'react';
import "./notification.css";

const FAKE_USERS = [
    '@carlos_mza', '@sofi.ok', '@juanpe99', '@maru_wins', '@tomi_arg',
    '@lucas.bet', '@vale_lucky', '@nacho_cr', '@caro_sort', '@fer_play'
];

const FAKE_PRODUCTS = [
    'iPhone 15 Pro', 'MacBook Pro', 'Samsung S28', 'PS5', 'AirPods Pro',
    'iPad Air', 'Google TV', 'Kryboard K500'
];

const FAKE_AVATARS = [
    'https://i.pravatar.cc/32?img=1',
    'https://i.pravatar.cc/32?img=2',
    'https://i.pravatar.cc/32?img=3',
    'https://i.pravatar.cc/32?img=4',
    'https://i.pravatar.cc/32?img=5',
    'https://i.pravatar.cc/32?img=6',
    'https://i.pravatar.cc/32?img=7',
    'https://i.pravatar.cc/32?img=8',
];

const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

interface Notification {
    user: string;
    tickets: number;
    product: string;
    avatar: string;
}

const generateNotification = (): Notification => ({
    user: getRandomItem(FAKE_USERS),
    tickets: getRandomInt(1, 10),
    product: getRandomItem(FAKE_PRODUCTS),
    avatar: getRandomItem(FAKE_AVATARS),
});

const NotificationComponent = () => {
    const [current, setCurrent] = useState<Notification>(generateNotification());
    const [buzzing, setBuzzing] = useState(false);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const schedule = () => {
            const delay = getRandomInt(2500, 6000);
            timeout = setTimeout(() => {
                setCurrent(generateNotification());
                setBuzzing(true);
                setTimeout(() => setBuzzing(false), 500);
                schedule();
            }, delay);
        };

        schedule();
        return () => clearTimeout(timeout);
    }, []);

    return (
        <div className={`notification-container ${buzzing ? 'notification-buzz' : ''}`}>
            <img
                src={current.avatar}
                alt="Profile"
                className="notification-avatar"
            />
            <span className="notification-text">
                {current.user} compró {current.tickets}tks de {current.product}
            </span>
        </div>
    );
};

export default NotificationComponent;
