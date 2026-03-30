'use server'
import { getAllRaffles } from "@/services/raffles.service";
import HomePageComponent from "./component/HomePageComponent"
import "./homepage.css";
import { getServerSession } from "next-auth/next";

export default async function HomePage() {

    const session = await getServerSession();

    const [raffles] = await Promise.all([
        getAllRaffles()
    ]);
    
    return (
        <HomePageComponent raffles={raffles} />
    )
}

