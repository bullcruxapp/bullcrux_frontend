'use server'
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import DrawResultComponent from './component/DrawResultComponent';

export default async function DrawResultPage({
    params,
}: {
    params: Promise<{ id: string }>;
}) {
    const { id } = await params;
    const session = await getServerSession(authOptions);

    const API_URL = process.env.NEXT_PUBLIC_API_URL;
    let result = null;
    try {
        const res = await fetch(`${API_URL}/draw/${id}`, { cache: 'no-store' });
        if (res.ok) result = await res.json();
    } catch (e) {
        console.error('Error fetching draw result:', e);
    }

    return <DrawResultComponent result={result} raffleId={id} />;
}
