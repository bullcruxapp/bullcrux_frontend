const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL;

export const joinWaitlist = async (email: string) => {
    const response = await fetch(`${API_URL}/waitlist/join`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
    });

    if (!response.ok) {
        const data = await response.json().catch(() => null);
        throw new Error(data?.message || 'No pudimos anotarte, probá de nuevo');
    }

    return response.json();
};
