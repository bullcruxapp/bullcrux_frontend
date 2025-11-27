'use server'
import LoginComponent from "./component/LoginComponent"
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";



export default async function Login() {

    //ACA IRIA EL PROTECTED PAGE (EN ESTE CASO NO ES NECESARIO)

    //EJEMPLO DE PROMISE
    // const [users, raffles] = await Promise.all([
    //     getUsers(),
    //     getRaffles()
    // ]);

    const session = await getServerSession();
    console.log("Session in login page:", session);

    if(session){
        redirect('/');
    }

    return (
        <LoginComponent />
    )
}