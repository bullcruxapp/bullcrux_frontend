'use server'
import CarteraComponent from "./component/CarteraComponent";
import "./cartera.css";
import { getUserSettings } from "services/user.service";
import { getServerSession } from "next-auth";
import { authOptions } from "lib/auth";
import { redirect } from "next/navigation";

export default async function CarteraPage() {

    const session = await getServerSession(authOptions);
    if (!session?.user) {
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
