'use server'
import axios from "axios";

const apiUrl = process.env.NEXT_PUBLIC_API_URL;

export async function loginService(user: string, password: string) {
    try {
        const response = await axios.post(apiUrl + '/auth/login', {
            email: user,
            password: password
        });
        return response.data;
    } catch (error) {
        throw new Error('Login failed');
    }
}