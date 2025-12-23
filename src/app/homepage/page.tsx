'use server'
import HomePageComponent from "./component/HomePageComponent"
import { getServerSession } from "next-auth";
import "./homepage.css";

export default async function HomePage() {

    const session = await getServerSession();
    console.log("Session in homepage:", session);

    return (
        <HomePageComponent />
    )
}

