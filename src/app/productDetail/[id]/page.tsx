'use server'
import { getRaffleById } from "@/services/raffles.service";
import ProductDetailComponent from "../component/ProductDetailComponent";
import "../productDetail.css";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    const data = await getRaffleById(id);

    return (
        <ProductDetailComponent productId={id} data={data} />
    );
}

