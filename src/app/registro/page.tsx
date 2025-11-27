'use server'
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import RegisterComponent from "./component/RegisterComponent";



export default async function Register() {

    const session = await getServerSession();
    console.log("Session in login page:", session);

    if(session){
        redirect('/');
    }

    return (
        <RegisterComponent />
    )
}