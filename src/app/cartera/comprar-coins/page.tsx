'use server'
import { authOptions } from "lib/auth";
import ComprarCoinsComponent from "./component/ComprarCoinsComponent";
import "./comprar-coins.css";
import { getServerSession } from "next-auth";

export default async function ComprarCoinsPage() {

    const session = await getServerSession(authOptions);

    return (
        <ComprarCoinsComponent bearerToken={session?.accessToken || ''} userId={session?.user?.id || ''} />
    );
}
