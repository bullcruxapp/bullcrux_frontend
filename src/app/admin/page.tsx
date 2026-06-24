import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import AdminComponent from "./component/AdminComponent";

export default async function AdminPage() {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
        redirect('/login');
    }

    if (!(session as any).isAdmin) {
        redirect('/');
    }

    return <AdminComponent token={(session as any).accessToken} />;
}
