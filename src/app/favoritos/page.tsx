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
    try {
        const response = await fetch(`${API_URL}/ticket`, {
            headers: {
                'Authorization': `Bearer ${(session as any).accessToken}`,
            },
            cache: 'no-store',
        });
        if (response.ok) {
            tickets = await response.json();
        }
    } catch (error) {
        console.error('Error fetching tickets:', error);
    }

    return <FavoritosComponent tickets={tickets} />;
}
