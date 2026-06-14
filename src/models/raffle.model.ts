export interface RaffleImage {
    id: string;
    url: string;
    order: number;
    raffleId: string;
    createdAt: string;
}

export interface Raffle {
    id: string;
    title: string;
    description: string;
    productName: string;
    productImage?: string;       // campo viejo, por compatibilidad
    productImages?: RaffleImage[]; // nuevo: múltiples imágenes
    ticketPriceCoins: number;
    totalTickets: number;
    ticketsSold: number;
    status: RaffleStatus;
    creatorId: string;
    winnerId?: string;
    drawnAt?: string;
    createdAt: string;
    updatedAt: string;
}

export enum RaffleStatus {
    OPEN = "OPEN",
    SOLD_OUT = "SOLD_OUT",
    DRAWN = "DRAWN",
}
