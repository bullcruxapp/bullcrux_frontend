
const API_URL = process.env.NEXT_PUBLIC_API_URL;

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