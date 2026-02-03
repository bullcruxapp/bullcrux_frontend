'use server'
import HomePageComponent from "./component/HomePageComponent"
import { getServerSession } from "next-auth";
import "./homepage.css";
import { getAllRaffles } from "services/raffles.service";

export default async function HomePage() {

    const session = await getServerSession();

    const [raffles] = await Promise.all([
        getAllRaffles()
    ]);
    
    return (
        <HomePageComponent />
    )
}

