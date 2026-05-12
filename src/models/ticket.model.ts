import { Raffle } from "./raffle.model";


export interface Ticket {
    id: string;
    raffleId: string;
    userId: string;
    purchasedAt?: string;
    raffle?: Raffle;
    quantity?: number;
}