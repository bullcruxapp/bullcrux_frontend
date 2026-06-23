'use server'
import CarteraComponent from "./component/CarteraComponent";
import "./cartera.css";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUserSettings } from "@/services/user.service";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export default async function CarteraPage({ searchParams }: { searchParams: Promise<{ payment_id?: string; external_reference?: string; status?: string }> }) {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/login');
    }

    const params = await searchParams;
    const { payment_id, external_reference, status } = params;

    if (payment_id && external_reference && status === 'approved') {
        try {
            await fetch(`${API_URL}/payments/success?payment_id=${payment_id}&external_reference=${external_reference}`);
        } catch (error) {
            console.error('Error confirming payment:', error);
        }
    }

    const user = await getUserSettings(session.user.email || '', (session as any).accessToken || '');
    if (!user) {
        redirect('/login');
    }

    return (
        <CarteraComponent balance={user.balanceCoins || 0} transactions={user.transactions || []} />
    );
}
