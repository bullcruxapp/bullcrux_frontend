'use server'
import { getRaffleById } from "@/services/raffles.service";
import PurchaseSuccessComponent from "../component/PurchaseSuccessComponent";
import "../purchase-success.css";

export default async function PurchaseSuccessPage({
    params,
    searchParams,
}: {
    params: Promise<{ id: string }>;
    searchParams: Promise<{ quantity?: string }>;
}) {
    const { id } = await params;
    const { quantity } = await searchParams;

    const data = await getRaffleById(id);

    return (
        <PurchaseSuccessComponent
            productId={id}
            quantity={quantity ? parseInt(quantity) : 1}
            data={data}
        />
    );
}
