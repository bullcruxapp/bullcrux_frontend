'use server'
import { getAllRaffles } from "@/services/raffles.service";
import HomePageComponent from "./component/HomePageComponent"
import "./homepage.css";

const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export default async function HomePage() {
    const [raffles, featuredRaffle] = await Promise.all([
        getAllRaffles(),
        fetch(`${API_URL}/raffle/featured`, { cache: 'no-store' })
            .then(r => r.ok ? r.json() : null)
            .catch(() => null)
    ]);

    return (
        <HomePageComponent raffles={raffles} featuredRaffle={featuredRaffle} />
    )
}
