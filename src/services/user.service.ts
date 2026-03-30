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

export async function getUserSettings(email: string, token: string) {

    try {
        const response = await axios.get(apiUrl + '/users/profile', {
            params: {
                email: email
            },
            headers:{
                'Authorization': `Bearer ${token}`
            }
        });
        return response.data;
    } catch (error) {
        console.log(error);
        throw new Error('Failed to fetch user settings');
    }

}