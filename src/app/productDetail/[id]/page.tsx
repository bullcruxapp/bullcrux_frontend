'use server'
import { getRaffleById } from "@/services/raffles.service";
import ProductDetailComponent from "../component/ProductDetailComponent";
import "../productDetail.css";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const data = await getRaffleById(id);
    const session = await getServerSession(authOptions);


    if(!session) {
        redirect('/login');
    }

    return (
        <ProductDetailComponent productId={id} data={data} userId={session?.user.id} bearerToken={session?.accessToken ?? ''} />
    );
}

