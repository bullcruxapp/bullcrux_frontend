export interface Raffle {
    id: string;
    title: string;
    description: string;
    productName: string;
    productImage: string;
    ticketPriceCoins: number;
    totalTickets: number;
    ticketsSold: number;
    status: RaffleStatus;
    creatorId: string;
    winnerId?: string;
    createdAt: string;
    updatedAt: string;
}

export enum RaffleStatus {
    OPEN = "OPEN",
    CLOSED = "CLOSED",
};