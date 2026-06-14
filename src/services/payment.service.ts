'use server'

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function createPaymentPreference(raffleId: string, quantity: number, token: string) {
    const response = await fetch(`${API_URL}/payments/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ raffleId, quantity }),
    });

    if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Error al crear el pago');
    }

    return response.json();
}
