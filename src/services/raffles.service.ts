import { Raffle } from "@/models/raffle.model";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export const getAllRaffles = async () => {

    try{
        const response = await fetch(`${API_URL}/raffle`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }); 

        if (!response.ok) {
            throw new Error('Failed to fetch raffles');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching raffles:', error);
        throw error;
    }


}

export const getRaffleById = async (raffleId: string) => {

    try{
        const response = await fetch(`${API_URL}/raffle/${raffleId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        if (!response.ok) {
            throw new Error('Failed to fetch raffle');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error fetching raffle:', error);
        throw error;
    }
}

export const createRaffle = async (raffleData: Raffle) => {

    try{
        const response = await fetch(`${API_URL}/raffle`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(raffleData),
        });
        if (!response.ok) {
            throw new Error('Failed to create raffle');
        }
        const data = await response.json();
        return data;
    }catch (error) {
        console.error('Error creating raffle:', error);
        throw error;
    }
}

export const enterRaffle = async (raffleId: string, userData: any) => {

}

