import { TransactionType } from "./enums/TransactionType";

export interface Transaction {
    id: string;
    userId: string;
    type: TransactionType;
    amount: number;
    description: string;
    createdAt: string;
    status: string;
}