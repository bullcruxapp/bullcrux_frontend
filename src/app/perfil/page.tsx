import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import PerfilComponent from "./component/PerfilComponent";
import "./perfil.css";

export default async function PerfilPage() {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
        redirect('/login');
    }
    return <PerfilComponent />;
}
