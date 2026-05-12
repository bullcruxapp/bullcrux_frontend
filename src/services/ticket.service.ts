import { Ticket } from "@/models/ticket.model";

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const buyTicket = async (ticket: Ticket, token: string) => {
    const response = await fetch(`${API_URL}/ticket/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(ticket),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Error al comprar el ticket');
    }

    return data;
}