'use server'
import CarteraComponent from "./component/CarteraComponent";
import "./cartera.css";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { getUserSettings } from "@/services/user.service";

export default async function CarteraPage() {

    const session = await getServerSession(authOptions);
    if (!session || !session.user) {  // BUGFIX: era `session.user` (siempre true), debe ser `!session.user`
        redirect('/login');
    }

    const user = await getUserSettings(session.user.email || '', session.accessToken || '');

    if (!user) {
        redirect('/login');
    }

    return (
        <CarteraComponent balance={user.balanceCoins || 0} transactions={user.transactions || []} />
    );
}
