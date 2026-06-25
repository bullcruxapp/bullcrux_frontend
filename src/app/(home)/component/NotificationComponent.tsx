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

const COLORS = [
    '#ABDA53', '#FFD700', '#FF6B35', '#00E5FF', '#FF3CAC',
    '#7B2FBE', '#00FF88', '#FF9500'
];

const getRandomItem = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];
const getRandomInt = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;

interface Notification {
    user: string;
    tickets: number;
    product: string;
    color: string;
}

const generateNotification = (): Notification => ({
    user: getRandomItem(FAKE_USERS),
    tickets: getRandomInt(1, 10),
    product: getRandomItem(FAKE_PRODUCTS),
    color: getRandomItem(COLORS),
});

const NotificationComponent = () => {
    const [current, setCurrent] = useState<Notification>(generateNotification());
    const [visible, setVisible] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setVisible(false);
            setTimeout(() => {
                setCurrent(generateNotification());
                setVisible(true);
            }, 400);
        }, 3500);

        return () => clearInterval(interval);
    }, []);

    return (
        <div
            className={`notification-container notification-pump ${visible ? 'notification-visible' : 'notification-hidden'}`}
            style={{ borderColor: current.color, boxShadow: `0 0 8px ${current.color}33` }}
        >
            <div className="notification-dot" style={{ background: current.color }} />
            <span className="notification-text" style={{ color: '#fff' }}>
                <span style={{ color: current.color, fontWeight: 600 }}>{current.user}</span>
                {' '}compró{' '}
                <span style={{ color: current.color, fontWeight: 600 }}>{current.tickets}tks</span>
                {' '}de {current.product}
            </span>
        </div>
    );
};

export default NotificationComponent;
