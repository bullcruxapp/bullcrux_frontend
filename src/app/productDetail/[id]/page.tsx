'use server'
import ProductDetailComponent from "../component/ProductDetailComponent";
import "../productDetail.css";

export default async function ProductDetailPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;

    return (
        <ProductDetailComponent productId={id} />
    );
}

