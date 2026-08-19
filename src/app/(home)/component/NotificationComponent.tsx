'use client'

import { useState, useEffect } from 'react';
import "./notification.css";
import { getAllRaffles } from '@/services/raffles.service';

const FAKE_USERS = [
    '@carlos_mza', '@sofi.ok', '@juanpe99', '@maru_wins', '@tomi_arg',
    '@lucas.bet', '@vale_lucky', '@nacho_cr', '@caro_sort', '@fer_play'
];

// Fallback por si todavía no cargaron los sorteos reales (o no hay ninguno activo)
const FALLBACK_PRODUCTS = [
    'iPhone 15 Pro', 'MacBook Pro', 'AirPods Pro', 'iPad Air',
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

const generateNotification = (products: string[]): Notification => ({
    user: getRandomItem(FAKE_USERS),
    tickets: getRandomInt(1, 10),
    product: getRandomItem(products.length > 0 ? products : FALLBACK_PRODUCTS),
    avatar: getRandomItem(FAKE_AVATARS),
});

const NotificationComponent = () => {
    const [products, setProducts] = useState<string[]>(FALLBACK_PRODUCTS);
    const [current, setCurrent] = useState<Notification>(generateNotification(FALLBACK_PRODUCTS));
    const [buzzing, setBuzzing] = useState(false);

    // Trae los sorteos activos reales, para no mostrar productos que no existen
    useEffect(() => {
        let cancelled = false;
        getAllRaffles()
            .then((raffles: any[]) => {
                if (cancelled) return;
                const names = (raffles || [])
                    .filter(r => r.status === 'OPEN' || r.status === 'SOLD_OUT')
                    .map(r => r.productName)
                    .filter(Boolean);
                if (names.length > 0) setProducts(names);
            })
            .catch(() => { /* si falla, seguimos con el fallback */ });
        return () => { cancelled = true; };
    }, []);

    useEffect(() => {
        let timeout: NodeJS.Timeout;

        const schedule = () => {
            const delay = getRandomInt(2500, 6000);
            timeout = setTimeout(() => {
                setCurrent(generateNotification(products));
                setBuzzing(true);
                setTimeout(() => setBuzzing(false), 500);
                schedule();
            }, delay);
        };

        schedule();
        return () => clearTimeout(timeout);
    }, [products]);

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
