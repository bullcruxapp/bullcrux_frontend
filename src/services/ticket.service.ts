'use server'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function purchaseTickets(raffleId: string, quantity: number, token: string) {
    const response = await fetch(`${API_URL}/ticket/purchase`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ raffleId, quantity }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al comprar participaciones');
    }

    return response.json();
}

export async function claimAdTicket(raffleId: string, token: string) {
    const response = await fetch(`${API_URL}/ticket/claim-ad`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ raffleId }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al reclamar ticket gratis');
    }

    return response.json();
}

export async function getMyTickets(token: string) {
    const response = await fetch(`${API_URL}/ticket`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        throw new Error('Error al obtener tickets');
    }

    return response.json();
}
