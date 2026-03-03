'use server'
import axios from "axios";
import { TransactionType } from "models/enums/TransactionType";
import { Transaction } from "models/transaction.model";


const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const getPaymentLinkFromMercadoPago = async (price: number, bearerToken: string, userId: string): Promise<string> => {
    try {

        const response = await axios.post(`${API_URL}/payments/create`, { price, userId , title: TransactionType.DEPOSIT},{
            headers: {
                'Authorization': `Bearer ${bearerToken}`
            }
        });

        console.log('Response from payment link API:', response.data);
        return response.data.init_point;;
    } catch (error) {
        console.error('Error creating payment link:', error);
        throw error;
    }
};
