import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import FavoritosComponent from "./component/FavoritosComponent";
import "./favoritos.css";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export default async function FavoritosPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/login');
    }

    let tickets = [];
    let favorites = [];

    try {
        const [ticketsRes, favoritesRes] = await Promise.all([
            fetch(`${API_URL}/ticket`, {
                headers: { 'Authorization': `Bearer ${(session as any).accessToken}` },
                cache: 'no-store',
            }),
            fetch(`${API_URL}/favorite`, {
                headers: { 'Authorization': `Bearer ${(session as any).accessToken}` },
                cache: 'no-store',
            })
        ]);
        if (ticketsRes.ok) tickets = await ticketsRes.json();
        if (favoritesRes.ok) favorites = await favoritesRes.json();
    } catch (error) {
        console.error('Error fetching:', error);
    }

    return <FavoritosComponent tickets={tickets} favorites={favorites} />;
}
