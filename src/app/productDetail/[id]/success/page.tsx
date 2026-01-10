'use server'
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

    return (
        <PurchaseSuccessComponent
            productId={id}
            quantity={quantity ? parseInt(quantity) : 1}
        />
    );
}
