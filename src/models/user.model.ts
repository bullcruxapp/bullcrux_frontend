export interface User {
    id: string;
    name: string;
    email: string;
    password?: string;
    googleId?: string;
    balanceCoins: number;
    createdAt: string;
    updatedAt: string;
}
