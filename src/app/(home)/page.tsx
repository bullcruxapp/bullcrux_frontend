import { getServerSession } from "next-auth"
import { getAllRaffles } from "services/raffles.service";

export default async function Home() {

    //CON ESTA VARIABLE PODEMOS SABER SI EL USUARIO ESTA LOGUEADO O NO
    const session = await getServerSession();


    const [raffles] = await Promise.all([
        getAllRaffles(),
    ]);

    console.log(raffles);

    return (
        <main>
            <h1>Welcome to the Home Page, {session?.user?.email || 'Logueate amigo'}</h1>
        </main>
    )
}